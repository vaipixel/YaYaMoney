// miniprogram/pages/inviteMember/inviteMember.js
const {isUserAlreadyJoinGroup, currentUserIsGroupCreator, isGroupReady, isUserRegistered} = require('../../requests');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        groupId: '',
        isCreator: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        this.showLoading();
        let groupId = options.groupId;
        // let groupId = '28ee4e3e603da917085fc2b943e61e18';
        if (await this.checkUserStatus()) {
            let sourcePage = '/pages/inviteMember/inviteMember';
            wx.redirectTo({
                url: `/pages/welcome/welcome?sourcePage=${sourcePage}&pageType=login&groupId=${groupId}`
            })
            return;
        }

        this.setData({
            groupId: groupId
        });
        if (await this.isUserAlreadyJoinGroup() && await this.isGroupReady(groupId)) {
            this.hiddenLoading();
            wx.redirectTo({
                url: '/pages/index/index'
            });
        }

        let isCreator = await this.currentUserIsGroupCreator(groupId);
        this.setData({
            isCreator: isCreator
        })

        this.hiddenLoading();
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

    },
    showLoading: function () {
        wx.showLoading({
            title: '加载中',
            mask: true
        })
    },
    hiddenLoading: function () {
        wx.hideLoading();
    },
    isUserAlreadyJoinGroup: async function () {
        return (await isUserAlreadyJoinGroup()).data;
    },
    currentUserIsGroupCreator: async function (groupId) {
        return (await currentUserIsGroupCreator(groupId)).data;
    },
    isGroupReady: async function (groupId) {
        return (await isGroupReady(groupId)).data;
    },
    checkUserStatus: async function () {
        let result = (await isUserRegistered()).data;
        console.log('isUserRegistered: ' + result);
        return !result;
    },
    onJoinGroup() {
        wx.navigateTo({
            url: `/pages/createGroup/createGroup?pageType=join&groupId=${this.data.groupId}`
        })
    }
});