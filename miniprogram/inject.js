import {LoginService} from 'services/login_service.js';
import {GroupService} from "./services/group_service";
import {IndexViewModel} from "./viewmodel/index_view_model";
import {AccountViewModel} from "./viewmodel/account_view_model";
import {toAsync} from 'utils/promiseUtils.js';
import {promisifyAll} from 'miniprogram-api-promise';

function inject() {
    injectPromisify();
    injectServices();
    injectViewModels();
}

function injectServices() {
    wx.services = {
        loginService: new LoginService(),
        groupService: new GroupService()
    };
}

function injectViewModels() {
    wx.viewModels = {
        index: new IndexViewModel(),
        account: new AccountViewModel()
    };
}

function injectPromisify() {
    wx.async = toAsync(['login', 'request']);
    const wxp = {};
    promisifyAll(wx, wxp)
    wx.wxp = wxp;
}

export { inject }