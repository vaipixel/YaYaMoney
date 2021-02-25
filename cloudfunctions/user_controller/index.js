// 云函数入口文件
const cloud = require('wx-server-sdk');

const {UserService} = require('yaya_services');

const userService = new UserService();

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
    case 'login':
      return await userService.login(event.data);
    case 'getUserInfoByUserId':
      // 获取单个用户的信息
      return await userService.getUserInfoByUserId(event.data);
    case 'getUserInfosByUserIds':
      // 获取多个用户的信息
      return await userService.getUserInfosByUserIds(event.data);
  }
}