// miniprogram/pages/index/requests.js
import {NotLoginError, UserHasNoGroupError, GroupNotReadyError} from "../../errors/errors";

const {getUserGroupId} = require('../../requests');
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
                "全部", "我", "**"
            ]
        },
        isLoading: false,
        groupInfo: {
            overview: {
                amount: '****',
                income: {
                    amount: '**',
                    rate: '**%'
                }
            },
            members: {
                me: {
                    avatarUrl: '/assets/images/avatar.svg',
                    character: '我',
                    amount: '****',
                    income: {
                        amount: '**',
                        rate: '**%'
                    }
                },
                partner: {
                    avatarUrl: '/assets/images/avatar.svg',
                    character: '**',
                    amount: '****',
                    income: {
                        amount: '**',
                        rate: '**%'
                    }
                }
            },
            accounts: []
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        this.showLoading();
        if (!(await this.initViewModel())) {
            return
        }
        indexViewModel.observerIntervalChanged(observer, interval => {
            this.setData({
                'pageInfo.currentInterval': interval
            });
            this.requestGroupInfo();
        });
        indexViewModel.observerUserInfo(observer, userInfo => {
        });
        indexViewModel.observerGroupInfo(observer, groupInfo => {
            console.log('observerGroupInfo');
            console.log(groupInfo);
            this.setData({
                groupInfo: groupInfo
            });
            this.initTab(groupInfo.members.partner.character);
            this.hideLoading();
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
        let accountName = e.target.dataset.accountName;
        wx.navigateTo({
            url: `/pages/account/account?accountId=${accountId}&accountName=${accountName}`
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
    hideLoading: function () {
        wx.hideLoading();
        this.setData({
            isLoading: false
        })
    },
    initTab: function (character) {
        let tabData = this.data.pageInfo.tabData;
        tabData[2] = character;
        this.setData({
            'pageInfo.tabData': tabData
        });
    },
    initViewModel: async function () {
        indexViewModel = wx.viewModels.index;
        try {
            await indexViewModel.init();
            return true;
        } catch (e) {
            console.log(e)
            this.hideLoading();
            if (e instanceof NotLoginError) {
                console.log('unauthed');
                wx.redirectTo({
                    url: "/pages/welcome/welcome?pageType=login"
                })
            } else if (e instanceof UserHasNoGroupError) {
                console.log('no group found');
                wx.redirectTo({
                    url: "/pages/welcome/welcome?pageType=welcome&userId=" + indexViewModel.userInfo._id
                })
            } else if (e instanceof GroupNotReadyError) {
                let groupId = (await getUserGroupId()).data;
                wx.redirectTo({
                    url: `/pages/inviteMember/inviteMember?groupId=${groupId}`
                })
            }
            return false;
        }
    },
    requestGroupInfo: function () {
        this.showLoading();
        indexViewModel.requestGroupInfo();
    },
})