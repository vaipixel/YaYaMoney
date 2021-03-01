const cloud = require('wx-server-sdk');
const group_collection_name = 'groups';

class GroupDao {
    async addGroup(groupPo) {
        const db = cloud.database();
        let creator = groupPo.creator;
        let result = await db.collection(group_collection_name).add({
            data: {
                createBy: creator,
                createTime: new Date()
            }
        });
        return result._id;
    }

    async getGroupCreatorId(groupId) {
        const db = cloud.database();
        let result = await db.collection(group_collection_name)
            .doc(groupId)
            .get();
        return result.data.createBy;
    }
}

module.exports = GroupDao;