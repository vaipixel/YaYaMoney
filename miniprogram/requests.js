async function baseRequest(api, data) {
    try {
        let result = await wx.cloud.callFunction({
            name: 'server',
            data: {
                action: api,
                data: data
            }
        });
        return result.result;
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

// async function getUserInfo() {
//     return await baseRequest('getUserInfo');
// }

async function getGroupInfo(interval) {
    return await baseRequest('getGroupInfoWithIncomeRate', interval);
}

async function createAccount(accountInfo) {
    return await baseRequest('createAccount', accountInfo);
}

async function updateAccount(accountInfo) {
    return await baseRequest('updateAccount', accountInfo);
}

async function getGroupMembers() {
    return await baseRequest('getGroupMembers');
}

async function isUserHasGroup() {
    return await baseRequest('isUserHasGroup');
}

async function getAccountRecords(query) {
    return await baseRequest('getAccountRecords', query);
}

async function addRecord(record) {
    return await baseRequest('addRecord', record);
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
    getGroupInfo,
    getGroupMembers,
    createAccount,
    updateAccount,
    isUserHasGroup,
    getAccountRecords,
    addRecord,
    isAccountExist,
    getAccountInfoWithMembers
}
