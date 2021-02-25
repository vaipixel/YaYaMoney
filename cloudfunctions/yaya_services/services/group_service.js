const Service = require('./base');

const {initCloud} = require('yaya_utils');
const {GroupDao} = require('yaya_dao');

const cloud = initCloud();
const dao = new GroupDao();

class GroupService {
    async getGroupInfoByUser(userId) {
        console.log('getGroupInfoByUser');
        let groupId = await dao.getGroupIdByUserId(userId);
        let members = await this.getGroupMembers(groupId);
        console.log(members);
        let groupInfo = {
            groupId,
            members
        }
        return groupId;
    }

    async getGroupMembers(groupId) {
        console.log('getGroupMembers ' + groupId);
        let groupMembers = {}
        let wxContext = cloud.getWXContext();
        let {OPENID} = wxContext;
        let groupMembersId = await dao.getGroupMembersId(groupId);
        let userInfos = (await cloud.callFunction({
            name: 'user_controller',
            data: {
                action: 'getUserInfosByUserIds',
                data: groupMembersId
            }
        })).result;
        userInfos.forEach(userInfo => {
            if (OPENID === userInfo.openid) {
                groupMembers.me = userInfo;
            } else {
                groupMembers.partner = userInfo;
            }
        });
        return groupMembers;
    }

    async isUserHasGroup(userId) {
        return (await dao.getGroupByUserId(userId)).length > 0;
    }

    async createGroup(userId) {
        if ((await dao.getGroupByUserId(userId)).length > 0) {
            throw new Error('This user: {' + userId + '} already had group.');
        } else {
            return await dao.addGroup({
                creator: {
                    userId,
                    character: '老公'
                }
            });
        }
    }


    async  joinGroup(userId) {

    }

}

module.exports = GroupService;