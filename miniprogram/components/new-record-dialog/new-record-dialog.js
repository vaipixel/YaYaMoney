// components/new-record-dialog/new-record-dialog.js
const dateUtils = require("../../utils/dateUtils.js");
const computedBehavior = require('miniprogram-computed')
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
        filterData: [
            '调整余额',
            '转账'
        ],
        recordData: {
            date: dateUtils.dateFormat('YYYY-mm-dd', new Date())
        }
    },
    computed: {
        formatDate(data) {
            return dateUtils.formatDate(data.recordData.date);
        }
    },
    observers: {},
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
        }
    },
    lifetimes: {
        attached: function() {
            this.setData({
                'recordData.date': this._getCurrentDate()
            })
        },
        moved: function() {
            console.log('dialog moved');
        },
        detached: function() {
            console.log('dialog detached');
        }
    }
})