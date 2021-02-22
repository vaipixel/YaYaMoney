// miniprogram/pages/createAccount/createAccount.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        acocuntName: "",
        accountType: "",
        accountInitMoneyOfMe: 0,
        accountInitMoneyOfPartner: 0,
        comment: "",
        members: {
            me: {
                name: "我",
                alias: "我",
                checked: true
            },
            partner: {
                name: "老婆",
                alias: "老婆",
                checked: false
            }
        },
        _itemHeight: 0
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
    onShow: async function() {
        await this._getItemHeight('.member-money');
        let context = this;
        context._fadeIn('.money-me');
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
    onMemberTaped: function(e) {
        let tapedUser = e.target.dataset.userName;
        this._onMemberTaped(tapedUser);
    },
    _onMemberTaped: async function(tapedUser) {
        let members = this.data.members;
        let context = this;
        var itemClass = '';
        var dataKey = '';
        var dataValue = false;
        if (tapedUser === members.me.alias) {
            itemClass = '.money-me';
            dataKey = 'members.me.checked';
            dataValue = !this.data.members.me.checked;
        } else if (tapedUser === members.partner.alias) {
            itemClass = '.money-partner';
            dataKey = 'members.partner.checked';
            dataValue = !this.data.members.partner.checked;
        }
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
    },
    _fadeOut: async function(selector, callback) {
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
    _fadeIn: async function(selector, callback) {
        let itemHeight = this.data._itemHeight;
        this.animate(selector, [{
            height: '0px',
            ease: 'ease-out'
        }, {
            height: itemHeight + 'px',
            ease: 'ease-in'
        }], 250, callback && callback());
    },
    _getItemHeight: async function(selector) {
        var size = 0;
        if (this.data._itemHeight === 0) {
            size = (await wx.async.asyncSelector(this, selector, {
                size: true,
            })).height;
            this.data._itemHeight = size;
        } else {
            size = this.data._itemHeight;
        }
        return size;
    }
})