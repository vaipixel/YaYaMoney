const cloud = require('wx-server-sdk');
const record_collection_name = 'records';

class RecordDao {

    async addRecord(record) {
        let db = cloud.database();
        let result = await db.collection(record_collection_name)
            .add({
                data: record
            });
        return result._id;
    }

    async getRecords(cond) {
        let db = cloud.database();
        let _ = db.command.aggregate;

        let matchRule = _.and([
            {
                accountId: _.eq(cond.accountId)
            },
            {
                userId: _.eq(cond.userId)
            },
            {
                type: _.eq(cond.type)
            },
            {
                dats: _.lte(cond.cutOffDate)
            }
        ]);

        let result = await db.collection(record_collection_name)
            .aggregate()
            .match(matchRule)
            .sort({
                date: -1
            })
            .end();
        return result.data;
    }
}

module.exports = RecordDao;