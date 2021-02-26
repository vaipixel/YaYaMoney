// 云函数入口文件
const cloud = require('wx-server-sdk');
const RecordDao = require('dao');

cloud.init();
const dao = new RecordDao();

// 云函数入口函数
exports.main = async (event, context) => {
    switch (event.action) {
        case 'addRecord':
            return addRecord(event.data);
        case 'updateRecord':
            return updateRecord(event.data);
    }
}

async function addRecord(data) {
    let {record, accountId, userId} = data;
    await _checkPermission(userId, accountId);
    record = {
        ...record,
        accountId,
        creator: userId
    };
    await dao.addRecord(record);
    return 'success';
}

async function updateRecord(data) {
    let {record, accountId, userId} = data;
    await _checkPermission(userId, accountId);
    record = {
        ...record,
        accountId,
        creator: userId
    };
    await dao.updateRecord(record);
    return 'success';
}

async function _checkPermission(userId, accountId) {
    let accountGroupId = (await cloud.callFunction({
        name: 'account_service',
        data: {
            action: 'getGroupId',
            data: accountId
        }
    })).result;
    let userGroupId = (await cloud.callFunction({
        name: 'group_service',
        data: {
            action: 'getGroupId'
        }
    })).result;
    if (accountGroupId !== userGroupId) {
        throw new Error(`Can not modify other group's account's record! user: {${userId} accountId: {${accountId}`);
    }
}