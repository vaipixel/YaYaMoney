const {dao, services} = require('../inject');
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
        if (!OPENID) {
            throwError(errors.USER_OPENID_IS_NULL);
        }
        if (await dao.userDao.isUserRegistered(OPENID)) {
            let currentUser = await userHandler.getCurrentUserInfo();
            userInfo._id = currentUser._id;
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
        console.log(currentUserInfo);
        let groupId = await dao.userDao.getGroupId(currentUserInfo._id);
        return !strUtils.isStrEmpty(groupId);
    }

    getUserInfo(userId) {
        return dao.userDao.getUserInfo(userId);
    }

    async isUserGroupReady() {
        let hasGroup = await this.isUserHasGroup();
        let currentUserInfo = await userHandler.getCurrentUserInfo();
        let result = await services.groupService.isGroupReady(currentUserInfo.groupId);
        return hasGroup && result;
    }
}

module.exports = UserService;
