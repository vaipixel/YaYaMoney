const {dao, services} = require('../inject');
const {throwError, errors} = require('../errors');

class RecordService {

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
}

module.exports = RecordService;