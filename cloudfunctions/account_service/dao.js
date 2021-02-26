// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();

const account_collection_name = 'accounts';
const relation_user_account_collection_name = 'relation_user_account';
const user_collection_name = 'users';

class AccountDao {
    constructor() {
    }

    async addAccount(account) {
        let db = cloud.database();
        let result = await db.collection(account_collection_name).add({
            data: {
                ...account,
                createTime: new Date()
            }
        });
        return result._id;
    }

    async updateAccount(account) {
        let db = cloud.database();
        await db.collection(account_collection_name).doc(account._id).update({
            data: account
        });
    }

    async deleteAccount(accountId) {
        let db = cloud.database();
        await db.collection(account_collection_name).doc(accountId).update({
            data: {
                delete: true
            }
        });
    }

    async getAccountInfo(accountId) {
        let db = cloud.database();
        let result = await db.collection(account_collection_name)
            .doc(accountId)
            .get();
        return result.data;
    }

    async getGroupAccounts(groupId) {
        let db = cloud.database();
        const _ = db.command;
        let result = await db.collection(account_collection_name)
            .aggregate()
            .match({
                groupId: _.eq(groupId)
            })
            .lookup({
                from: relation_user_account_collection_name,
                localField: '_id',
                foreignField: 'accountId',
                as: 'members'
            })
            .lookup({
                from: 'users',
                localField: 'members.userId',
                foreignField: '_id',
                as: 'members'
            })
            .end();
        return result.list;
    }

    async getAccountMembersId(accountId) {
        let db = cloud.database();
        const _ = db.command;
        let result = await db.collection(relation_user_account_collection_name).where({
            accountId: _.eq(accountId)
        })
            .get();
        return result.data;
    }

    async addUserToAccount(accountId, userId) {
        let db = cloud.database();
        let result = await db.collection(relation_user_account_collection_name)
            .add({
                data: {accountId, userId}
            });
    }

    async removeUserFromAccount(accountId, userId) {
        let db = cloud.database();
        const _ = db.command;
        let result = await db.collection(relation_user_account_collection_name).where({
            accountId: _.eq(accountId),
            userId: _.eq(userId)
        })
            .remove();
    }

    /**
     * 获取账户所属的群组 id
     * @param accountId 账户 id
     * @returns {Promise<void>}
     */
    async getGroupId(accountId) {
        let db = cloud.database();
        let result = await db.collection(account_collection_name).doc(accountId).get();
        return result.data.groupId;
    }
}

class UserDao {
    async getUserIdByOpenid(openid) {
        let db = cloud.database();
        let _ = db.command;
        let result = await db.collection(user_collection_name)
            .where({
                openid: _.eq(openid)
            })
            .get();
        return result.data[0]._id;
    }
}

module.exports = {AccountDao, UserDao};