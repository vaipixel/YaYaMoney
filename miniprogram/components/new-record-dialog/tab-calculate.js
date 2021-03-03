class TabCalculate {
    constructor(context) {
        this._context = context;
    }

    async getAdjustMoneyTabHeight() {
        let anchorBottom = await wx.async.asyncSelector(this._context, '#anchor-adjust-money-bottom', {
            rect: true,
        });
        let anchorTop = await wx.async.asyncSelector(this._context, '#anchor-adjust-money-top', {
            rect: true,
        });
        return anchorBottom.top - anchorTop.bottom;
    }

    async getTransferTabHeight() {
        let anchorBottom = await wx.async.asyncSelector(this._context, '#anchor-transfer-bottom', {
            rect: true,
        });
        let anchorTop = await wx.async.asyncSelector(this._context, '#anchor-transfer-top', {
            rect: true,
        });
        return anchorBottom.top - anchorTop.bottom;
    }

}

export { TabCalculate }