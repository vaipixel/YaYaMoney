// 云函数入口文件
const cloud = require('wx-server-sdk');
const UserDao = require('dao');

cloud.init();

const dao = new UserDao();

// 云函数入口函数
exports.main = async (event, context) => {
    switch (event.action) {
        case 'login':
            return await login(event.data);
        case 'getUserInfoByUserId':
            // 获取单个用户的信息
            return await dao.getUserInfoByUserId(event.data);
        case 'getUserInfosByUserIds':
            // 获取多个用户的信息
            return await getUserInfosByUserIds(event.data);
    }
}

async function login(loginData) {
    const {OPENID} = cloud.getWXContext();
    loginData.userInfo.openid = OPENID;
    if (await dao.isUserExist(OPENID)) {
        await dao.updateUser(loginData.userInfo);
    } else {
        await dao.addUser({
            ...loginData.userInfo,
            openid: OPENID
        });
    }
    return await dao.getUserInfoByOpenid(OPENID);
}

async function getUserInfosByUserIds(userIds) {
    console.log('getUserInfosByUserIds: ');
    console.log(userIds);

    let userInfos = [];
    for (const userId of userIds) {
        let userInfo = await dao.getUserInfoByUserId(userId);
        userInfos.push(userInfo);
    }
    return userInfos;
}