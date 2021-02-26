// 云函数入口文件
const cloud = require('wx-server-sdk');
const RecordDao = require('dao');
const TYPE_ADJUST_MONEY = '调整余额';
const TYPE_TRANSFER = '转账';

cloud.init();
const dao = new RecordDao();

// 云函数入口函数
exports.main = async (event, context) => {
    switch (event.action) {
        case 'addRecord':
            return addRecord(event.data);
        case 'updateRecord':
            return updateRecord(event.data);
        case 'getAccountRecords':
            return getAccountRecords(event.data);
    }
}

async function addRecord(data) {
    let {type} = data;
    if (type === TYPE_ADJUST_MONEY) {
        await _addAdjustMoneyRecord(data);
    } else if (type === TYPE_TRANSFER) {
        await _addTransferRecord(data);
    }
    return 'success';
}

async function updateRecord(data) {
    let {type, creator} = data;
    if (type === TYPE_ADJUST_MONEY) {
        let {accountId} = data;
        await _checkPermission(creator, accountId);
    } else if (type === TYPE_TRANSFER) {
        let {fromAccountId, targetAccountId} = data;
        await _checkPermission(creator, fromAccountId);
        await _checkPermission(creator, targetAccountId);
    }
    await dao.updateRecord(data);
    return 'success';
}

async function getAccountRecords(query) {
    const {accountId, offset, pageSize} = query;
    let records = await dao.getAccountRecords(accountId, offset, pageSize);
    records.map(record => {
        let {type} = record;
        if (type === TYPE_ADJUST_MONEY) {
            return record;
        } else if (type === TYPE_TRANSFER) {

        }
    })
    return records;
}

async function _addAdjustMoneyRecord(record) {
    let {accountId, creator} = record;
    await _checkPermission(creator, accountId);
    await dao.addRecord(record);
}

async function _addTransferRecord(record) {
    let {fromAccountId, targetAccountId, creator} = record;
    await _checkPermission(creator, fromAccountId);
    await _checkPermission(creator, targetAccountId);
    await dao.addRecord(record);
}

async function _getAccountInfo(accountId) {
    cloud.callFunction({
        name: 'account_service',
        data: {
            action: ''
        }
    })

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