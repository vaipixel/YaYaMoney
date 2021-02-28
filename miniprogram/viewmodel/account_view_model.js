import {ViewModel} from "./view_model";

class AccountViewModel extends ViewModel {
    constructor() {
        super();
        this.accountId = '';
        this.offset = 0;
        this.pageSize = 50;
        this.records = [];
    }
    init(accountId) {
        super.init();
        this.accountId = accountId;
    }

    async requestRecords() {
        this.records = (await wx.cloud.callFunction({
            name: 'account_service',
            data: {
                action: 'getAccountRecords',
                data: {
                    accountId: this.accountId,
                    offset: this.offset,
                    pageSize: this.pageSize
                }
            }
        })).result;
    }

    observerRecords(observer, fn) {
        this._observer(observer, 'records', fn);
    }
}

export {AccountViewModel}