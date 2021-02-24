import {ViewModel} from "./view_model";
import {NotLoginError, UserHasNoGroupError} from "../errors/errors";

class IndexViewModel extends ViewModel {
    constructor() {
        super();
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
            console.log('NotLoginError');
            throw new NotLoginError();
        }
        let groupService = wx.services.groupService;
        let isUserHasGroup = await groupService.isUserHasGroup(this.userInfo._id);
        if (!isUserHasGroup) {
            console.log('UserHasNoGroupError');
            throw new UserHasNoGroupError();
        }
    }

    observerUserInfo(context, fn) {
        console.log('observerUserInfo')
        this._observer(context, 'userInfo', fn);
    }

    release(context) {
        this._unObserver(context);
    }
}

export {IndexViewModel}