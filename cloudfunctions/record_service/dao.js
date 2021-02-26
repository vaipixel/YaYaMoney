// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();

const record_collection_name = 'records';
const user_collection_name = 'users';
const account_collection_name = 'accounts';

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
}

class UserDao {
    async getUserInfo(userId) {
        let db = cloud.database();
        return (await db.collection(user_collection_name)
            .doc(userId)
            .get()).data;
    }
}

class AccountDao {
    async getAccountInfo(accountId) {
        let db = cloud.database();
        return (await db.collection(account_collection_name)
            .doc(accountId)
            .get()).data;
    }
}

module.exports = {RecordDao, UserDao, AccountDao};