const CLOUD_FUNCTION_NAME = 'group_service';
const { getGroupInfo} = require('../requests');
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
        await wx.cloud.callFunction({
            name: CLOUD_FUNCTION_NAME,
            data: {
                action: 'createGroup',
                data: userId
            }
        })
    }

    async getGroupInfoByUser(interval) {
        let groupInfo = await getGroupInfo(interval);
        return groupInfo.data;
    }
}

export {GroupService}