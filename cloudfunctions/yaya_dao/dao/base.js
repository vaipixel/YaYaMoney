
function initWxSdk() {
    const cloud = require('wx-server-sdk');
    cloud.init();
    return cloud;
}

class Dao {
    constructor() {
    }

}

module.exports = {
    Dao: Dao, initWxSdk
};