const cloud = require('wx-server-sdk');
cloud.init();
class Service {
    _replaceCharacterForMe(member) {
        let {OPENID} = cloud.getWXContext();
        if (OPENID === member.openid) {
            member.character = '我';
        }
    }

    _replaceCharacterForMeInList(members) {
        let {OPENID} = cloud.getWXContext();
        members.forEach(member => this._replaceCharacterForMe(member));
    }
}

module.exports = Service;
