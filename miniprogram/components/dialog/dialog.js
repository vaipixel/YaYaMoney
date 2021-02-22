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
    observers: {},
    /**
     * 组件的方法列表
     */
    methods: {
        clickOutside: function() {
            console.log('clickOutside');
            if (this.data.dismissByClickOutside) {
                this.dismiss()
            }
        },
        dismiss: function() {
            this.setData({
                isShow: false
            })
        },
        doNothing: function() {},
        _propertyChange: function(newVal, oldVal) {}
    },
    lifetimes: {
        attached: function() {
            this.animate('.mask', [{
                    opacity: 0
                },
                {
                    opacity: 0.3
                }
            ], 250)
        },

    }
})