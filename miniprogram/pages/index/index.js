// miniprogram/pages/index/index.js
Page({

    /**
     * 页面的初始数据
     */

    data: {
        // 统计区间选择 dialog 是否隐藏
        isIntervalPickDialogShow: true,
        isAddRecordDialogShow: false,
        isMenuDialogShow: false,
        pageInfo: {
            currentInterval: "每月",
            tabData: [
                "全部", "我", "老婆"
            ]
        },
        overview: {
            total: '1001K',
            income: "1002",
            rate: "3.56%"
        },
        members: {
            me: {
                uid: "",
                avatar: "/assets/images/avatar.png",
                name: "我",
                alias: "我",
                amount: 1010,
                rate: "11%"
            },
            partner: {
                uid: "",
                avatar: "/assets/images/avatar.png",
                name: "老婆",
                alias: "老婆",
                amount: 2000,
                rate: "12%"
            }
        },
        accounts: [{
                accountId: "1",
                accountName: "基金",
                accountDesc: "在蛋卷基金上的投资",
                accountIcon: "/assets/images/avatar.png",
                accountAmount: 10010,
                accountRate: "4.5%",
                members: [{
                        uid: "",
                        name: "我",
                        alias: "我",
                        avatar: "/assets/images/avatar.png",
                        amount: 1000,
                        incomeStatus: {
                            income: 100,
                            rate: "4.5%"
                        }
                    },
                    {
                        uid: "",
                        name: "老婆",
                        alias: "老婆",
                        avatar: "/assets/images/avatar.png",
                        amount: 1000,
                        incomeStatus: {
                            income: 100,
                            rate: "4.5%"
                        }
                    }
                ]
            },
            {
                accountId: "2",
                accountName: "股票",
                accountDesc: "股票交易",
                accountIcon: "/assets/images/avatar.png",
                accountAmount: 10001,
                accountRate: "-4.5%",
                members: [{
                        uid: "",
                        name: "我",
                        alias: "我",
                        avatar: "/assets/images/avatar.png",
                        amount: 1000,
                        incomeStatus: {
                            income: 100,
                            rate: "4.5%"
                        }
                    },
                    {
                        uid: "",
                        name: "老婆",
                        alias: "老婆",
                        avatar: "/assets/images/avatar.png",
                        amount: 1000,
                        incomeStatus: {
                            income: 100,
                            rate: "4.5%"
                        }
                    }
                ]
            }
        ]

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

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
    showIntervalPickerDialog: function() {
        this.setData({
            isIntervalPickDialogShow: true
        })
    },
    dismissIntervalPickerDialog: function() {
        this.setData({
            isIntervalPickDialogShow: false
        })
    },
    showAddRecordDialog: function() {
        this.setData({
            isAddRecordDialogShow: true
        })
    },
    dismissAddRecordDialog: function() {
        this.setData({
            isAddRecordDialogShow: false
        })
    },
    navToAccountDetail: function(e) {
        var accountId = e.target.dataset.accountId;
        wx.navigateTo({
            url: "/pages/account/account?accountId=" + accountId
        });
    },
    changeInterval: function(e) {
        var selectedInterval = e.target.dataset.interval;
        this.dismissIntervalPickerDialog();
        this.setData({
            'pageInfo.currentInterval': selectedInterval
        });
    },
    onTabChanged: function(e) {
        let tab = e.detail.tab;
        console.log(tab);
    },
    onMenuTaped: function() {
        console.log('onMenuTaped');
        this.setData({
            isMenuDialogShow: true
        })
    }
})