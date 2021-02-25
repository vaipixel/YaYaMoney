// 云函数入口文件
const cloud = require('wx-server-sdk');

const {GroupService} = require('yaya_services');

const groupService = new GroupService();

cloud.init();


// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
    case 'getGroupInfoByUser':
      return await groupService.getGroupInfoByUser(event.data);
    case 'isUserHasGroup':
      return await groupService.isUserHasGroup(event.data);
    case 'createGroup':
      return await groupService.createGroup(event.data);
    case 'joinGroup':
      return await groupService.joinGroup(event.data);
    case 'getGroupMembers':
      return await groupService.getGroupMembers(event.data);
  }
}