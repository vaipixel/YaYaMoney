// miniprogram/pages/createGroup/createGroup.js
const {createGroup, joinGroup} = require('../../requests');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // create or join
        pageType: 'create',
        groupId: '',
        characters: [
            {
                name: '老公',
                checked: false
            },
            {
                name: '老婆',
                checked: false
            }],
        selectedCharacter: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.pageType) {
            this.setData({
                pageType: options.pageType
            });
        }
        if (options.pageType === 'join') {
            this.data.groupId = options.groupId;
        }
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
    cancel: function () {
        wx.navigateBack();
    },
    createGroup: async function () {
        let selectedCharacter = this.data.selectedCharacter;
        if (selectedCharacter === undefined || selectedCharacter === null || selectedCharacter === '') {
            return
        }
        this.showLoading();
        //todo check error
        let groupId = (await createGroup(selectedCharacter)).data;
        // let groupId = 'b00064a7603cfd2b07d4679b543f9138';
        this.hideLoading();
        console.log(groupId);
        wx.navigateTo({
            url: `/pages/inviteMember/inviteMember?groupId=${groupId}`
        });
    },
    joinGroup: async function () {
        let selectedCharacter = this.data.selectedCharacter;
        if (selectedCharacter === undefined || selectedCharacter === null || selectedCharacter === '') {
            return
        }
        this.showLoading();
        await joinGroup(this.data.groupId, selectedCharacter);
        this.hideLoading();
        wx.redirectTo({
            url: '/pages/index/index'
        });
    },
    onCharacterChanged: function (e) {
        this.data.selectedCharacter = e.detail.value;
    },
    showLoading: function () {
        wx.showLoading({
            title: '创建中',
            mask: true
        });
    },
    hideLoading: function () {
        wx.hideLoading();
    }
})