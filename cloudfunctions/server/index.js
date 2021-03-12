const cloud = require('wx-server-sdk');
cloud.init({
    // env 参数说明：
    //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
    //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
    //   如不填则使用默认环境（第一个创建的环境）
    // env: 'my-env-id',
    env: cloud.DYNAMIC_CURRENT_ENV
});

const {inject, services} = require('./inject');

inject();

const {ErrorEnum, throwError, errors} = require('./errors');

// 云函数入口函数
exports.main = async (event, context) => {
    console.log(event.action);
    console.log(event.data);
    let {OPENID} = cloud.getWXContext();
    console.log(`indexOpenId： ${OPENID}`);
    cloud.isTest = event.test;
    console.log(`isTest: ${cloud.isTest}`);
    let result = {
        code: 200,
        message: 'success'
    };
    try {
        if (!OPENID) {
            throwError(errors.USER_OPENID_IS_NULL);
        }
        let data;
        switch (event.action) {
            case 'createGroup':
                data = await services.groupService.createGroup(event.data);
                break;
            case 'isUserAlreadyJoinGroup':
                data = await services.groupService.isUserAlreadyJoinGroup();
                break;
            case 'currentUserIsGroupCreator':
                data = await services.groupService.currentUserIsGroupCreator(event.data);
                break;
            case 'joinGroup':
                data = await services.groupService.joinGroup(event.data);
                break;
            case 'isGroupReady':
                data = await services.groupService.isGroupReady(event.data);
                break;
            case 'getUserGroupId':
                data = await services.groupService.getUserGroupId();
                break;
            case 'getGroupInfoWithIncomeRate':
                data = await services.groupService.getGroupInfoWithIncomeRate(event.data);
                break;
            case 'getGroupMembers':
                data = await services.groupService.getGroupMembers();
                break;
            case 'isUserRegistered':
                data = await services.userService.isUserRegistered();
                break;
            case 'login':
                data = await services.userService.login(event.data);
                break;
            case 'isUserHasGroup':
                data = await services.userService.isUserHasGroup();
                break;
            case 'isUserGroupReady':
                data = await services.userService.isUserGroupReady();
                break;
            case 'getUserInfo':
                data = await services.userService.getUserInfoByOpenid();
                break;
            case 'createAccount':
                data = await services.accountService.createAccount(event.data);
                break;
            case 'updateAccount':
                data = await services.accountService.updateAccount(event.data);
                break;
            case 'deleteAccount':
                data = await services.accountService.deleteAccount(event.data);
                break;
            case 'getAccountRecords':
                data = await services.accountService.getAccountRecords(event.data);
                break;
            case 'getAccountInfoWithMembers':
                data = await services.accountService.getAccountInfoWithMembers(event.data);
                break;
            case 'isAccountExist':
                data = await services.accountService.isAccountExist(event.data);
                break;
            case 'addRecord':
                data = await services.recordService.addRecord(event.data);
                break;
            case 'updateRecord':
                data = await services.recordService.updateRecord(event.data);
                break;
            case 'deleteRecord':
                data = await services.recordService.deleteRecord(event.data);
                break
        }
        return {
            ...result,
            data
        };
    } catch (e) {
        console.log(e);
        if (e instanceof ErrorEnum) {
            return e.getErrorResponse();
        }
        return {
            code: 19999,
            message: `unknown: ${e.message}`
        };
    }
};
