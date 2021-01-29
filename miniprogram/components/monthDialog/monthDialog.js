// miniprogram/components/monthDialog/mothDialog.js
Component({

    properties : {
        h_flag : {
            type : Boolean,
            value : '',
        }
    },

    data : {
        
        list : [],
        text : [
            {
                frist : "每",
                scend : "日",
            },
            {
                frist : "每",
                scend : "周",
            },
            {
                frist : "每",
                scend : "月",
            },
            {
                frist : "每",
                scend : "年",
            },

        ],
    },

    methods : {

    },
})