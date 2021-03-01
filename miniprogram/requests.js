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

async function isGroupReady(groupId) {
    return await baseRequest('isGroupReady', groupId);
}

module.exports = {
    createGroup,
    isUserAlreadyJoinGroup,
    currentUserIsGroupCreator,
    joinGroup,
    isGroupReady
}