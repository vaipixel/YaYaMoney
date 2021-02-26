// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();

const group_collection_name = 'groups';
const user_collection_name = 'users';

class GroupDao {
    constructor() {
    }

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

    async getGroupIdByUserId(userId) {
        const db = cloud.database();
        let result = await db.collection(relation_user_group_collection_name).where({
            userId: userId
        }).get();
        let {groupId} = result.data[0];
        return groupId;
    }

    async getMemberCharacter(groupId, userId) {
        const db = cloud.database();
        let result = await db.collection(relation_user_group_collection_name).where({
            groupId: groupId,
            userId: userId
        }).get();
        if (result.data) {
            return result.data.map(member => member.character)[0];
        } else {
            return [];
        }
    }
}

class UserDao {
    async getUserInfo(userId) {
        let db = cloud.database();
        return (await db.collection(user_collection_name)
            .doc(userId)
            .get())
            .data;
    }

    async updateUser(userInfo) {
        let db = cloud.database();
        let id = userInfo._id;
        delete userInfo._id;
        await db.collection(user_collection_name)
            .doc(id)
            .update({
                data: userInfo
            });
    }

    async getUsersByGroupId(groupId) {
        let db = cloud.database();
        let _ = db.command;
        return (await db.collection(user_collection_name)
            .where({
                groupId: _.eq(groupId)
            })
            .get()).data;
    }

    async getGroupIdByUserId(userId) {
        const db = cloud.database();
        let result = await db.collection(user_collection_name)
            .doc(userId)
            .get();
        let {groupId} = result.data;
        return groupId;
    }
}

module.exports = {GroupDao, UserDao};