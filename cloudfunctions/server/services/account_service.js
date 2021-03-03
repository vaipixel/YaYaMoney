const {dao, services} = require('../inject');
const {throwError, errors} = require('../errors');
const {userHandler} = require('./handler');
const {dateUtils} = require('./utils');

const TYPE_ADJUST_MONEY = '调整余额';
const TYPE_TRANSFER = '转账';

class AccountService {

    async createAccount(accountInfo) {
        let userInfo = await userHandler.getCurrentUserInfo();
        accountInfo.groupId = userInfo.groupId;
        accountInfo.creator = userInfo._id;
        accountInfo.createDate = new Date();
        let members = accountInfo.members;
        delete accountInfo.members;
        let accountId = await dao.accountDao.addAccount(accountInfo);
        console.log(`addAccount ID: ${accountId}`);
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

    async joinAccount(relation) {
        let {accountId, userId} = relation;
        console.log(`joinAccount  accountId: ${accountId}; userId: ${userId}`);
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
        let {groupId, cutOffDate} = query;
        let accounts = await dao.accountDao.getGroupAccounts(groupId);
        for (let account of accounts) {
            let members = account.members;
            for (let member of members) {
                let cond = {accountId: account._id, userId: member._id};
                if (cutOffDate) {
                    cond.cutOffDate = cutOffDate;
                }
                await this.getAccountMemberAmount(cond);
            }
        }
        return accounts;
    }

    async getAccountMemberAmount(cond) {
        if (cond.cutOffDate) {
            cond.cutOffDate = new Date(cond.cutOffDate);
        }
        let {accountId, userId} = cond;
        if (!accountId || !userId) {
            throwError(errors.ACCOUNT_ACCOUNT_ID_AND_USER_ID_IS_NECESSARY);
        }
        await services.recordService.getAdjustMoneyRecordByCutOffDate(cond);
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
        console.log(records);
        let resultObj = records.reduce((result, record) => {
            (result[record.monthIndex] = result[record.monthIndex] || []).push(record);
            delete record.monthIndex;
            return result;
        }, {});
        console.log(resultObj);
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

}

module.exports = AccountService;