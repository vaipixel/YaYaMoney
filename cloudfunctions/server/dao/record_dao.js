const cloud = require('wx-server-sdk');
const record_collection_name = 'records';

class RecordDao {

    async addRecord(record) {
        record.amount = parseFloat(record.amount);
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
            .sort({
                date: -1
            })
            .skip(offset)
            .limit(pageSize)
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
        if (cond.creator) {
            match.push({
                creator: aggregate.eq(cond.creator)
            });
        }
        if (cond.type) {
            match.push({
                type: aggregate.eq(cond.type)
            });
        }
        if (cond.startDate) {
            match.push({
                date: aggregate.gt(cond.startDate)
            });
        }
        if (cond.endDate) {
            match.push({
                date: aggregate.lte(cond.endDate)
            });
        }
        return match;
    }
}

module.exports = RecordDao;