// 云函数入口文件
const cloud = require('wx-server-sdk')

const {GroupDao, UserDao} = require('./dao.js');
const {getLastYearDate, getLastMonthDate, getLastDayDate, toPercent, calculateIncomeRate} = require('./utils');

const groupDao = new GroupDao();
const userDao = new UserDao();

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
    switch (event.action) {
        case 'getGroupInfoByUser':
            return await getGroupInfoByUser(event.data);
        case 'getGroupInfoWithIncomeRate':
            // 携带收益率
            return await getGroupInfoWithIncomeRate(event.data);
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
    let accounts = await getGroupAccounts({groupId});
    let overview = await _getGroupOverview(groupId, accounts);
    return {
        groupId,
        overview,
        members,
        accounts
    };
}

async function getGroupInfoWithIncomeRate(query) {
    let {userId, interval} = query;
    let groupInfo = await getGroupInfoByUser(userId);
    return await _calculateIncomeRate(groupInfo, interval);
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
        member.amount = await getMemberAmount({userId: member._id})
    }
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

async function getGroupAccounts(query) {
    let result = await cloud.callFunction({
        name: 'account_service',
        data: {
            action: 'getGroupAccounts',
            data: query
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

async function getMemberAmount(query) {
    return (await cloud.callFunction({
        name: 'account_service',
        data: {
            action: 'getMemberAmount',
            data: query
        }
    })).result;
}

async function _calculateIncomeRate(groupInfo, interval) {
    let {overview, members, accounts} = groupInfo;

    let cutOffDate = _getDataByInterval(interval);
    // accounts
    let lastIntervalAccounts = await getGroupAccounts({
        groupId: groupInfo.groupId,
        cutOffDate: cutOffDate
    });
    lastIntervalAccounts.forEach((account, index) => {
        let nowAccount = accounts[index];
        nowAccount.income = {
            amount: nowAccount.amount - account.amount,
            rate: calculateIncomeRate(nowAccount.amount, account.amount)
        }
        account.members.forEach((member, index) => {
            let nowMember = nowAccount.members[index];
            nowMember.income = {
                amount: nowMember.amount - member.amount,
                rate: calculateIncomeRate(member.amount, nowMember.amount)
            }
        })
    });

    // members
    for (let key of Object.keys(members)) {
        let nowMember = members[key];
        let amount = await getMemberAmount({userId: nowMember._id, cutOffDate});
        console.log(cutOffDate);
        console.log(amount);
        nowMember.income = {
            amount: nowMember.amount - amount,
            rate: calculateIncomeRate(nowMember.amount, amount)
        }
    }

    return groupInfo;
}

function _getDataByInterval(interval) {
    switch (interval) {
        case '每日':
            return getLastDayDate();
        case '每月':
            return getLastMonthDate();
        case '每年':
            return getLastYearDate();
        default:
            return getLastMonthDate();
    }
}

async function _getGroupOverview(groupId, accounts) {
    let amount = accounts.reduce((total, account) => {
        return total + account.amount;
    }, 0);
    return {amount}
}

async function _checkGroup(groupId) {
    if ((await userDao.getUsersByGroupId(groupId)).length > 2) {
        throw new Error('This group has full');
    }
}