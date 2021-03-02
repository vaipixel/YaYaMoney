const cloud = require('wx-server-sdk');

const openidUserInfoMap = {};

class UserHandler {

    async getCurrentUserInfo() {
        let {OPENID} = cloud.getWXContext();
        if (openidUserInfoMap[OPENID]) {
            return Promise.resolve(openidUserInfoMap[OPENID]);
        } else {
            const {dao} = require('../../inject');
            return await dao.userDao.getUserInfoByOpenid(OPENID);
        }
    }

    refreshCurrentUser() {
        let {OPENID} = cloud.getWXContext();
        delete openidUserInfoMap[OPENID];
    }
}

module.exports = UserHandler