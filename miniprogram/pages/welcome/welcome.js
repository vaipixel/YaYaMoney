// miniprogram/pages/welcome/welcome.js
const {login} = require('../../requests');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        welcomeDesc: "看来你是第一次用吖吖资产呢，\n\n你需要先创建一个组，\n或者让别人邀请你加入一个“组”。",
        loginDesc: "先来授权登录咯。",
        pageType: "welcome",
        sourcePage: '/pages/index/index',
        _userId: "",
        _groupId: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let pageType = options.pageType;
        this.setData({
            pageType: pageType || 'login'
        });
        if (options.sourcePage) {
            this.data.sourcePage = options.sourcePage;
        }
        if (options.groupId) {
            this.data._groupId = options.groupId;
        }
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
    onGetUserInfo: async function(e) {
        console.log('getUserInfo');
        let userData = e.detail;
        if (!userData.userInfo) {
            console.warn('The user deny login request.');
            return
        }
        // show loading
        await login(userData);
        console.log(this.data.sourcePage);

        wx.redirectTo({
            url: `${this.data.sourcePage}?groupId=${this.data._groupId}`
        })
    }
})