// components/new-record-dialog/new-record-dialog.js
Component({
    options: {
        virtualHost: true
    },
    /**
     * 组件的属性列表
     */
    properties: {
        isHidden: {
            type: Boolean,
            value: true
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
        isHidden: function() {}
    },
    /**
     * 组件的方法列表
     */
    methods: {
        dismiss: function() {
            this.setData({
                isHidden: true
            })
        }
    }
})