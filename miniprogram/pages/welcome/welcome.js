// miniprogram/pages/welcome/welcome.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        welcomeDesc: "看来你是第一次用吖吖资产呢，\n你需要先创建或者加入一个“组”。",
        loginDesc: "先来授权登录咯。",
        pageType: "welcome",
        _userId: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let pageType = options.pageType;
        this.setData({
            pageType: pageType || 'login'
        })
        this.data._userId = options.userId;
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    create: async function() {
        wx.navigateTo({
            url: "/pages/createGroup/createGroup"
        });
        // let groupService = wx.services.groupService;
        // await groupService.createGroup(this.data._userId);
        // wx.redirectTo({
        //     url: "/pages/index/index"
        // })
    },
    join: function() {

    },
    onGetUserInfo: function(e) {
        let userData = e.detail;
        if (!userData.userInfo) {
            console.warn('The user deny login request.');
            return
        }
        // show loading
        wx.redirectTo({
            url: "/pages/index/index"
        })
    }
})