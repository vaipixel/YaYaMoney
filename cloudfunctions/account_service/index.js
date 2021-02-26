// 云函数入口文件
const cloud = require('wx-server-sdk')
const AccountDao = require('./dao');

cloud.init();

const dao = new AccountDao();

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
    case 'getGroupAccounts':
      return getGroupAccounts(event.data);
    case 'addAccount':
      return dao.addAccount(event.data);
    case 'addUserToAccount':
      await dao.addUserToAccount(event.data.accountId, event.data.userId);
      return 'success';
    case 'removeUserFromAccount':
      await dao.removeUserFromAccount(event.data.accountId, event.data.userId);
      return 'success';
    case 'getGroupId':
      // 获取账户所属的群组 id
      return await dao.getGroupId(event.data);
  }
}

async function getGroupAccounts(groupId) {
  return await dao.getGroupAccounts(groupId);
}