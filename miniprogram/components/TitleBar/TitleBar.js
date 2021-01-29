// miniprogram/components/TitleBar/TitleBar.js 
Component({
    properties : {
        
        title : {
            type : String,
            value : "",
        },
        top_menu : {
            type : String,
            value : "",
        },
    },
    data:{
        top : getApp().globalData.top,
        bottom :  getApp().globalData.bottom,
        t_flag : true,
    },
    methods :{
        Capture : function(e){
            if(this.data.t_flag){
                this.setData({
                    t_flag : false
                })
            }else{
                this.setData({
                    t_flag : true
                })
            }
        }
    }
})

