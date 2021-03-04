const cloud = require('wx-server-sdk');

const account_collection_name = 'accounts';
const relation_user_account_collection_name = 'relation_user_account';

class AccountDao {
    async addAccount(accountInfo) {
        let db = cloud.database();
        let result = await db.collection(account_collection_name)
            .add({
                data: accountInfo
            });
        return result._id;
    }

    async updateAccount(id, accountInfo) {
        let db = cloud.database();
        await db.collection(account_collection_name)
            .doc(id)
            .update({
                data: accountInfo
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

    async getGroupId(accountId) {
        let db = cloud.database();
        let result = await db.collection(account_collection_name)
            .doc(accountId)
            .get();
        return result.data.groupId;
    }

    async getAccountWithMembers(accountId) {
        let db = cloud.database();
        const _ = db.command;
        let result = await db.collection(account_collection_name)
            .aggregate()
            .match({
                _id: _.eq(accountId)
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
        if (result.list.length === 0) {
            return null;
        }
        return result.list[0];
    }

    async deleteAccount(accountId) {
        console.log('deleteAccount');
        console.log(accountId);
        let db = cloud.database();
        const _ = db.command;
        let result = await db.collection(account_collection_name)
            .doc(accountId)
            .remove();
        return result.data;
    }
}

module.exports = AccountDao;
