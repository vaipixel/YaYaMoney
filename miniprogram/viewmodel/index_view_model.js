import {ViewModel} from "./view_model";
import {NotLoginError, UserHasNoGroupError} from "../errors/errors";
const {login, isUserHasGroup} = require('../requests');

class IndexViewModel extends ViewModel {
    constructor() {
        super();
        this.currentInterval = '';
        this.userInfo = {};
        this.groupInfo = {};
    }

    async init() {
        super.init();
        try {
            let loginService = wx.services.loginService;
            let wxLoginData = await loginService.loginWx();
            this.userInfo = await login(wxLoginData);
        } catch (e) {
            console.warn('NotLoginError');
            throw new NotLoginError();
        }
        let result = (await isUserHasGroup()).data;
        if (!result) {
            console.warn('UserHasNoGroupError');
            throw new UserHasNoGroupError();
        }
    }


    setCurrentInterval(interval) {
        this.currentInterval = interval;
    }

    // 请求群组总览
    async requestGroupInfo() {
        this.groupInfo = await wx.services.groupService.getGroupInfoByUser(this.currentInterval);
        console.log(this.groupInfo);
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