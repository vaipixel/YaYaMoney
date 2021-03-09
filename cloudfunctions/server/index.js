const cloud = require('wx-server-sdk');
cloud.init();

const {inject, services} = require('./inject');

inject();

const {ErrorEnum, throwError, errors} = require('./errors');

// 云函数入口函数
exports.main = async (event, context) => {
    console.log(event.action);
    console.log(event.data);
    let {OPENID} = cloud.getWXContext();
    console.log(`indexOpenId： ${OPENID}`);

    let result = {
        code: 200,
        message: 'success'
    };
    try {
        if (!OPENID) {
            throwError(errors.COMMON_OPENID_IS_NULL);
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
