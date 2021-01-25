// miniprogram/pages/project/addAccount/addAccount.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bottom : getApp().globalData.bottom,
    top_menu : "〈",
    title : getApp().globalData.scendTitleName,
    list : [
      {
        name : "账户信息",
        title : "Name",
        flag : 0,
        inp : 0,
      },
      {
        name : "账户类型",
        title : "Type",
        flag : 0,
        inp : 0,
      },
      {
        name : "初始金额",
        title : "Money",
        flag : 1,
        inp : 0,
      },
      {
        name : "备注",
        title : "Remark",
        flag : 0,
        inp : 0,
      },
      {
        name : "成员列表",
        title : "Member",
        inp : 1,
        grop : [
          {
            name : "我",
            checked : "true",
          },

          {
            name : "老婆",
            checked : "true",
          },
        ],
      },
    ],
    but : [
      {
        name : "取消"
      },
      {
        name : "创建"
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})