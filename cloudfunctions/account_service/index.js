// 云函数入口文件
const cloud = require('wx-server-sdk')
const {AccountDao, UserDao, RecordDao} = require('./dao');
const {getChineseMonth} = require('./utils');

cloud.init();

const accountDao = new AccountDao();
const userDao = new UserDao();
const recordDao = new RecordDao();

const TYPE_ADJUST_MONEY = '调整余额';
const TYPE_TRANSFER = '转账';

// 云函数入口函数
exports.main = async (event, context) => {
    console.log(event.action);
    switch (event.action) {
        case 'getGroupAccounts':
            return await getGroupAccounts(event.data);
        case 'addAccount':
            return addAccount(event.data);
        case 'addUserToAccount':
            await accountDao.addUserToAccount(event.data.accountId, event.data.userId);
            return 'success';
        case 'removeUserFromAccount':
            await accountDao.removeUserFromAccount(event.data.accountId, event.data.userId);
            return 'success';
        case 'getGroupId':
            // 获取账户所属的群组 id
            return await accountDao.getGroupId(event.data);
        case 'getAccountInfo':
            return await accountDao.getAccountInfo(event.data);
        case 'getAccountAmount':
            return getAccountAmount(event.data);
        case 'getAccountMemberAmount':
            return await getAccountMemberAmount(event.data);
        case 'getAccountRecords':
            return await getAccountRecords(event.data);
        case 'addRecord':
            return addRecord(event.data);
        case 'updateRecord':
            return updateRecord(event.data);
    }
}

async function getGroupAccounts(data) {
    let {groupId, cutOffDate} = data;
    // cutOffDate = new Date(2021, 0, 1, 0, 0, 0);
    let accounts = await accountDao.getGroupAccounts(groupId);
    for (const account of accounts) {
        for (let member of account.members) {
            let conf = {accountId: account._id, userId: member._id};
            if (cutOffDate) {
                conf.cutOffDate = cutOffDate;
            }
            member.amount = await getAccountMemberAmount(conf);
        }
        account.amount = account.members.reduce((amount, member) => amount + member.amount, 0)
    }
    return accounts;
}

async function addAccount(account) {
    let {OPENID} = cloud.getWXContext();
    let accountId = await accountDao.addAccount(account);
    let userId = await userDao.getUserIdByOpenid(OPENID);
    await accountDao.addUserToAccount(accountId, userId);
    return accountId;
}

/**
 *
 * @param cond /{ userId: 'b00064a76038c8810745c4b515c4e4ae', startDate: date }
 * @returns {Promise<number|number|PaymentCurrencyAmount|*>}
 */
async function getAccountAmount(cond) {
    // cond={
    //     accountId: 'b00064a76038d01e0747120716faece2',
    //     startDate: new Date(2021, 1)
    // }
    if (cond.startDate) {
        cond.startDate = new Date(cond.startDate);
    }
    if (!cond.accountId) {
        throw new Error('The accountId is undefined');
    }
    let incomeAmount = await recordDao.getIncomeRecordAmount(cond);
    let outcomeAmount = await recordDao.getOutcomeRecordAmount(cond);
    return incomeAmount - outcomeAmount;
}

async function getAccountMemberAmount(cond) {
    // cond = {
    //     userId: 'b00064a76038c8810745c4b515c4e4ae',
    //     startDate: new Date(2021, 1, 26),
    //     // accountId: 'b00064a76038d01e0747120716faece2'
    // }
    if (cond.cutOffDate) {
        cond.cutOffDate = new Date(cond.cutOffDate);
    }
    let {accountId, userId} = cond;
    if (!accountId || !userId) {
        throw new Error('The userId is undefined');
    }
    let incomeAmount = await recordDao.getIncomeRecordAmount(cond);
    let outcomeAmount = await recordDao.getOutcomeRecordAmount(cond);
    return incomeAmount - outcomeAmount;
}

async function addRecord(record) {
    console.log('addRecord');
    console.log(record);
    let {OPENID} = cloud.getWXContext();
    record.creator = await userDao.getUserIdByOpenid(OPENID);

    console.log(record.date);
    record.date = new Date(record.date);
    console.log(record.date);

    let {type} = record;
    if (type === TYPE_ADJUST_MONEY) {
        await _addAdjustMoneyRecord(record);
    } else if (type === TYPE_TRANSFER) {
        await _addTransferRecord(record);
    }
    return 'success';
}

async function updateRecord(data) {
    let {type, creator} = data;
    if (type === TYPE_ADJUST_MONEY) {
        let {accountId} = data;
        await _checkPermission(creator, accountId);
    } else if (type === TYPE_TRANSFER) {
        let {fromAccountId, targetAccountId} = data;
        await _checkPermission(creator, fromAccountId);
        await _checkPermission(creator, targetAccountId);
    }
    await recordDao.updateRecord(data);
    return 'success';
}

async function getAccountRecords(query) {
    const {accountId, userId, offset, pageSize} = query;
    let records = await recordDao.getAccountRecords_new(accountId, userId, offset, pageSize);
    let accountInfo = await accountDao.getAccountInfo(accountId);
    for (const record of records) {
        record.creator = await _getUserInfo(record.creator);
        let {type} = record;
        if (type === TYPE_TRANSFER) {
            if (record.fromAccount === accountId) {
                record.fromAccount = accountInfo;
            } else {
                record.fromAccount = await accountDao.getAccountInfo(record.fromAccount);
            }
            if (record.targetAccount === accountId) {
                record.targetAccount = accountInfo;
            } else {
                record.targetAccount = await accountDao.getAccountInfo(record.targetAccount);
            }
        } else if (type === TYPE_ADJUST_MONEY) {
            record.account = accountInfo;
            delete record.accountId;
        }
    }
    let resultObj = records.reduce((result, record) => {
        (result[record.monthIndex] = result[record.monthIndex] || []).push(record);
        delete record.monthIndex;
        return result;
    }, {});

    let result = [];
    Object.keys(resultObj).forEach(key => {
        result.push({
            month: key,
            name: getChineseMonth(key),
            records: resultObj[key]
        });
    });
    return result;
}

async function _addAdjustMoneyRecord(record) {
    let {accountId, creator} = record;
    await _checkPermission(creator, accountId);
    await recordDao.addRecord(record);
}

async function _addTransferRecord(record) {
    let {fromAccount, targetAccount, creator} = record;
    await _checkPermission(creator, fromAccount);
    await _checkPermission(creator, targetAccount);
    await recordDao.addRecord(record);
}

async function _getUserInfo(userId) {
    let userInfo = await userDao.getUserInfo(userId);
    let {OPENID} = cloud.getWXContext();
    if (OPENID === userInfo.openid) {
        userInfo.character = '我';
    }
    return userInfo;
}

async function _checkPermission(userId, accountId) {
    let accountGroupId = (await cloud.callFunction({
        name: 'account_service',
        data: {
            action: 'getGroupId',
            data: accountId
        }
    })).result;
    let userGroupId = (await cloud.callFunction({
        name: 'user_service',
        data: {
            action: 'getGroupId',
            data: userId
        }
    })).result;
    if (accountGroupId !== userGroupId) {
        throw new Error(`Can not modify other group's account's record! user: {${userId} accountId: {${accountId}`);
    }
}