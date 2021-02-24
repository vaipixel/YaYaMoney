class NotLoginError extends Error {
    constructor() {
        super();
        this.name = 'NotLoginError';
        this.message = '用户没有登录';
    }
}

class UserHasNoGroupError extends Error {
    constructor(props) {
        super(props);
        this.name = 'UserHasNoGroupError';
        this.message = '用户没有加入群组';
    }

}

export {NotLoginError, UserHasNoGroupError}