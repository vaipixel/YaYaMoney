const Service = require('./base');
const {dao, services} = require('../inject');
const {throwError, errors} = require('../errors');
const {groupUtils, dateUtils, numberUtils} = require('./utils');
const {userHandler} = require('./handler');

class GroupService extends Service {
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
        return users.length === 2;
    }

    async getGroupInfoWithIncomeRate(interval) {
        let userInfo = await userHandler.getCurrentUserInfo();
        let groupId = userInfo.groupId;
        let endDate = dateUtils.getDateByInterval(interval);
        let currentGroupInfo = await this._getGroupInfo(groupId);
        // 上一个统计周期的账户信息
        let lastIntervalGroupInfo = await this._getGroupInfo(groupId, interval);
        return this._calculateIncome(currentGroupInfo, lastIntervalGroupInfo)
    }

    async _getGroupInfo(groupId, interval) {
        let query = {groupId};
        if (interval) {
            query.interval = interval;
        }
        let accounts = await this.getGroupAccounts(query);
        let members = await this.getGroupMembers();
        members.me.amount = this._calculateMemberAmount(members.me, accounts);
        members.partner.amount = this._calculateMemberAmount(members.partner, accounts);
        let overview = await this.getGroupOverview(members);
        return {
            overview,
            members,
            accounts: accounts
        }
    }

    _calculateMemberAmount(member, accounts) {
        return accounts.reduce((accountAmount, account) => {
            let tmp = 0;
            Object.keys(account.members)
                .filter(key => account.members[key]._id === member._id)
                .forEach(key => {
                    tmp = account.members[key].amount;
                });
            return accountAmount + tmp;
        }, 0);
    }

    _calculateIncome(groupInfo, lastIntervalGroupInfo) {
        // 计算 overview
        let overview = groupInfo.overview;
        let lastIntervalOverview = lastIntervalGroupInfo.overview;
        overview.income = {
            amount: overview.amount - lastIntervalOverview.amount,
            rate: numberUtils.calculateIncomeRate(overview.amount, lastIntervalOverview.amount)
        };

        // 计算 members
        let members = groupInfo.members;
        let lastIntervalMembers = lastIntervalGroupInfo.members;
        members.me.income = {
            amount: members.me.amount - lastIntervalMembers.me.amount,
            rate: numberUtils.calculateIncomeRate(members.me.amount, lastIntervalMembers.me.amount)
        }
        members.partner.income = {
            amount: members.partner.amount - lastIntervalMembers.partner.amount,
            rate: numberUtils.calculateIncomeRate(members.partner.amount, lastIntervalMembers.partner.amount)
        }

        // 计算 accounts
        let accounts = groupInfo.accounts;
        let lastIntervalAccounts = lastIntervalGroupInfo.accounts;
        accounts.forEach((account, index) => {
            let lastIntervalAccount = lastIntervalAccounts[index];
            account.income = {
                amount: account.amount - lastIntervalAccount.amount,
                rate: numberUtils.calculateIncomeRate(account.amount, lastIntervalAccount.amount)
            };

            // 计算 account 的 members
            let lastAccountMembers = lastIntervalAccount.members;
            account.members.forEach((member, index) => {
                member.income = {
                    amount: member.amount - lastAccountMembers[index].amount,
                    rate: numberUtils.calculateIncomeRate(member.amount, lastAccountMembers[index].amount)
                };
            });
        });
        return groupInfo;
    }

    async getGroupAccounts(query) {
        let {interval} = query;
        if (interval) {
            delete query.interval;
            query.endDate = dateUtils.getDateByInterval(interval);
        }
        return await services.accountService.getGroupAccounts(query);
    }

    async getGroupMembers() {
        let currentUserInfo = await userHandler.getCurrentUserInfo();
        let groupId = currentUserInfo.groupId;
        let members = await services.userService.getMembersInGroup(groupId);
        this._replaceCharacterForMeInList(members);
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

    async getGroupOverview(members) {
        return {
            amount: members.me.amount + members.partner.amount
        }
    }
}

module.exports = GroupService;
