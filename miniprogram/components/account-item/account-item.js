// components/account-item/account-item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
   
    account : [
      {
        name : "基金",
        money : 10000,
        img : '',
        found_text : "在蛋卷基金上的投资",
        rate : 4.5,
        flag : 0,
        list: [],
        menu :[
          {
            name : "Claire",
            img : '',
            money : 1000,
            rateMoney : 1039,
            rate : 4.3,
          },
          {
            name : "Claire",
            money : 1000,
            img : '',
            rateMoney : 1039,
            rate : 4.3,
          },
        ],
      },
      {
        name : "基金",
        money : 10000,
        img : '',
        found_text : "在蛋卷基金上的投资",
        rate : 4.5,
        flag : 0,
        list: [],
        menu :[
          {
            name : "Claire",
            money : 1000,
            img : '',
            rateMoney : 1039,
            rate : 4.3,
          },
          {
            name : "Claire",
            money : 1000,
            img : '',
            rateMoney : 1039,
            rate : 4.3,
          },
        ],
      },
    ],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    Select : function (e) {
      var index = e.currentTarget.dataset.id;
      var array = this.data.account;
      var flag = array[index].flag;
      if(flag == 0){
        array[index].flag = 1,
        this.setData({
          account : array,
        })
      }else{
        array[index].flag = 0,
        this.setData({
          account : array,
        })
      }
     
    },
    ToAccountDetail : function(){
      wx.navigateTo({
        url: '/pages/project/accountDetail/accountDetail',
      })
    }
  }
})
