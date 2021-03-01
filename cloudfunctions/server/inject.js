const dao = {};
const services = {}


// dao = {
//     groupDao: new GroupDao(),
//     accountDao: new AccountDao(),
//     userDao: new UserDao(),
//     userAccountRelationDao: new UserAccountRelationDao(),
//     recordDao: new RecordDao()
// }

function inject() {
    const {GroupService} = require('./services');
    const {GroupDao, AccountDao, UserDao, UserAccountRelationDao, RecordDao} = require('./dao');

    dao.groupDao = new GroupDao();
    dao.accountDao = new AccountDao();
    dao.userDao = new UserDao();
    dao.userAccountRelationDao = new UserAccountRelationDao();
    dao.recordDao = new RecordDao();

    services.groupService = new GroupService()
}

module.exports = {
    services,
    dao,
    inject
};