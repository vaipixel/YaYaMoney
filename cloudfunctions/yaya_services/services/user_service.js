const Service = require('./base');
console.log('adscasdc')
console.log(Service);
const {initCloud} = require('yaya_utils');
const {UserDao} = require('yaya_dao');

const cloud = initCloud();
const dao = new UserDao();

class UserService {
    async login(loginData) {
        const {OPENID} = cloud.getWXContext();
        loginData.userInfo.openid = OPENID;
        if (await dao.isUserExist(OPENID)) {
            await dao.updateUser(loginData.userInfo);
        } else {
            await dao.addUser(loginData.userInfo);
        }
        return await dao.getUserInfoByOpenid(OPENID);
    }

    async getUserInfosByUserIds(userIds) {
        console.log('getUserInfosByUserIds: ');
        console.log(userIds);

        let userInfos = [];
        for (const userId of userIds) {
            let userInfo = await dao.getUserInfoByUserId(userId);
            userInfos.push(userInfo);
        }
        return userInfos;
    }

    async getUserInfoByUserId(userId) {
        return await dao.getUserInfoByUserId(userId);
    }

    async getUserInfosByUserIds(userIds) {
        console.log('getUserInfosByUserIds: ');
        console.log(userIds);

        let userInfos = [];
        for (const userId of userIds) {
            let userInfo = await dao.getUserInfoByUserId(userId);
            userInfos.push(userInfo);
        }
        return userInfos;
    }
}

module.exports = UserService;