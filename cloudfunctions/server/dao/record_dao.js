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
        console.log('getRecords');
        console.log(cond);
        let {offset, pageSize} = cond;
        if (!offset) {
            offset = 0;
        }
        if (!pageSize) {
            pageSize = 50;
        }

        let matchRule = _.and(this._getMatchByCond(_, cond));

        let result = await db.collection(record_collection_name)
            .aggregate()
            .match(matchRule)
            .skip(offset)
            .limit(pageSize)
            .sort({
                date: -1
            })
            .project({
                _id: 1,
                accountId: 1,
                amount: 1,
                comment: 1,
                creator: 1,
                date: 1,
                type: 1,
                fromAccount: 1,
                targetAccount: 1,
                monthIndex: _.dateToString({
                    date: '$date',
                    format: '%Y-%m'
                })
            })
            .end();
        return result.list;
    }

    _getMatchByCond(aggregate, cond) {
        let match = [];
        if (cond.accountId) {
            match.push(aggregate.or([
                {
                    accountId: aggregate.eq(cond.accountId)
                },
                {
                    fromAccount: aggregate.eq(cond.accountId)
                },
                {
                    targetAccount: aggregate.eq(cond.accountId)
                }
            ]));
        }
        if (cond.userId) {
            match.push({
                userId: aggregate.eq(cond.userId)
            });
        }
        if (cond.type) {
            match.push({
                type: aggregate.eq(cond.type)
            });
        }
        if (cond.cutOffDate) {
            match.push({
                date: aggregate.lte(cond.cutOffDate)
            });
        }
        return match;
    }
}

module.exports = RecordDao;