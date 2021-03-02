const {dao} = require('../inject');
const {throwError, errors} = require('../errors');
const {groupUtils, userUtils} = require('./utils');
class GroupService {
    async createGroup(character) {
        // todo check
        let userInfo = await userUtils.getCurrentUserInfo();
        if (userInfo.groupId) {
            throwError(errors.USER_ALREADY_JOIN_GROUP);
        }
        let groupId = await dao.groupDao.addGroup({creator: userInfo._id});
        await this.joinGroup({groupId, character});
        return groupId
    }

    async joinGroup(data) {
        // 检查用户之前有没有加入群组
        let {groupId, character} = data;
        await groupUtils.checkGroup(groupId);
        let userInfo = await userUtils.getCurrentUserInfo();
        userInfo = {
            ...userInfo,
            groupId,
            character
        }
        await dao.userDao.updateUser(userInfo);
        return 'success';
    }

    async leaveGroup() {

    }

    async isUserAlreadyJoinGroup() {
        let userInfo = await userUtils.getCurrentUserInfo();
        return !!userInfo.groupId;
    }

    async currentUserIsGroupCreator(groupId) {
        let userInfo = await userUtils.getCurrentUserInfo();
        let creatorId = await dao.groupDao.getGroupCreatorId(groupId);
        return userInfo._id === creatorId;
    }

    async isGroupReady(groupId) {
        let users = await dao.userDao.getUsersByGroupId(groupId);
        console.log('users.length === 2 ');
        console.log(users.length === 2)
        return users.length === 2;
    }
}

module.exports = GroupService;