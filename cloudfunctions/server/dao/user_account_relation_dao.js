const cloud = require('wx-server-sdk');
const relation_user_account_collection_name = 'relation_user_account';

class UserAccountRelationDao {

    async addRelation(relation) {
        let db = cloud.database();
        let result = await db.collection(relation_user_account_collection_name)
            .add({
                data: relation
            });
        return result._id;
    }

    async deleteRelation(relation) {
        let db = cloud.database();
        let _ = db.command;
        db.collection(relation_user_account_collection_name)
            .where({
                accountId: _.eq(relation.accountId),
                userId: _.eq(relation.userId)
            })
            .remove();
    }

    async getAccountMembersId(accountId) {
        let db = cloud.database();
        let _ = db.command;
        let result = await db.collection(relation_user_account_collection_name)
            .where({
                accountId: _.eq(accountId),
            })
            .get();
        return result.data;
    }

    async isUserInAccount(userId, accountId) {
        let db = cloud.database();
        let _ = db.command;
        let result = await db.collection(relation_user_account_collection_name)
            .where({
                accountId: _.eq(accountId),
                userId: _.eq(userId)
            })
            .get();
        if (result.data) {
            return result.data.length > 0;
        }
        return false;
    }
}

module.exports = UserAccountRelationDao;
