const {dao} = require('../../inject');
const {throwError, errors} = require('../../errors');

async function checkGroup(groupId) {
    if ((await dao.userDao.getUsersByGroupId(groupId)).length > 2) {
        throwError(errors.GROUP_IS_FULL);
    }
}

module.exports = {
    checkGroup
}