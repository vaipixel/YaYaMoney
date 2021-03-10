const {dao, services} = require('../../inject');
const {throwError, errors} = require('../../errors');

async function checkGroup(groupId, userId) {
    if ((await dao.userDao.getUsersByGroupId(groupId)).length > 2) {
        throwError(errors.GROUP_IS_FULL);
    }
    if (await services.userService.isUserGroupReady()) {
        throwError(errors.USER_ALREADY_JOIN_GROUP)
    }
}

module.exports = {
    checkGroup
}