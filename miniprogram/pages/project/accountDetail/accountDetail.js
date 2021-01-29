// miniprogram/pages/project/accountDetail/accountDetail.js

const Charts = require('../../../dist/wxcharts.js')

Page({

  data: {
    title : "吖吖资产",
    top_menu : "菜单",
    sum_hidden : false,
    tran_hidden : false,
    bottom : getApp().globalData.bottom,
    list : [
      {
        title_one : "六月",
        title_two : "Jun",
        array :[
          { 
            title : "转账",
            money : 1000, 
            bank : "招行",
            type : "基金",
            name : "老婆",
            month : "06",
            day : "23",
          },
          { 
            title : "调整金额",
            money : 1000, 
            bank : "招行",
            type : "基金",
            name : "老婆",
            month : "06",
            day : "23",
          },

        ],
         
      },
      {
        title_one : "七月",
        title_two : "JuL",
        array :[
          { 
            title : "转账",
            money : 1000, 
            bank : "招行",
            type : "基金",
            name : "老婆",
            month : "06",
            day : "23",
          },
          { 
            title : "调整金额",
            money : 1000, 
            bank : "招行",
            type : "基金",
            name : "老婆",
            month : "06",
            day : "23",
          },

        ],
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new Charts({
      canvasId: 'Statistical1',
      type: 'column',
      categories: ['W17', 'W18', 'W19', 'W20', 'W21', 'W22','W23','W24','W25','W26'],
      series: [
        {
        name :" ",
        color: '#BDE1F3', 
        background: '#1F9CEC',
        data: [5,22,12,2,37,3,15,21,44,8],
        format: function (val) {
          return val.toFixed(2);
        },
      },
    ],
    yAxis:
      { 
        splitNumber : 10,
        disableGrid: true,
        format: function (val) {
          return val + 'K';
        },

      },  
      dataPointShape: true,
      width: 380,
      height: 240


    });

    new Charts({
      canvasId: 'Statistical2',
      type: 'line',
      categories: ['W17', 'W18', 'W19', 'W20', 'W21', 'W22','W23','W24','W25','W26'],
      series: [
        {
        name :" ",
        color: '#BDE1F3', 
        background: '#1F9CEC',
        data: [5,22,12,2,37,3,15,21,44,8],
        format: function (val) {
          return val.toFixed(2);
        },
      },
    ],
    yAxis:
      { 
        position:'right',
        splitNumber : 10,
        disableGrid: true,
        format: function (val) {
          return val + 'K';
        },

      },  
      dataPointShape: true,
      width: 380,
      height: 240
    });
  },
  showDialog : function(e) {
    var index = e.currentTarget.dataset.id;
    var array = this.data.list[index].array;
    var title = array[index].title
    if (title == "转账") {
      this.setData({
        tran_hidden : true
      })
    }else{
      this.setData({
        sum_hidden : true
      })
    }
  },

})