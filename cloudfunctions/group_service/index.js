// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const group_collection_name = 'groups';
const relation_user_group_collection_name = 'relation_user_group';

// 云函数入口函数
exports.main = async (event, context) => {
    switch (event.action) {
        case 'getGroupInfoByUser':
            return await getGroupInfoByUser(event.data);
        case 'isUserHasGroup':
            return await isUserHasGroup(event.data);
        case 'createGroup':
            return await createGroup(event.data);
        case 'joinGroup':
            return await joinGroup(event.data);
    }
}

async function createGroup(userId) {
    if (await isUserHasGroup(userId)) {
        throw new Error('This user: {' + userId + '} already had group.');
    } else {
        const db = cloud.database();
        let result = await db.collection(group_collection_name).add({
            data: {
                createBy: userId,
                createTime: new Date()
            }
        });
        let groupId = result._id;
        await db.collection(relation_user_group_collection_name).add({
            data: {
                groupId: groupId,
                userId: userId,
                character: '老公'
            }
        })
        return groupId;
    }
}

async function joinGroup(userId) {

}

async function getGroupInfoByUser(userId) {
    console.log('getGroupInfoByUser')
    const db = cloud.database();
    const _ = db.command;
    let result = await db.collection(relation_user_group_collection_name).where({
        userId: _.eq(userId)
    }).get()
    return {...result.data[0]};
}

async function isUserHasGroup(userId) {
    console.log('isUserHasGroup')
    const db = cloud.database();
    let result = await db.collection(relation_user_group_collection_name).where({
        userId: userId
    }).get();
    return result.data && result.data.length > 0;
}