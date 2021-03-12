async function baseRequest(api, data) {
    console.log(`call api ${api}`);
    console.log(data);
    try {
        let result = await wx.cloud.callFunction({
            name: 'server',
            data: {
                action: api,
                data: data
            }
        });
        result = result.result;
        if (result.code !== 200) {
            console.log(`[${api}] api failed`);
        }
        console.log(result);
        return result;
    } catch (e) {
        console.log(e);
    }
}

async function createGroup(character) {
    return await baseRequest('createGroup', character);
}

async function isUserAlreadyJoinGroup() {
    return await baseRequest('isUserAlreadyJoinGroup');
}

async function currentUserIsGroupCreator(groupId) {
    return await baseRequest('currentUserIsGroupCreator', groupId);
}

async function joinGroup(groupId, character) {
    return await baseRequest('joinGroup', {groupId, character});
}

async function isUserRegistered() {
    return await baseRequest('isUserRegistered');
}

async function isGroupReady(groupId) {
    return await baseRequest('isGroupReady', groupId);
}

async function login(loginData) {
    return await baseRequest('login', loginData);
}

async function getUserGroupId() {
    return await baseRequest('getUserGroupId');
}

async function getGroupInfo(interval) {
    return await baseRequest('getGroupInfoWithIncomeRate', interval);
}

async function createAccount(accountInfo) {
    return await baseRequest('createAccount', accountInfo);
}

async function updateAccount(accountInfo) {
    return await baseRequest('updateAccount', accountInfo);
}

async function deleteAccount(accountId) {
    return await baseRequest('deleteAccount', accountId);
}

async function getGroupMembers() {
    return await baseRequest('getGroupMembers');
}

async function isUserHasGroup() {
    return await baseRequest('isUserHasGroup');
}

async function isUserGroupReady() {
    return await baseRequest('isUserGroupReady');
}

async function getAccountRecords(query) {
    return await baseRequest('getAccountRecords', query);
}

async function addRecord(record) {
    return await baseRequest('addRecord', record);
}

async function updateRecord(record) {
    return await baseRequest('updateRecord', record);
}

async function deleteRecord(recordId) {
    return await baseRequest('deleteRecord', recordId);
}

async function isAccountExist(accountId) {
    return await baseRequest('isAccountExist', accountId);
}

async function getAccountInfoWithMembers(accountId) {
    return await baseRequest('getAccountInfoWithMembers', accountId);
}

module.exports = {
    login,
    createGroup,
    isUserAlreadyJoinGroup,
    currentUserIsGroupCreator,
    joinGroup,
    isGroupReady,
    isUserRegistered,
    getUserGroupId,
    getGroupInfo,
    getGroupMembers,
    createAccount,
    updateAccount,
    deleteAccount,
    isUserHasGroup,
    isUserGroupReady,
    getAccountRecords,
    addRecord,
    updateRecord,
    deleteRecord,
    isAccountExist,
    getAccountInfoWithMembers
}
