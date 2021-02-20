// components/fix-input/fix-input.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        placeholder: {
            type: String,
            value: ""
        },
        type: {
            type: String,
            value: "text"
        },
        disabled: {
            type: Boolean,
            value: false
        },
        cursorSpacing: {
            type: Number,
            value: 100
        },
        alwaysEmbed: {
            type: Boolean,
            value: true
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {

    }
})