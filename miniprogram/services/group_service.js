const CLOUD_FUNCTION_NAME = 'group_service';

class GroupService {
    async isUserHasGroup(userId) {
        let result = await wx.cloud.callFunction({
            name: CLOUD_FUNCTION_NAME,
            data: {
                action: 'isUserHasGroup',
                data: userId
            }
        });
        return result.result;
    }

    async createGroup(userId) {
        console.log(userId);
        await wx.cloud.callFunction({
            name: CLOUD_FUNCTION_NAME,
            data: {
                action: 'createGroup',
                data: userId
            }
        })
    }

    async getGroupInfoByUser(userId) {
        console.log('getGroupInfoByUser: ' + userId);
        let result = await wx.cloud.callFunction({
            name: CLOUD_FUNCTION_NAME,
            data: {
                action: 'getGroupInfoByUser',
                data: userId
            }
        });
        return result.result;
    }
}

export {GroupService}