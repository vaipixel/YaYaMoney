const cloud = require('wx-server-sdk');

class UserHandler {

    async getCurrentUserInfo() {
        cloud.init();
        let {OPENID} = cloud.getWXContext();
        console.log(`OPENID: ${OPENID}`);
        const {dao} = require('../../inject');
        return await dao.userDao.getUserInfoByOpenid(OPENID);
    }

}

module.exports = UserHandler
