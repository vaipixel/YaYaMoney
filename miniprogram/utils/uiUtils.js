function rpx2px(rpx) {
    return rpx / 820 * wx.getSystemInfoSync().windowWidth
}

module.exports = {
    rpx2px: rpx2px
}