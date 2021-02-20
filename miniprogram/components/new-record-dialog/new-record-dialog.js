// components/new-record-dialog/new-record-dialog.js
Component({
    options: {
        virtualHost: true
    },
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
        ]
    },
    observers: {
        isShow: function() {}
    },
    /**
     * 组件的方法列表
     */
    methods: {
        dismiss: function() {
            this.setData({
                isShow: false
            })
        }
    }
})