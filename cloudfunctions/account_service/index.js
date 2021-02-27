// 云函数入口文件
const cloud = require('wx-server-sdk')
const {AccountDao, UserDao, RecordDao} = require('./dao');

cloud.init();

const accountDao = new AccountDao();
const userDao = new UserDao();
const recordDao = new RecordDao();

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
        case 'getMemberAmount':
            return await getMemberAmount(event.data);
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

async function getMemberAmount(cond) {

}