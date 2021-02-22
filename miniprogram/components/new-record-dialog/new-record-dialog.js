// components/new-record-dialog/new-record-dialog.js
const dateUtils = require("../../utils/dateUtils.js");
const computedBehavior = require('miniprogram-computed')
import { TabCalculate } from 'tab-calculate.js';

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
        recordData: {
            recordType: "调整余额",
            date: dateUtils.dateFormat('YYYY-mm-dd', new Date())
        },
        pageInfo: {
            formHeight: 1
        }
    },
    computed: {
        formatDate(data) {
            return dateUtils.formatDate(data.recordData.date);
        }
    },
    observers: {

    },
    /**
     * 组件的方法列表
     */
    methods: {
        dismiss: function() {
            this.setData({
                isShow: false
            })
        },
        onDateChanged: function(e) {
            let date = e.detail.value;
            this.setData({
                'recordData.date': date
            });
        },
        _getCurrentDate: function() {
            return dateUtils.dateFormat('YYYY-mm-dd', new Date())
        },
        onRecordTypeChange: async function(e) {
            let recordType = e.detail.tab;
            this.setData({
                'recordData.recordType': recordType
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
        }
    },
    lifetimes: {
        attached: async function() {
            tabCalculate = new TabCalculate(this);
            this.setData({
                'recordData.date': this._getCurrentDate()
            });
        },
        ready: function() {},
        moved: function() {
            console.log('dialog moved');
        },
        detached: function() {
            console.log('dialog detached');
        }
    }
})