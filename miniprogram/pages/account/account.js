// miniprogram/pages/account/account.js

let accountViewModel;
const observer = 'account'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        accountInfo: {
            recordList: [{
                month: "2020-06",
                name: "六月",
                record: [{
                    id: 1,
                    type: 1,
                    amount: 1001,
                    desc: "招行 > 基金 @我",
                    date: "06/23"
                },
                    {
                        id: 2,
                        type: 2,
                        amount: 1000,
                        desc: "招行 @老婆",
                        date: "06/23"
                    }
                ]
            },
                {
                    month: "2020-07",
                    name: "七月",
                    record: [{
                        id: 3,
                        type: 1,
                        amount: 1000,
                        desc: "招行 > 基金 @我",
                        date: "07/23"
                    },
                        {
                            id: 4,
                            type: 2,
                            amount: 1000,
                            desc: "招行 @老婆",
                            date: "07/23"
                        }
                    ]
                }
            ]
        },
        pageInfo: {
            // 调整余额对话框是否隐藏
            isAdjustMoneyDialogShow: false,
            // 转账对话框是否隐藏
            isTransferDialogShow: false
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.initViewModel(options.accountId);
        accountViewModel.observerRecords(observer, records => {
            this.setData({
                records: records
            })
        })
        accountViewModel.requestRecords();
    },
    initViewModel: function (accountId) {
        accountViewModel = wx.viewModels.account;
        accountViewModel.init(accountId);
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
    requestAccountDetail: function (accountId) {
        console.log('requestAccountDetail ' + accountId);
    },
    showEditRecordDialog: function (e) {
        let recordType = e.target.dataset.recordType;
        switch (recordType) {
            case '转账':
                // 转账
                this.showTransferDialog();
                break
            case '调整余额':
                // 调整余额
                this.showAdjustMoneyDialog()
                break
        }
    },
    showAdjustMoneyDialog: function () {
        this.setData({
            'pageInfo.isAdjustMoneyDialogShow': true
        })
    },
    dismissAdjustMoneyDialog: function () {
        this.setData({
            'pageInfo.isAdjustMoneyDialogShow': false
        })
    },
    showTransferDialog: function () {
        this.setData({
            'pageInfo.isTransferDialogShow': true
        })
    },
    dismissTransferDialog: function () {
        this.setData({
            'pageInfo.isTransferDialogShow': false
        })
    },
    editRecord: function (e) {
        var recordId = e.target.dataset.recordId;
        console.log('editRecord ' + recordId);
    }
})