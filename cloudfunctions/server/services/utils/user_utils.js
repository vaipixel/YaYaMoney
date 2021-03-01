const cloud = require('wx-server-sdk');
const openidUserInfoMap = {};
async function getCurrentUserInfo() {
    let {OPENID} = cloud.getWXContext();
    if (openidUserInfoMap[OPENID]) {
        return Promise.resolve(openidUserInfoMap[OPENID]);
    } else {
        const {dao} = require('../../inject');
        return await dao.userDao.getUserInfoByOpenid(OPENID);
    }
}

module.exports = {
    getCurrentUserInfo
}