// 云函数入口文件
const cloud = require('wx-server-sdk')

const GroupDao = require('./dao.js');
const dao = new GroupDao();

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
    switch (event.action) {
        case 'getGroupInfoByUser':
            return await getGroupInfoByUser(event.data);
        case 'isUserHasGroup':
            return await isUserHasGroup(event.data);
        case 'createGroup':
            return await createGroup(event.data);
        case 'joinGroup':
            return await joinGroup(event.data);
        case 'getGroupMembers':
            return await getGroupMembers(event.data);
    }
}

async function getGroupInfoByUser(userId) {
    console.log('getGroupInfoByUser');
    let groupId = await dao.getGroupIdByUserId(userId);
    let members = await getGroupMembers(groupId);
    let accounts = await getGroupAccounts(groupId);
    console.log(accounts);
    return {
        groupId,
        members,
        accounts
    };
}

async function createGroup(userId) {
    if ((await dao.getGroupByUserId(userId)).length > 0) {
        throw new Error('This user: {' + userId + '} already had group.');
    } else {
        return await dao.addGroup({
            creator: {
                userId,
                character: '老公'
            }
        });
    }
}

async function joinGroup(userId) {

}

async function isUserHasGroup(userId) {
    return (await dao.getGroupByUserId(userId)).length > 0;
}

async function getGroupMembers(groupId) {
    console.log('getGroupMembers ' + groupId);
    let groupMembers = {}
    let wxContext = cloud.getWXContext();
    let {OPENID} = wxContext;
    let groupMembersId = await dao.getGroupMembersId(groupId);
    let userInfos = (await cloud.callFunction({
        name: 'user_service',
        data: {
            action: 'getUserInfosByUserIds',
            data: groupMembersId
        }
    })).result;
    userInfos.forEach(userInfo => {
        if (OPENID === userInfo.openid) {
            groupMembers.me = userInfo;
        } else {
            groupMembers.partner = userInfo;
        }
    });
    return groupMembers;
}

async function getGroupAccounts(groupId) {
    let result = await cloud.callFunction({
        name: 'account_service',
        data: {
            action: 'getGroupAccounts',
            data: groupId
        }
    });
    return result.result;
}