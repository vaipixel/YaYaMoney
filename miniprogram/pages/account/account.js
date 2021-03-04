// miniprogram/pages/account/account.js

let accountViewModel;

const observer = 'account';
const {deleteAccount} = require('../../requests');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        accountName: '',
        _accountId: '',
        records:[],
        pageInfo: {
            // 调整余额对话框是否隐藏
            isAdjustMoneyDialogShow: false,
            // 转账对话框是否隐藏
            isTransferDialogShow: false,
            isSettingDialogShow: false,
            isDeleteConfirmDialogShow: false,
            deleteConfirmDialogButtons: [{text: '取消'}, {text: '确定'}],
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.showLoading();
        this.data._accountId = options.accountId;
        this.initViewModel(options.accountId);
        this.setData({
            accountName: options.accountName
        })
        accountViewModel.observerRecords(observer, records => {
            this.setData({
                records: records
            });
            this.hideLoading();
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
        let recordId = e.target.dataset.recordId;
        console.log('editRecord ' + recordId);
    },
    showLoading: function () {
        wx.showLoading({
            title: '加载中',
            mask: true
        });
    },
    hideLoading: function () {
        wx.hideLoading();
    },
    showSettingMenu: function () {
        this.setData({
            'pageInfo.isSettingDialogShow': true
        });
    },
    hideSettingMenu: function () {
        this.setData({
            'pageInfo.isSettingDialogShow': false
        });
    },
    onSettingTaped: function () {
        this.showSettingMenu();
    },
    editAccount: function () {
        wx.navigateTo({
            url: `/pages/createAccount/createAccount?accountId=${this.data._accountId}`
        });
        this.hideSettingMenu();
    },
    deleteAccount: async function () {
        await deleteAccount(this.data._accountId);
    },
    onDeleteConfirmButtonTap: async function (e) {
        let index = e.detail.index;
        switch (index) {
            case 0:
                this.hideDialogConfirmDialog();
                break;
            case 1:
                this.showLoading();
                await this.deleteAccount();
                wx.navigateBack();
                this.hideLoading();
                break;
            default:
                this.hideDialogConfirmDialog();
                break;
        }
    },
    showDialogConfirmDialog: function () {
        this.setData({
            'pageInfo.isDeleteConfirmDialogShow': true
        });
    },
    hideDialogConfirmDialog: function () {
        this.setData({
            'pageInfo.isDeleteConfirmDialogShow': false
        });
    }
})
