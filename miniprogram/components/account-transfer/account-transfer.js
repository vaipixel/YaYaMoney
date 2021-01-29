Component({
    properties : {
        hidden: {
            type : Boolean,
            value : '',
        },
    },
    data : {
        hidden : false,
    },
    methods : {
        show : function (e) {
            this.setData({
                hidden : true
            })
        }
    }
})