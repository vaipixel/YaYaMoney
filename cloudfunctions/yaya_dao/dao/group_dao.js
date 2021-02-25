const {Dao, initWxSdk} = require('./base');

const cloud = initWxSdk();

const group_collection_name = 'groups';
const relation_user_group_collection_name = 'relation_user_group';

class GroupDao extends Dao {
    constructor() {
        super();
    }

    async addGroup(groupPo) {
        const db = cloud.database();
        let creator = groupPo.creator;
        let result = await db.collection(group_collection_name).add({
            data: {
                createBy: creator.userId,
                createTime: new Date()
            }
        });
        let groupId = result._id;
        await db.collection(relation_user_group_collection_name).add({
            data: {
                groupId: groupId,
                userId: creator.userId,
                character: creator.character
            }
        })
        return groupId;
    }

    async getGroupByUserId(userId) {
        const db = cloud.database();
        let result = await db.collection(relation_user_group_collection_name).where({
            userId: userId
        }).get();
        return result.data ? result.data : [];
    }

    async getGroupIdByUserId(userId) {
        const db = cloud.database();
        let result = await db.collection(relation_user_group_collection_name).where({
            userId: userId
        }).get();
        let {groupId} = result.data[0];
        return groupId;
    }

    async getGroupMembersId(groupId) {
        const db = cloud.database();
        let result = await db.collection(relation_user_group_collection_name).where({
            groupId: groupId
        }).get();
        if (result.data) {
            return result.data.map(member => member.userId);
        } else {
            return [];
        }
    }
}

module.exports = GroupDao;