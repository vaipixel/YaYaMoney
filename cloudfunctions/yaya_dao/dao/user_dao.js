const {Dao, initWxSdk} = require('./base');

const cloud = initWxSdk();

const user_collection_name = 'users';

class UserDao extends Dao {
    constructor() {
        super()
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
}

module.exports = UserDao;