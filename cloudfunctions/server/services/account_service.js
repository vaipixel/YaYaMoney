const cloud = require('wx-server-sdk');
const Service = require('./base');
const {dao, services} = require('../inject');
const {throwError, errors} = require('../errors');
const {userHandler} = require('./handler');
const {dateUtils} = require('./utils');

const TYPE_ADJUST_MONEY = '调整余额';
const TYPE_TRANSFER = '转账';

class AccountService extends Service {

    async createAccount(accountInfo) {
        let userInfo = await userHandler.getCurrentUserInfo();
        accountInfo.groupId = userInfo.groupId;
        accountInfo.creator = userInfo._id;
        accountInfo.createDate = new Date();
        let members = accountInfo.members;
        delete accountInfo.members;
        let accountId = await dao.accountDao.addAccount(accountInfo);
        for (let member of members) {
            await this.joinAccount({accountId, userId: member._id});
            if (member.initAmount !== 0) {
                let record = {
                    type: '调整余额',
                    amount: member.initAmount,
                    comment: '初始化',
                    date: new Date(),
                    accountId,
                    creator: userInfo._id
                };
                await services.recordService.addRecord(record);
            }
        }
        return accountId;
    }

    async updateAccount(accountInfo) {
        let {accountId, accountName, accountType, accountIcon, accountDesc, members} = accountInfo;
        let updateData = {
            accountName,
            accountType,
            accountIcon,
            accountDesc
        }
        await dao.accountDao.updateAccount(accountId, updateData);
        for (const member of members) {
            if (!(await this.isUserInAccount(member._id, accountId))) {
                let relation = {
                    accountId,
                    userId: member._id
                }
                await this.joinAccount(relation);
            }
        }
        return accountId;
    }

    async joinAccount(relation) {
        relation.createDate = new Date();
        await dao.userAccountRelationDao.addRelation(relation);
    }

    async leaveAccount(accountId, userId) {
        let relation = {
            accountId,
            userId
        }
        await dao.userAccountRelationDao.deleteRelation(relation);
    }

    async getGroupAccounts(query) {
        let {groupId, endDate} = query;
        let accounts = await dao.accountDao.getGroupAccounts(groupId);
        for (let account of accounts) {
            account.amount = 0;
            let members = account.members;
            for (let member of members) {
                let cond = {accountId: account._id, creator: member._id};
                if (endDate) {
                    cond.endDate = endDate;
                }
                member.amount = await this.getAccountMemberAmount(cond);
                account.amount += member.amount;
                this._replaceCharacterForMe(member);
            }
            members.sort((a, b) => {
                if (a.character === '我') {
                    return -1;
                }
                return 1;
            });
        }
        return accounts;
    }

    async getAccountMemberAmount(cond) {
        if (cond.endDate) {
            cond.endDate = new Date(cond.endDate);
        }
        let {accountId, creator} = cond;
        if (!accountId || !creator) {
            throwError(errors.ACCOUNT_ACCOUNT_ID_AND_USER_ID_IS_NECESSARY);
        }
        cond.pageSize = 1;

        let lastAdjustMoneyRecord = await services.recordService.getAdjustMoneyRecordByEndDate(cond);
        let transferCond = {
            creator,
            endDate: cond.endDate,
            accountId
        }
        if (lastAdjustMoneyRecord.date) {
            transferCond.startDate = lastAdjustMoneyRecord.date;
        }

        let transferRecords = await services.recordService.getTransferRecordsByDate(transferCond);
        return this._calculateMemberAmount(accountId, lastAdjustMoneyRecord, transferRecords);
    }

    _calculateMemberAmount(accountId, adjustMoneyRecord, transferRecords) {
        let outAmount = transferRecords.filter(record => record.fromAccount === accountId)
            .reduce((result, record) => result + record.amount, 0);
        let inAmount = transferRecords.filter(record => record.targetAccount === accountId)
            .reduce((result, record) => result + record.amount, 0);
        return adjustMoneyRecord.amount - outAmount + inAmount;
    }

    async getAccountRecords(query) {
        let {accountId} = query;
        let records = await services.recordService.getRecords(query);
        let accountInfo = await this.getAccountInfo(accountId);
        for (let record of records) {
            record.creator = await services.userService.getUserInfo(record.creator);
            let {type} = record;
            if (type === TYPE_TRANSFER) {
                if (record.fromAccount === accountId) {
                    record.fromAccount = accountInfo;
                } else {
                    record.fromAccount = await this.getAccountInfo(record.fromAccount);
                }
                if (record.targetAccount === accountId) {
                    record.targetAccount = accountInfo;
                } else {
                    record.targetAccount = await this.getAccountInfo(record.targetAccount);
                }
            } else if (type === TYPE_ADJUST_MONEY) {
                record.account = accountInfo;
                delete record.accountId;
            }
        }
        let resultObj = records.reduce((result, record) => {
            (result[record.monthIndex] = result[record.monthIndex] || []).push(record);
            delete record.monthIndex;
            return result;
        }, {});
        let result = [];
        Object.keys(resultObj).forEach(key => {
            result.push({
                month: key,
                name: dateUtils.getChineseMonth(key),
                records: resultObj[key]
            });
        });
        return result;
    }

    getAccountInfo(accountId) {
        return dao.accountDao.getAccountInfo(accountId);
    }

    async getAccountInfoWithMembers(accountId) {
        let accountInfo = await dao.accountDao.getAccountWithMembers(accountId);
        if (accountInfo === null) {
            throwError(errors.ACCOUNT_ACCOUNT_NOT_EXIST);
        }
        let accountInfoMembers = accountInfo.members;
        this._replaceCharacterForMeInList(accountInfoMembers);
        let currentUserInfo = await userHandler.getCurrentUserInfo();
        accountInfo.members = {};
        for (let member of accountInfoMembers) {
            if (member._id === currentUserInfo._id) {
                accountInfo.members.me = member;
            } else {
                accountInfo.members.partner = member;
            }
        }
        return accountInfo;
    }

    async isAccountExist(accountId) {
        let accountInfo = await dao.accountDao.getAccountInfo(accountId);
        return accountInfo !== null;
    }

    async isUserInAccount(userId, accountId) {
        return await dao.userAccountRelationDao.isUserInAccount(userId, accountId);
    }
}

module.exports = AccountService;
