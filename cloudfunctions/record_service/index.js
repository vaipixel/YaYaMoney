// 云函数入口文件
const cloud = require('wx-server-sdk');
const {RecordDao, UserDao, AccountDao} = require('dao');
const TYPE_ADJUST_MONEY = '调整余额';
const TYPE_TRANSFER = '转账';

cloud.init();

const recordDao = new RecordDao();
const userDao = new UserDao();
const accountDao = new AccountDao();

// 云函数入口函数
exports.main = async (event, context) => {
    switch (event.action) {
        case 'addRecord':
            return addRecord(event.data);
        case 'updateRecord':
            return updateRecord(event.data);
        case 'getAccountRecords':
            return getAccountRecords(event.data);
    }
}

async function addRecord(data) {
    console.log('addRecord');
    let {type} = data;
    if (type === TYPE_ADJUST_MONEY) {
        await _addAdjustMoneyRecord(data);
    } else if (type === TYPE_TRANSFER) {
        await _addTransferRecord(data);
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
    const {accountId, offset, pageSize} = query;
    let records = await recordDao.getAccountRecords(accountId, offset, pageSize);
    records.map(async record => {
        record.creator = await _getUserInfo(record.creator);
        let {type} = record;
        if (type === TYPE_ADJUST_MONEY) {
            return record;
        } else if (type === TYPE_TRANSFER) {
            record.fromAccount = await accountDao.getAccountInfo(record.fromAccount);
            record.targetAccount = await accountDao.getAccountInfo(record.targetAccount);
            return record;
        }
    })
    return records;
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
    console.log(accountGroupId);
    let userGroupId = (await cloud.callFunction({
        name: 'user_service',
        data: {
            action: 'getGroupId',
            data: userId
        }
    })).result;
    console.log(userGroupId);
    if (accountGroupId !== userGroupId) {
        throw new Error(`Can not modify other group's account's record! user: {${userId} accountId: {${accountId}`);
    }
}