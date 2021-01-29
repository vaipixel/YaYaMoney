// miniprogram/components/homeHead/homeHead.js

Component({
    properties : {
        money:{
            type : String,
                value : "",
            },
        month:{
            type : String,
                value : "",
            },
        all_rate:{
            type : String,
                value : "",
            },
        
        },
    data: {
        h_flag : false,
    },
    methods:{
        SetMonth : function (params) {
            if(this.data.h_flag){
                this.setData({
                    h_flag : false
                })
            }else{
                this.setData({
                    h_flag : true
                })
            }
        }
    }

})
