const {dao} = require('../inject');
const cloud = require('wx-server-sdk');
const {throwError, errors} = require('../errors');

class UserService {

    async isUserRegistered() {
        let {OPENID} = cloud.getWXContext();
        return await dao.userDao.isUserRegistered(OPENID);
    }

    async login(loginData) {
        console.log('login');
        const {OPENID} = cloud.getWXContext();
        loginData.userInfo.openid = OPENID;
        console.log(loginData);
        if (await dao.userDao.isUserRegistered(OPENID)) {
            console.log('updateUser')
            await dao.userDao.updateUser(loginData.userInfo);
        } else {
            console.log('addUser');
            await dao.userDao.addUser({
                ...loginData.userInfo,
                openid: OPENID
            });
        }
        return await dao.getUserInfoByOpenid(OPENID);
    }
}

module.exports = UserService;