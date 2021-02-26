// 云函数入口文件
const cloud = require('wx-server-sdk')
const {AccountDao, UserDao} = require('./dao');

cloud.init();

const accountDao = new AccountDao();
const userDao = new UserDao();

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