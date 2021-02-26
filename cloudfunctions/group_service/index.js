// 云函数入口文件
const cloud = require('wx-server-sdk')

const {GroupDao, UserDao} = require('./dao.js');
const groupDao = new GroupDao();
const userDao = new UserDao();

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
    let groupId = await userDao.getGroupIdByUserId(userId);
    let members = await getGroupMembers(groupId);
    let accounts = await getGroupAccounts(groupId);
    let overview = await _getGroupOverview(groupId);
    return {
        groupId,
        members,
        accounts
    };
}

async function createGroup(data) {
    let {creator, character} = data;
    if (await isUserHasGroup(creator)) {
        throw new Error('This user: {' + creator + '} already had group.');
    } else {
        let groupId = await groupDao.addGroup({creator});
        await joinGroup({
            userId: creator,
            groupId,
            character
        });
        return 'success';
    }
}

async function joinGroup(data) {
    let {userId, groupId, character} = data;
    _checkGroup(groupId);
    let userInfo = await userDao.getUserInfo(userId);
    userInfo = {
        ...userInfo,
        groupId,
        character
    }
    await userDao.updateUser(userInfo);
    return 'success';
}

async function isUserHasGroup(userId) {
    let groupId = (await userDao.getUserInfo(userId)).groupId;
    return !(groupId === undefined || groupId == null || groupId === "");
}

async function getGroupMembers(groupId) {
    let groupMembers = {}
    let wxContext = cloud.getWXContext();
    let {OPENID} = wxContext;
    let members = await userDao.getUsersByGroupId(groupId);
    for (const member of members) {
        if (OPENID === member.openid) {
            member.character = '我';
            groupMembers.me = member;
        } else {
            groupMembers.partner = member;
        }
    }
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
    let groupAccounts = result.result;
    let {OPENID} = cloud.getWXContext();
    // 将角色换成 '我'
    groupAccounts.forEach(account => [
        account.members = account.members.map(member => {
            if (OPENID === member.openid) {
                member.character = '我';
            }
            return member;
        })
    ]);
    return groupAccounts;
}

async function _getGroupOverview(groupId) {

}

async function _checkGroup(groupId) {
    if ((await userDao.getUsersByGroupId(groupId)).length > 2) {
        throw new Error('This group has full');
    }
}