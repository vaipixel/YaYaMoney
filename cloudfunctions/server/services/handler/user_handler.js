const cloud = require('wx-server-sdk');

class UserHandler {

    async getCurrentUserInfo() {
        console.log('isTest: ' + cloud.isTest);
        let OPENID = '';
        if (cloud.isTest) {
            OPENID = 'test-user-1';
        } else {
            OPENID = cloud.getWXContext().OPENID;
        }
        console.log(`OPENID: ${OPENID}`);
        const {dao} = require('../../inject');
        return await dao.userDao.getUserInfoByOpenid(OPENID);
    }

}

module.exports = UserHandler
