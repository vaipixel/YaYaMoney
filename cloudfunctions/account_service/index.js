// 云函数入口文件
const cloud = require('wx-server-sdk')
const {AccountDao, UserDao, RecordDao} = require('./dao');

cloud.init();

const accountDao = new AccountDao();
const userDao = new UserDao();
const recordDao = new RecordDao();

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
    case 'getGroupAccounts':
      return getGroupAccounts(event.data);
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
  }
}

async function getGroupAccounts(groupId) {
  let {OPENID} = cloud.getWXContext();
  console.log(OPENID);
  return await accountDao.getGroupAccounts(groupId);
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
 * @param data /{ userId: 'b00064a76038c8810745c4b515c4e4ae', cutOffDate: date }
 * @returns {Promise<number|number|PaymentCurrencyAmount|*>}
 */
async function getAccountAmount(data) {
  let {accountId, cond } = data;
  cond = {
    userId: 'b00064a76038c8810745c4b515c4e4ae',
    cutOffDate: new Date()
  }
  let incomeAmount = await recordDao.getIncomeRecordAmount(accountId, cond);
  let outcomeAmount = await recordDao.getOutcomeRecordAmount(accountId, cond);
  return incomeAmount - outcomeAmount;
}