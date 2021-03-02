const {dao} = require('../inject');
const cloud = require('wx-server-sdk');
const {throwError, errors} = require('../errors');

class UserService {

    async isUserRegistered() {
        let {OPENID} = cloud.getWXContext();
        return await dao.userDao.isUserRegistered(OPENID);
    }

    async login(loginData) {
        const {OPENID} = cloud.getWXContext();
        loginData.userInfo.openid = OPENID;
        if (await dao.userDao.isUserRegistered(OPENID)) {
            await dao.userDao.updateUser(loginData.userInfo);
        } else {
            await dao.userDao.addUser({
                ...loginData.userInfo,
                openid: OPENID
            });
        }
        return await dao.getUserInfoByOpenid(OPENID);
    }

    async getMembersInGroup(groupId) {
        return await dao.userDao.getUsersByGroupId(groupId);
    }
}

module.exports = UserService;