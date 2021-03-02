const dao = {};
const services = {}

function inject() {
    const {GroupDao, AccountDao, UserDao, UserAccountRelationDao, RecordDao} = require('./dao');
    const {GroupService, UserService, AccountService, RecordService} = require('./services');

    dao.groupDao = new GroupDao();
    dao.accountDao = new AccountDao();
    dao.userDao = new UserDao();
    dao.userAccountRelationDao = new UserAccountRelationDao();
    dao.recordDao = new RecordDao();

    services.groupService = new GroupService();
    services.userService = new UserService();
    services.accountService = new AccountService();
    services.recordService = new RecordService();
}

module.exports = {
    services,
    dao,
    inject
};