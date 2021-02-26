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

    }

    async deleteRecord(recordId) {

    }

    async getAccountRecords(accountId) {

    }
}

module.exports = RecordDao;