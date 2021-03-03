const cloud = require('wx-server-sdk');

const openidUserInfoMap = {};

class UserHandler {

    async getCurrentUserInfo() {
        let {OPENID} = cloud.getWXContext();
        console.log(`OPENID: ${OPENID}`);
        if (openidUserInfoMap[OPENID]) {
            console.log('getUserInfoFromMemory');
            return Promise.resolve(openidUserInfoMap[OPENID]);
        } else {
            const {dao} = require('../../inject');
            let userInfo = await dao.userDao.getUserInfoByOpenid(OPENID);
            openidUserInfoMap[OPENID] = userInfo;
            console.log('getUserInfoFromDb');
            return userInfo;
        }
    }

    refreshCurrentUser() {
        let {OPENID} = cloud.getWXContext();
        delete openidUserInfoMap[OPENID];
    }
}

module.exports = UserHandler