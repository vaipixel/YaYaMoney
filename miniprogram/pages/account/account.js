// miniprogram/pages/account/account.js

let accountViewModel;

const observer = 'account';
const {deleteAccount, updateRecord, deleteRecord} = require('../../requests');
const dateUtils = require("../../utils/dateUtils.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        accountName: '',
        _accountId: '',
        isEditing: false,
        records: [],
        pageInfo: {
            // 调整余额对话框是否隐藏
            isAdjustMoneyDialogShow: false,
            // 转账对话框是否隐藏
            isTransferDialogShow: false,
            isSettingDialogShow: false,
            isDeleteAccountConfirmDialogShow: false,
            isDeleteRecordConfirmDialogShow: false,
            deleteConfirmDialogButtons: [{text: '取消'}, {text: '确定'}],
        },
        editingRecord: {},
        amountFocus: false,

        editingRecordId: '',
        editingRecordAmount: 0,
        editingRecordAccountName: '',
        editingRecordComment: '',
        editingRecordFormatDate: ''

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
            wx.stopPullDownRefresh();
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
        accountViewModel.requestRecords();
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
    showEditRecordDialog: function (e) {
        let recordType = e.currentTarget.dataset.recordType;
        let record = e.currentTarget.dataset.record;

        switch (recordType) {
            case '转账':
                // 转账
                this.showTransferDialog();
                this.setData({
                    editingRecordFromAccount: record.fromAccount.accountName,
                    editingRecordTargetAccount: record.targetAccount.accountName
                })
                break
            case '调整余额':
                // 调整余额
                this.showAdjustMoneyDialog();
                this.setData({
                    editingRecordAccountName: record.account.accountName
                })
                break
        }
        this.setData({
            editingRecordId: record._id,
            editingRecordAmount: record.amount,
            editingRecordComment: record.comment,
            editingRecordFormatDate: dateUtils.formatDate(new Date(record.date))
        });

    },
    showAdjustMoneyDialog: function () {
        this.setData({
            'pageInfo.isAdjustMoneyDialogShow': true
        })
    },
    dismissRecordDetailDialog: function () {
        this.setData({
            'pageInfo.isAdjustMoneyDialogShow': false,
            'pageInfo.isTransferDialogShow': false
        })
    },
    showTransferDialog: function () {
        this.setData({
            'pageInfo.isTransferDialogShow': true
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
    onDeleteAccountConfirmButtonTap: async function (e) {
        let index = e.detail.index;
        switch (index) {
            case 0:
                this.hideDeleteAccountConfirmDialog();
                break;
            case 1:
                this.showLoading();
                await this.deleteAccount();
                wx.navigateBack();
                this.hideLoading();
                break;
            default:
                this.hideDeleteAccountConfirmDialog();
                break;
        }
    },
    showDeleteAccountConfirmDialog: function () {
        this.setData({
            'pageInfo.isDeleteAccountConfirmDialogShow': true
        });
    },
    hideDeleteAccountConfirmDialog: function () {
        this.setData({
            'pageInfo.isDeleteAccountConfirmDialogShow': false
        });
    },
    onDeleteRecordConfirmButtonTap: async function (e) {
        let index = e.detail.index;
        switch (index) {
            case 0:
                this.hideDeleteRecordConfirmDialog();
                break;
            case 1:
                this.showLoading();
                await this.deleteRecord();
                this.hideDeleteRecordConfirmDialog();
                this.hideLoading();
                break;
            default:
                this.hideDeleteRecordConfirmDialog();
                break;
        }
    },
    showDeleteRecordConfirmDialog: function () {
        this.setData({
            'pageInfo.isDeleteRecordConfirmDialogShow': true
        });
    },
    hideDeleteRecordConfirmDialog: function () {
        this.setData({
            'pageInfo.isDeleteRecordConfirmDialogShow': false
        });
    },
    deleteRecord: async function () {
        this.showLoading();
        await deleteRecord(this.data.editingRecordId);
        this.dismissRecordDetailDialog();
        this.hideDeleteRecordConfirmDialog();
        accountViewModel.requestRecords();
    },
    onEditRecord: function () {
        this.setData({
            isEditing: true
        });
        setTimeout(() => {
            this.setData({
                focus: true
            });
        }, 100);

    },
    applyChanges: async function () {
        this.showLoading();
        let data = this.data;
        let record = {
            _id: data.editingRecordId,
            amount: data.editingRecordAmount,
            comment: data.editingRecordComment
        }
        await updateRecord(record);
        this.dismissRecordDetailDialog();
        accountViewModel.requestRecords();
    },
    oEditDialogClose: function () {
        this.cancelEdit();
    },
    cancelEdit: function () {
        this.setData({
            isEditing: false
        });
    }
})
