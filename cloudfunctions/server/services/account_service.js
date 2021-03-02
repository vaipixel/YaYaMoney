const {dao, services} = require('../inject');
const {throwError, errors} = require('../errors');
class AccountService {

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