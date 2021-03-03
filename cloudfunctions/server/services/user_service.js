const {dao} = require('../inject');
const cloud = require('wx-server-sdk');
const {throwError, errors} = require('../errors');
const {userHandler} = require('./handler');
const {strUtils} = require('./utils');

class UserService {

    async isUserRegistered() {
        let {OPENID} = cloud.getWXContext();
        return await dao.userDao.isUserRegistered(OPENID);
    }

    async login(loginData) {
        const {OPENID} = cloud.getWXContext();
        let userInfo = loginData.userInfo;
        userInfo.openid = OPENID;
        if (await dao.userDao.isUserRegistered(OPENID)) {
            let currentUser = await userHandler.getCurrentUserInfo();
            userInfo._id = currentUser._id;
            console.log('update ');
            console.log(loginData.userInfo);
            await dao.userDao.updateUser(loginData.userInfo);
        } else {
            await dao.userDao.addUser({
                ...loginData.userInfo,
                openid: OPENID
            });
        }
        return await dao.userDao.getUserInfoByOpenid(OPENID);
    }

    async getMembersInGroup(groupId) {
        return await dao.userDao.getUsersByGroupId(groupId);
    }

    async isUserHasGroup() {
        let currentUserInfo = await userHandler.getCurrentUserInfo();
        let groupId = await dao.userDao.getGroupId(currentUserInfo._id);
        return !strUtils.isStrEmpty(groupId);
    }
}

module.exports = UserService;