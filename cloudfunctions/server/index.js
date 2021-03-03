// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init();

const {inject, services} = require('./inject');

inject();

// 云函数入口函数
exports.main = async (event, context) => {
    console.log(event.action);
    console.log(event.data);

    let result = {
        code: 200,
        message: 'success'
    };
    try {
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
            case 'isUserRegistered':
                data = await services.userService.isUserRegistered();
                break;
            case 'login':
                data = await services.userService.login(event.data);
                break;
            case 'getGroupInfoWithIncomeRate':
                data = await services.groupService.getGroupInfoWithIncomeRate(event.data);
                break;
            case 'createAccount':
                data = await services.accountService.createAccount(event.data);
                break;
            case 'getGroupMembers':
                data = await services.groupService.getGroupMembers();
                break;
            case 'isUserHasGroup':
                data = await services.userService.isUserHasGroup();
                break;
            case 'getAccountRecords':
                data = await services.accountService.getAccountRecords(event.data);
                break;
        }
        return {
            ...result,
            data
        };
    } catch (e) {
        console.log(e);
        return {

        }
    }
};