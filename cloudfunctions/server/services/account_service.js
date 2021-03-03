const {dao, services} = require('../inject');
const {throwError, errors} = require('../errors');
const {userHandler} = require('./handler');

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
}

module.exports = AccountService;