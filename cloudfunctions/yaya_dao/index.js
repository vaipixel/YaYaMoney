const UserDao = require('./dao/user_dao');
const GroupDao = require('./dao/group_dao');

class TestDao {
    sayHello() {
        console.log('dscasdc');
    }
}
module.exports = {
    UserDao, GroupDao, TestDao
}