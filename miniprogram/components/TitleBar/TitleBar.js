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
    },
    methods :{
        
    }
})

