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
    const {GroupDao, AccountDao, UserDao, UserAccountRelationDao, RecordDao} = require('./dao');
    const {GroupService, UserService} = require('./services');

    dao.groupDao = new GroupDao();
    dao.accountDao = new AccountDao();
    dao.userDao = new UserDao();
    dao.userAccountRelationDao = new UserAccountRelationDao();
    dao.recordDao = new RecordDao();

    services.groupService = new GroupService();
    services.userService = new UserService();
}

module.exports = {
    services,
    dao,
    inject
};