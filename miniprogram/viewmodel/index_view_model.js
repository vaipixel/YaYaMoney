import {ViewModel} from "./view_model";
import {NotLoginError, UserHasNoGroupError} from "../errors/errors";

class IndexViewModel extends ViewModel {
    constructor() {
        super();
        this.currentInterval = '';
        this.userInfo = {};
        this.groupInfo = {};
        this.accountInfo = {};
    }

    async init() {
        super.init();
        try {
            let loginService = wx.services.loginService;
            let wxLoginData = await loginService.loginWx();
            this.userInfo = await loginService.onUserLogin(wxLoginData);
        } catch (e) {
            console.log(e)
            console.warn('NotLoginError');
            throw new NotLoginError();
        }
        let groupService = wx.services.groupService;
        let isUserHasGroup = await groupService.isUserHasGroup(this.userInfo._id);
        if (!isUserHasGroup) {
            console.warn('UserHasNoGroupError');
            throw new UserHasNoGroupError();
        }
    }


    setCurrentInterval(interval) {
        console.log(`setCurrentInterval: ${interval}`)
        this.currentInterval = interval;
    }

    // 请求群组总览
    async requestGroupInfo() {
        console.log('requestGroupInfo')
        this.groupInfo = await wx.services.groupService.getGroupInfoByUser(this.userInfo._id, this.currentInterval);
    }

    // 请求群组中所有账户的信息
    requestAccountInfo() {

    }

    observerUserInfo(context, fn) {
        this._observer(context, 'userInfo', fn);
    }

    observerIntervalChanged(context, fn) {
        this._observer(context, 'currentInterval', fn);
    }

    observerGroupInfo(context, fn) {
        this._observer(context, 'groupInfo', fn);
    }

    release(context) {
        this._unObserver(context);
    }
}

export {IndexViewModel}