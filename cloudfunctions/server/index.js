// 云函数入口文件
const cloud = require('wx-server-sdk');
const {inject, services} = require('./inject');

cloud.init();

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