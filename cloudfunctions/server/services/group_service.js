const {dao, services} = require('../inject');
const {throwError, errors} = require('../errors');
const {groupUtils, dateUtils} = require('./utils');
const {userHandler} = require('./handler');

class GroupService {
    async createGroup(character) {
        // todo check
        let userInfo = await userHandler.getCurrentUserInfo();
        if (userInfo.groupId) {
            throwError(errors.GROUP_USER_ALREADY_JOIN_GROUP);
        }
        let groupId = await dao.groupDao.addGroup({creator: userInfo._id});
        await this.joinGroup({groupId, character});
        return groupId
    }

    async joinGroup(data) {
        // 检查用户之前有没有加入群组
        let {groupId, character} = data;
        await groupUtils.checkGroup(groupId);
        let userInfo = await userHandler.getCurrentUserInfo();
        userInfo = {
            ...userInfo,
            groupId,
            character
        }
        await dao.userDao.updateUser(userInfo);

        userHandler.refreshCurrentUser()
        return 'success';
    }

    async leaveGroup() {

    }

    async isUserAlreadyJoinGroup() {
        let userInfo = await userHandler.getCurrentUserInfo();
        return !!userInfo.groupId;
    }

    async currentUserIsGroupCreator(groupId) {
        let userInfo = await userHandler.getCurrentUserInfo();
        let creatorId = await dao.groupDao.getGroupCreatorId(groupId);
        return userInfo._id === creatorId;
    }

    async isGroupReady(groupId) {
        let users = await dao.userDao.getUsersByGroupId(groupId);
        console.log('users.length === 2 ');
        console.log(users.length === 2)
        return users.length === 2;
    }

    async getGroupInfoWithIncomeRate(interval) {
        let userInfo = await userHandler.getCurrentUserInfo();
        let groupId = userInfo.groupId;
        let cutOffDate = dateUtils.getDateByInterval(interval);
        let accounts = await this.getGroupAccounts({groupId, cutOffDate});
        let members = await this.getGroupMembers();
        let overview = await this.getGroupOverview(groupId);
        return {
            overview,
            members,
            accounts
        }
    }

    async getGroupAccounts(query) {
        let {groupId, cutOffDate} = query;
        let accounts = await services.accountService.getGroupAccounts(query);
        return accounts;
    }

    async getGroupMembers() {
        let currentUserInfo = await userHandler.getCurrentUserInfo();
        let groupId = currentUserInfo.groupId;
        let members = await services.userService.getMembersInGroup(groupId);
        let result = {};
        for (let member of members) {
            if (member._id === currentUserInfo._id) {
                result.me = member;
            } else {
                result.partner = member;
            }
        }
        return result;
    }

    async getGroupOverview(groupId) {
        return {
            amount: 1000,
            income: {
                amount: 100,
                rate: '10%'
            }
        }
    }
}

module.exports = GroupService;