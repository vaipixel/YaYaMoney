const {dao, services} = require('../inject');
const {throwError, errors} = require('../errors');
const {userHandler} = require('./handler');

const TYPE_ADJUST_MONEY = '调整余额';
const TYPE_TRANSFER = '转账';

class RecordService {

    async addRecord(record) {
        if (!record.creator) {
            let userInfo = await userHandler.getCurrentUserInfo();
            record.creator = userInfo._id;
        }
        record.date = new Date(record.date);
        let {type} = record;
        if (type === TYPE_ADJUST_MONEY) {
            return await this._addAdjustMoneyRecord(record);
        } else if (type === TYPE_TRANSFER) {
            return await this._addTransferRecord(record);
        }
    }

    async getAdjustMoneyRecordByCutOffDate(cond) {
        let {accountId, userId, cutOffDate} = cond;
        if (!cutOffDate) {
            cond.cutOffDate = new Date();
        }
        cond.type = '调整余额';
        let records = await dao.recordDao.getRecords(cond);
        console.log(records);
        //    todo
    }

    async _addAdjustMoneyRecord(record) {
        let {accountId, creator} = record;
        await this._checkPermission(creator, accountId);
        return await dao.recordDao.addRecord(record);
    }

    async _addTransferRecord(record) {
        let {fromAccount, targetAccount, creator} = record;
        await this._checkPermission(creator, fromAccount, targetAccount);
        return await dao.recordDao.addRecord(record);
    }

    async _checkPermission(userId, ...accountIds) {
        let userInfo = await userHandler.getCurrentUserInfo();
        let groupIds = new Set();
        if (userId !== userInfo._id) {
            throwError(errors.RECORD_NO_PERMISSION_EDIT_OTHER_GROUP);
        } else {
            let groupId = await dao.userDao.getGroupId(userId);
            groupIds.add(groupId);
        }
        for (let accountId of accountIds) {
            let groupId = await dao.accountDao.getGroupId(accountId);
            groupIds.add(groupId);
        }
        if (groupIds.size !== 1) {
            throwError(errors.RECORD_NO_PERMISSION_EDIT_OTHER_GROUP);
        }
    }
}

module.exports = RecordService;