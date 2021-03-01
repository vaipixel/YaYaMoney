// miniprogram/pages/index/requests.js
import {NotLoginError, UserHasNoGroupError} from "../../errors/errors";

let indexViewModel;

const observer = 'index';

Page({

    /**
     * 页面的初始数据
     */

    data: {
        // 统计区间选择 dialog 是否隐藏
        isIntervalPickDialogShow: false,
        isAddRecordDialogShow: false,
        isMenuDialogShow: false,
        pageInfo: {
            currentInterval: "每月",
            tabData: [
                "全部", "我", "老婆"
            ]
        },
        isLoading: false
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        this.showLoading();
        await this.initViewModel();
        indexViewModel.observerIntervalChanged(observer, interval => {
            this.setData({
                'pageInfo.currentInterval': interval
            });
            this.requestGroupInfo();
        });
        indexViewModel.observerUserInfo(observer, userInfo => {
        });
        indexViewModel.observerGroupInfo(observer, groupInfo => {
            this.setData({
                groupInfo: groupInfo
            });
            wx.hideLoading();
        });
        indexViewModel.setCurrentInterval('每月');


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
        indexViewModel.release(observer);
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
    showIntervalPickerDialog: function () {
        this.setData({
            isIntervalPickDialogShow: true
        })
    },
    dismissIntervalPickerDialog: function () {
        this.setData({
            isIntervalPickDialogShow: false
        })
    },
    showAddRecordDialog: function () {
        this.setData({
            isAddRecordDialogShow: true
        })
    },
    dismissAddRecordDialog: function () {
        this.setData({
            isAddRecordDialogShow: false
        })
    },
    navToAccountDetail: function (e) {
        let accountId = e.target.dataset.accountId;
        wx.navigateTo({
            url: "/pages/account/account?accountId=" + accountId
        });
    },
    changeInterval: function (e) {
        let selectedInterval = e.target.dataset.interval;
        this.dismissIntervalPickerDialog();
        indexViewModel.setCurrentInterval(selectedInterval);
    },
    onTabChanged: function (e) {
        let tab = e.detail.tab;
    },
    onMenuTaped: function () {
        this.setData({
            isMenuDialogShow: true
        })
    },
    onAddAccount: function () {
        wx.navigateTo({
            url: "/pages/createAccount/createAccount"
        });
        this.setData({
            isMenuDialogShow: false
        });
    },
    onAddRecordSuccess: function () {
        this.requestGroupInfo();
    },
    showLoading: function () {
        if (this.data.isLoading) {
            return
        }
        this.setData({
            isLoading: true
        })
        wx.showLoading({
            title: '加载中',
            mask: true
        });
    },
    initViewModel: async function () {
        indexViewModel = wx.viewModels.index;
        try {
            await indexViewModel.init();
        } catch (e) {
            wx.hideLoading();
            if (e instanceof NotLoginError) {
                console.log(e)
                console.log('unauthed');
                wx.redirectTo({
                    url: "/pages/welcome/welcome?pageType=login"
                })
            } else if (e instanceof UserHasNoGroupError) {
                console.log('no group found');
                wx.redirectTo({
                    url: "/pages/welcome/welcome?pageType=welcome&userId=" + indexViewModel.userInfo._id
                })
            }
        }
    },
    requestGroupInfo: function () {
        this.showLoading();
        indexViewModel.requestGroupInfo();
    }
})