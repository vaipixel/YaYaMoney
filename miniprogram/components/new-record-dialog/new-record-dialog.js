// components/new-record-dialog/new-record-dialog.js
const dateUtils = require("../../utils/dateUtils.js");
const computedBehavior = require('miniprogram-computed')
import {TabCalculate} from 'tab-calculate.js';

let tabCalculate;
Component({
    options: {
        virtualHost: true
    },
    behaviors: [computedBehavior],
    /**
     * 组件的属性列表
     */
    properties: {
        isShow: {
            type: Boolean,
            value: false
        },
        accounts: {
            type: Array,
            value: []
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        tabData: [
            '调整余额',
            '转账'
        ],
        recordType: "调整余额",
        amount: '',
        comment: '',
        account: {},
        fromAccount: {},
        targetAccount: {},
        date: new Date(),
        formatDate: '',
        pageInfo: {
            formHeight: 1
        }
    },
    watch: {
        'date': function(date) {
            this.setData({
                formatDate: dateUtils.formatDate(date)
            })
        },
    },
    observers: {},
    /**
     * 组件的方法列表
     */
    methods: {
        dismiss: function () {
            this.setData({
                isShow: false
            })
        },
        onDateChanged: function (e) {
            let date = e.detail.value;
            let now = new Date();
            date.setHours(now.getHours());
            date.setMinutes(now.getMinutes());
            date.setSeconds(now.getSeconds());
            this.setData({
                'date': date
            });
        },
        _getCurrentDate: function () {
            return dateUtils.dateFormat('YYYY-mm-dd', new Date())
        },
        onRecordTypeChange: async function (e) {
            let recordType = e.detail.tab;
            this.setData({
                'recordType': recordType
            })
            if (recordType === '调整余额') {
                this.setData({
                    'pageInfo.formHeight': await tabCalculate.getAdjustMoneyTabHeight()
                })
            } else {
                this.setData({
                    'pageInfo.formHeight': await tabCalculate.getTransferTabHeight()
                })
            }
        },
        onChoseAccount: async function () {
            let accountList = this.data.accounts.map(account => account.accountName)
            let tapIndex = (await wx.showActionSheet({
                alertText: '请选择账户',
                itemList: accountList
            })).tapIndex;
            this.setData({
                'account': this.data.accounts[tapIndex]
            });
        },
        onChoseFromAccount: async function() {
            let accountList = this.data.accounts.map(account => account.accountName)
            let tapIndex = (await wx.showActionSheet({
                alertText: '请选择转出账户',
                itemList: accountList
            })).tapIndex;
            this.setData({
                fromAccount: this.data.accounts[tapIndex]
            });
        },
        onChoseTargetAccount: async function() {
            let accountList = this.data.accounts.map(account => account.accountName)
            let tapIndex = (await wx.showActionSheet({
                alertText: '请选择转入账户',
                itemList: accountList
            })).tapIndex;
            this.setData({
                targetAccount: this.data.accounts[tapIndex]
            });
        },
        onAddAdjustMoneyRecord: async function () {
            let data = this.data;
            let record = {
                amount: parseFloat(data.amount),
                type: '调整余额',
                accountId: data.account._id,
                comment: data.comment,
                date: data.date
            };
            wx.showLoading({
                mask: true
            })
            await this._addRecord(record);
            wx.hideLoading();
            this.dismiss();
        },
        onAddTransferRecord: async function () {
            let data = this.data;
            let record = {
                amount: parseFloat(data.amount),
                type: '调整余额',
                fromAccount: data.fromAccount._id,
                targetAccount: data.targetAccount._id,
                comment: data.comment,
                date: data.date
            };
            wx.showLoading({
                mask: true
            })
            await this._addRecord(record);
            wx.hideLoading();
            this.dismiss();
        },
        _addRecord: async function(record) {
            await wx.cloud.callFunction({
                name: 'account_service',
                data: {
                    action: 'addRecord',
                    data: record
                }
            })
        }
    },
    lifetimes: {
        attached: async function () {
            tabCalculate = new TabCalculate(this);
            this.setData({
                date: new Date()
            });
            console.log(this.data)
        },
        ready: function () {
            // setAccount
            this.setData({
                'account': this.data.accounts[0]
            });
            // setFromAccount
            this.setData({
                'fromAccount': this.data.accounts[0]
            });
            // setTargetAccount
            let targetAccount;
            if (this.data.accounts.length > 1) {
                targetAccount = this.data.accounts[1];
            } else {
                targetAccount = this.data.accounts[0];
            }
            this.setData({
                'targetAccount': targetAccount
            });
        },
        moved: function () {
            console.log('dialog moved');
        },
        detached: function () {
            console.log(this.data)
            console.log('dialog detached');
        }
    }
})