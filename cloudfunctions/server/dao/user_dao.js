const cloud = require('wx-server-sdk');
const user_collection_name = 'users';

class UserDao {
    async addUser(userInfo) {
        const db = cloud.database();
        await db.collection(user_collection_name).add({
            data: {...userInfo, createTime: new Date()}
        });
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

    async getUsersByGroupId(groupId) {
        let db = cloud.database();
        let _ = db.command;
        return (await db.collection(user_collection_name)
            .where({
                groupId: _.eq(groupId)
            })
            .get()).data;
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

    async isUserRegistered(openid) {
        const db = cloud.database();
        const _ = db.command
        let result = await db.collection(user_collection_name).where({
            openid: _.eq(openid)
        })
            .get();
        return result.data.length > 0;
    }

}

module.exports = UserDao;