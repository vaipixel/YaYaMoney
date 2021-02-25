// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();

const account_collection_name = 'accounts';
const relation_user_account_collection_name = 'relation_user_account';

class AccountDao {
    constructor() {
    }

    async addAccount(account) {
        let db = cloud.database();
        await db.collection(account_collection_name).add({
            data: {
                ...account,
                createTime: new Date()
            }
        });
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
                as: 'users'
            })
            .lookup({
                from: 'users',
                localField: 'users.userId',
                foreignField: '_id',
                as: 'users'
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
}

module.exports = AccountDao;