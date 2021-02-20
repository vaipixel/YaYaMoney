// components/list-dialog/list-dialog.js
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
        },
        dismissByClickOutside: {
            type: Boolean,
            value: true
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
        clickOutside: function() {
            if (this.data.dismissByClickOutside) {
                this.dismiss()
            }
        },
        dismiss: function() {
            console.log("dismiss")
            this.setData({
                'isShow': false
            })
        },
        doNothing: function() {
            console.log('doNothing');
        },
        _propertyChange: function(newVal, oldVal) {
            console.log('_propertyChange');
        }
    },
    attached: function() {}
})