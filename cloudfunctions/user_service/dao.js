// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();

const user_collection_name = 'users';
const relation_user_group_collection_name = 'relation_user_group';

class UserDao {
    constructor() {
    }

    async addUser(userInfo) {
        const db = cloud.database();
        await db.collection(user_collection_name).add({
            data: {...userInfo, createTime: new Date()}
        });
    }

    async updateUser(userInfo) {
        const db = cloud.database();
        const _ = db.command
        await db.collection(user_collection_name).where({
            openid: _.eq(userInfo.openid)
        }).update({
            data: userInfo
        });
    }

    async isUserExist(openid) {
        const db = cloud.database();
        const _ = db.command
        let result = await db.collection(user_collection_name).where({
            openid: _.eq(openid)
        })
            .get();
        return result.data && result.data.length > 0
    }

    async getUserInfoByOpenid(openid) {
        const db = cloud.database();
        const _ = db.command
        let result = await db.collection(user_collection_name).where({
            openid: _.eq(openid)
        })
            .get();
        return result.data[0];
    }

    async getUserInfoByUserId(userId) {
        const db = cloud.database();
        let result = await db.collection(user_collection_name).doc(userId).get();
        return result.data;
    }

    /**
     * 获取用户所属的群组 id
     * @param userId
     * @returns {Promise<*>}
     */
    async getGroupId(userId) {
        let db = cloud.database();
        let _ = db.command;
        let result = await db.collection(relation_user_group_collection_name).where({
            userId: _.eq(userId)
        }).get();
        return result.data[0].groupId;
    }
}

module.exports = UserDao;