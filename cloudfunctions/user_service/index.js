// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

const user_collection_name = 'users';

// 云函数入口函数
exports.main = async (event, context) => {
    switch (event.action) {
        case 'login':
            return await login(event.data);
    }
}

async function login(loginData) {
    const {OPENID} = cloud.getWXContext();
    loginData.userInfo.openid = OPENID;
    if (await _isUserExist(OPENID)) {
        await _updateUser(loginData.userInfo);
    } else {
        await _addUser(loginData.userInfo);
    }
    return await getUserInfo(OPENID);
}

async function getUserInfo(openid) {
    const db = cloud.database();
    const _ = db.command
    let result = await db.collection(user_collection_name).where({
        openid: _.eq(openid)
    })
        .get();
    return result.data[0];
}

async function _isUserExist(openid) {
    const db = cloud.database();
    const _ = db.command
    let result = await db.collection(user_collection_name).where({
        openid: _.eq(openid)
    })
        .get();
    return result.data && result.data.length > 0
}

async function _addUser(userInfo) {
    const db = cloud.database();
    await db.collection(user_collection_name).add({
        data: userInfo
    });
}

async function _updateUser(userInfo) {
    const db = cloud.database();
    const _ = db.command
    await db.collection(user_collection_name).where({
        openid: _.eq(userInfo.openid)
    }).update({
        data: userInfo
    });
}

