// miniprogram/pages/createAccount/createAccount.js
const iconUtils = require("../../utils/iconUtils");
const {getGroupMembers, createAccount, updateAccount, isAccountExist, getAccountInfoWithMembers} = require('../../requests');
const {isStrEmpty} = require('../../utils/strUtils');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: "",
        _accountId: '',
        accountExist: false,
        accountName: "",
        accountIcon: '/assets/images/fund.svg',
        accountType: "",
        accountInitMoneyOfMe: 0,
        accountInitMoneyOfPartner: 0,
        accountDesc: "",
        members: {
            me: {
                name: "我",
                character: "我",
                checked: true
            },
            partner: {
                name: "老婆",
                character: "**",
                checked: false
            }
        },
        _itemHeight: 0,
        isIconDialogShown: false,
        isTypeDialogShown: false,
        icons: [
            '/assets/images/fund.svg',
            '/assets/images/stock.svg',
            '/assets/images/saves.svg',
            '/assets/images/cash.svg',
            '/assets/images/home.svg',
            '/assets/images/cars.svg',
            '/assets/images/alipay.svg',
            '/assets/images/wechatpay.svg'
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        this.showLoading();
        console.log(options);
        this.data._accountId = options.accountId;
        let isAccountExist = await this.isAccountExist();
        this.setData({
            accountExist: isAccountExist
        })
        if (isAccountExist) {
            await this.onEditAccount();
        } else {
            this.onCreateAccount();
        }

        this.hideLoading();
    },
    onEditAccount: async function () {
        console.log('onEditAccount');
        this.setData({
            title: '编辑账户',
        });
        let accountInfo = (await getAccountInfoWithMembers(this.data._accountId)).data;
        let members = (await getGroupMembers()).data;
        if (accountInfo.members.me) {
            members.me.checked = true;
        }
        if (accountInfo.members.partner) {
            members.partner.checked = true;
        }
        this.setData({
            accountName: accountInfo.accountName,
            accountType: accountInfo.accountType,
            accountIcon: accountInfo.accountIcon,
            accountDesc: accountInfo.accountDesc,
            members: members
        });
    },

    onCreateAccount: async function () {
        console.log('onCreateAccount');
        this.setData({
            title: '创建账户',
        });
        let members = (await getGroupMembers()).data;
        members.me.checked = true;
        this.setData({
            members: members
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: async function () {
        await this._getItemHeight('.member-money');
        let context = this;
        context._fadeIn('.money-me');
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
    onMemberTaped: function (e) {
        let tapedUser = e.currentTarget.dataset.userName;
        this._onMemberTaped(tapedUser);
    },
    _onMemberTaped: async function (tapedUser) {
        console.log('_onMemberTaped');
        console.log(tapedUser);
        let members = this.data.members;
        let context = this;
        let itemClass = '';
        let dataKey = '';
        let dataValue = false;
        if (tapedUser === members.me.character) {
            itemClass = '.money-me';
            dataKey = 'members.me.checked';
            dataValue = !this.data.members.me.checked;
        } else if (tapedUser === members.partner.character) {
            itemClass = '.money-partner';
            dataKey = 'members.partner.checked';
            dataValue = !this.data.members.partner.checked;
        }
        if (this.data.accountExist) {
            let data = {};
            data[dataKey] = dataValue;
            context.setData(data);
        } else {
            if (dataValue) {
                let data = {};
                data[dataKey] = dataValue;
                this.setData(data);
                this._fadeIn(itemClass);
            } else {
                this._fadeOut(itemClass, () => {
                    let data = {};
                    data[dataKey] = dataValue;
                    context.setData(data);
                })
            }
        }

    },
    _fadeOut: function (selector, callback) {
        let itemHeight = this.data._itemHeight;
        this.animate(selector, [{
            height: itemHeight + 'px',
            ease: 'ease-in'
        },
            {
                height: '0px',
                ease: 'ease-in',
                opacity: 0
            }
        ], 250, callback);
    },
    _fadeIn: async function (selector, callback) {
        let itemHeight = this.data._itemHeight;
        this.animate(selector, [{
            height: '0px',
            ease: 'ease-out'
        }, {
            height: itemHeight + 'px',
            ease: 'ease-in'
        }], 250, callback && callback());
    },
    _getItemHeight: async function (selector) {
        let size = 0;
        if (this.data._itemHeight === 0) {
            size = (await wx.async.asyncSelector(this, selector, {
                size: true,
            })).height;
            this.data._itemHeight = size;
        } else {
            size = this.data._itemHeight;
        }
        return size;
    },
    onChooseIcon: function () {
        this.setData({
            isIconDialogShown: true
        });
    },
    showTypeSelectorDialog: function () {
        this.setData({
            isTypeDialogShown: true
        });
    },
    onIconChanged: function (e) {
        let icon = e.target.dataset.icon;
        this.setData({
            isIconDialogShown: false,
            accountIcon: icon
        });
    },
    onTypeChanged: function (e) {
        let type = e.target.dataset.type;
        this.setData({
            accountType: type,
            isTypeDialogShown: false
        });
    },
    isAccountExist: async function () {
        let newVar = await isAccountExist(this.data._accountId);
        console.log('isAccountExist');
        console.log(newVar);
        return newVar.data;
    },
    createAccount: async function () {
        let data = this.data;

        let members = [];
        if (data.members.me.checked) {
            data.members.me.initAmount = data.accountInitMoneyOfMe;
            members.push(data.members.me);
        }
        if (data.members.partner.checked) {
            data.members.partner.initAmount = data.accountInitMoneyOfMe;
            members.push(data.members.partner);
        }

        let account = {
            accountName: data.accountName,
            accountIcon: data.accountIcon,
            accountType: data.accountType,
            accountDesc: data.accountDesc,
            members
        };

        if (this.checkParams(account)) {
            return
        }
        this.showLoading();
        await createAccount(account);
        this.hideLoading();
        this.notifyRefreshGroup();
        wx.navigateBack();
    },
    editAccount: async function () {
        this.showLoading();

        let data = this.data;

        let members = [];
        if (data.members.me.checked) {
            members.push(data.members.me);
        }
        if (data.members.partner.checked) {
            members.push(data.members.partner);
        }

        let account = {
            accountId: data._accountId,
            accountName: data.accountName,
            accountIcon: data.accountIcon,
            accountType: data.accountType,
            accountDesc: data.accountDesc,
            members
        };

        if (this.checkParams(account)) {
            return
        }
        await updateAccount(account);
        this.hideLoading();
        this.notifyRefreshGroup();
        wx.navigateBack();
    },
    checkParams: function (account) {
        let {accountName, accountType, members} = account;
        if (isStrEmpty(accountName)) {
            this.showError('账户名称为空');
            return true;
        }
        if (isStrEmpty(accountType)) {
            this.showError('账户类型为空');
            return true;
        }
        if (members.length === 0) {
            this.showError('至少要一名成员');
            return true;
        }
        return false;
    },
    cancel: function () {
        wx.navigateBack();
    },
    showLoading: function () {
        this.setData({
            isLoading: true
        });
        wx.showLoading({
            title: '加载中',
            mask: true
        });
    },
    hideLoading: function () {
        wx.hideLoading();
        this.setData({
            isLoading: false
        });
    },
    showError: function (msg) {
        console.log(`showError: ${msg}`);
        wx.showToast({
            title: msg,
            icon: 'error'
        })
    },
    notifyRefreshGroup: function () {
        let eventChannel = this.getOpenerEventChannel();
        eventChannel.emit('refreshGroupData');
    }
})
