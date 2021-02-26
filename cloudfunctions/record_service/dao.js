// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();

const record_collection_name = 'records';

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
        console.log(result);
        return result.data;
    }
}

module.exports = RecordDao;