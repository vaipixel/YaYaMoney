class ServerError extends Error {
    constructor(errorEnum) {
        super();
        this.code = errorEnum.code;
        this.message = errorEnum.message;
    }
}

class ErrorEnum {
    constructor(code, message) {
        this.code = code;
        this.message = message;
    }

    getErrorResponse() {
        return {
            code: this.code,
            message: this.message
        };
    }
}

const errors = {

    // 群组异常 3000 ～ 3999
    GROUP_USER_ALREADY_JOIN_GROUP: new ErrorEnum(3000, '用户已经加入组了'),
    GROUP_IS_FULL: new ErrorEnum(3001, '群组已经满员了'),

    // 账户异常 4000 ～ 4999
    ACCOUNT_ACCOUNT_ID_AND_USER_ID_IS_NECESSARY: new ErrorEnum(4000, '账户 ID 和 用户 ID 必须上传'),
    ACCOUNT_ACCOUNT_NOT_EXIST: new ErrorEnum(4001, '账户不存在'),

    // 记录异常 5000 ～ 5999
    RECORD_NO_PERMISSION_EDIT_OTHER_GROUP: new ErrorEnum(5000, '没有权限修改其他群组的记录'),

    // 用户异常 6000 ~ 6999
    USER_OPENID_IS_NULL: new ErrorEnum(6000, 'OPENID 是空'),
    USER_ALREADY_JOIN_GROUP: new ErrorEnum(6001, '用户已经加入一个群组了'),

};

function throwError(error) {
    throw new ServerError(error);
}

module.exports = {
    throwError,
    errors,
    ErrorEnum
}
