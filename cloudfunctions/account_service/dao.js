// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();

const account_collection_name = 'accounts';
const relation_user_account_collection_name = 'relation_user_account';
const user_collection_name = 'users';
const record_collection_name = 'records';

class AccountDao {
    constructor() {
    }

    async addAccount(account) {
        let db = cloud.database();
        let result = await db.collection(account_collection_name).add({
            data: {
                ...account,
                createTime: new Date()
            }
        });
        return result._id;
    }

    async updateAccount(account) {
        let db = cloud.database();
        await db.collection(account_collection_name).doc(account._id).update({
            data: account
        });
    }

    async deleteAccount(accountId) {
        let db = cloud.database();
        await db.collection(account_collection_name).doc(accountId).update({
            data: {
                delete: true
            }
        });
    }

    async getAccountInfo(accountId) {
        let db = cloud.database();
        let result = await db.collection(account_collection_name)
            .doc(accountId)
            .get();
        return result.data;
    }

    async getGroupAccounts(groupId) {
        let db = cloud.database();
        const _ = db.command;
        let result = await db.collection(account_collection_name)
            .aggregate()
            .match({
                groupId: _.eq(groupId)
            })
            .lookup({
                from: relation_user_account_collection_name,
                localField: '_id',
                foreignField: 'accountId',
                as: 'members'
            })
            .lookup({
                from: 'users',
                localField: 'members.userId',
                foreignField: '_id',
                as: 'members'
            })
            .end();
        return result.list;
    }

    async getAccountMembersId(accountId) {
        let db = cloud.database();
        const _ = db.command;
        let result = await db.collection(relation_user_account_collection_name).where({
            accountId: _.eq(accountId)
        })
            .get();
        return result.data;
    }

    async addUserToAccount(accountId, userId) {
        let db = cloud.database();
        let result = await db.collection(relation_user_account_collection_name)
            .add({
                data: {accountId, userId}
            });
    }

    async removeUserFromAccount(accountId, userId) {
        let db = cloud.database();
        const _ = db.command;
        let result = await db.collection(relation_user_account_collection_name).where({
            accountId: _.eq(accountId),
            userId: _.eq(userId)
        })
            .remove();
    }

    /**
     * 获取账户所属的群组 id
     * @param accountId 账户 id
     * @returns {Promise<void>}
     */
    async getGroupId(accountId) {
        let db = cloud.database();
        let result = await db.collection(account_collection_name).doc(accountId).get();
        return result.data.groupId;
    }
}

class UserDao {
    async getUserIdByOpenid(openid) {
        let db = cloud.database();
        let _ = db.command;
        let result = await db.collection(user_collection_name)
            .where({
                openid: _.eq(openid)
            })
            .get();
        return result.data[0]._id;
    }

    async getUserInfo(userId) {
        let db = cloud.database();
        return (await db.collection(user_collection_name)
            .doc(userId)
            .get()).data;
    }
}

class RecordDao {
    async addRecord(record) {
        let db = cloud.database();
        db.collection(record_collection_name)
            .add({
                data: record
            });
    }

    async updateRecord(record) {
        let db = cloud.database();
        db.collection(record_collection_name)
            .doc(record._id)
            .update({
                data: record
            });
    }

    async deleteRecord(recordId) {
        let db = cloud.database();
        db.collection(record_collection_name)
            .doc(recordId)
            .update({
                data: {
                    deleted: true
                }
            });
    }

    async getAccountRecords(accountId, offset, pageSize) {
        let db = cloud.database();
        let _ = db.command;
        let result = await db.collection(record_collection_name)
            .where(_.or([
                {
                    accountId: _.eq(accountId)
                },
                {
                    fromAccount: _.eq(accountId)
                },
                {
                    targetAccount: _.eq(accountId)
                }
            ]))
            .skip(offset)
            .limit(pageSize)
            .get();
        return result.data;
    }


    async getAccountRecords_new(accountId, userId, offset, pageSize) {
        let db = cloud.database();
        let _ = db.command;
        let result = await db.collection(record_collection_name)
            .where(_.or([
                {
                    accountId: _.eq(accountId)
                },
                {
                    fromAccount: _.eq(accountId)
                },
                {
                    targetAccount: _.eq(accountId)
                }
            ]))
            .skip(offset)
            .limit(pageSize)
            .get();
        return result.data;
    }

    async getIncomeRecordAmount(condition) {
        let db = cloud.database();
        let $ = db.command.aggregate;
        let match = this._createMatchByCond($, condition, this._createIncomeAccountCond);
        let result = await db.collection(record_collection_name).aggregate()
            .match(match)
            .group({
                _id: '1',
                amount: $.sum('$amount')
            })
            .end();
        let list = result.list;
        if (list.length === 0) {
            return 0;
        } else {
            return list[0].amount;
        }
    }

    async getOutcomeRecordAmount(condition) {
        let db = cloud.database();
        let $ = db.command.aggregate;
        let match = this._createMatchByCond($, condition, this._createOutcomeAccountCond);
        let result = await db.collection(record_collection_name).aggregate()
            .match(match)
            .group({
                _id: '1',
                amount: $.sum('$amount')
            })
            .end();
        let list = result.list;
        if (list.length === 0) {
            return 0;
        } else {
            return list[0].amount;
        }
    }

    _createMatchByCond(aggregate, condition, accountCondFn) {
        let match;
        let $ = aggregate;
        if (condition) {
            let cond = [];
            if (condition.userId) {
                cond.push({
                    creator: condition.userId
                });
            }
            if (condition.cutOffDate) {
                cond.push({
                    date: $.gte(condition.cutOffDate)
                });
            }
            if (condition.accountId) {
                cond.push(accountCondFn($, condition.accountId));
            }
            return $.and(cond);
        }
        return {};
    }

    _createIncomeAccountCond(aggregate, accountId) {
        return aggregate.or([
            {
                accountId: aggregate.eq(accountId)
            },
            {
                targetAccount: aggregate.eq(accountId)
            }
        ])
    }

    _createOutcomeAccountCond(aggregate, accountId) {
        return {
            fromAccount: aggregate.eq(accountId)
        }
    }
}

module.exports = {AccountDao, UserDao, RecordDao};