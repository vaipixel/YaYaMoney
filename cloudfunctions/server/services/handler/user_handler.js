const cloud = require('wx-server-sdk');

const openidUserInfoMap = {};

class UserHandler {

    async getCurrentUserInfo() {
        console.log('getCurrentUserInfo');
        let {OPENID} = cloud.getWXContext();
        console.log(`OPENID: ${OPENID}`);
        if (openidUserInfoMap[OPENID]) {
            return Promise.resolve(openidUserInfoMap[OPENID]);
        } else {
            const {dao} = require('../../inject');
            let userInfo = await dao.userDao.getUserInfoByOpenid(OPENID);
            console.log('getUserInfoFromDb');
            console.log(userInfo);
            return userInfo;
        }
    }

    refreshCurrentUser() {
        let {OPENID} = cloud.getWXContext();
        delete openidUserInfoMap[OPENID];
    }
}

module.exports = UserHandler