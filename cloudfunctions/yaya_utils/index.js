function initCloud() {
    const cloud = require('wx-server-sdk');
    cloud.init();
    return cloud;
}

module.exports = {
    initCloud
}