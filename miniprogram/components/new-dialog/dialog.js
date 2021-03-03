// components/new-dialog/dialog.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        show: {
            type: Boolean,
            value: false,
            observer: '_showChange'
        },
        maskClosable: {
            type: Boolean,
            value: true
        },
        position: {
            type: String,
            value: 'center'
        }
    },

    /**
     * 组件的初始数据
     */
    data: {},

    /**
     * 组件的方法列表
     */
    methods: {
        close() {
            const data = this.data;
            if (!data.maskClosable) {
                return;
            }
            this.setData({
                show: false
            });
            this.triggerEvent('close', {}, {});
        },
        stopEvent() {

        },
        _showChange(value) {
            console.log('_showChange ' + value)
        }
    }
})
