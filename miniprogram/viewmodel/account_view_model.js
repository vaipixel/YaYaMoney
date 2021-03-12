import {ViewModel} from "./view_model";

const {getAccountRecords} = require('../requests');

class AccountViewModel extends ViewModel {
    constructor() {
        super();
        this.accountId = '';
        this.offset = 0;
        this.pageSize = 99999;
        this.records = [];
    }
    init(accountId) {
        super.init();
        this.accountId = accountId;
    }

    async requestRecords() {
        this.records = (await getAccountRecords({
            accountId: this.accountId,
            offset: this.offset,
            pageSize: this.pageSize
        })).data;
    }

    observerRecords(observer, fn) {
        this._observer(observer, 'records', fn);
    }
}

export {AccountViewModel}