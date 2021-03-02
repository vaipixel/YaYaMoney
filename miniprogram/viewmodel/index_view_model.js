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
            // this.userInfo = await loginService.onUserLogin(wxLoginData);
        } catch (e) {
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
        this.currentInterval = interval;
    }

    // 请求群组总览
    async requestGroupInfo() {
        this.groupInfo = await wx.services.groupService.getGroupInfoByUser(this.userInfo._id, this.currentInterval);
    }

    // 请求群组中所有账户的信息
    requestAccountInfo() {

    }

    observerUserInfo(observer, fn) {
        this._observer(observer, 'userInfo', fn);
    }

    observerIntervalChanged(observer, fn) {
        this._observer(observer, 'currentInterval', fn);
    }

    observerGroupInfo(observer, fn) {
        this._observer(observer, 'groupInfo', fn);
    }

    release(observer) {
        this._unObserver(observer);
    }
}

export {IndexViewModel}