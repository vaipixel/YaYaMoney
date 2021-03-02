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
}

const errors = {
    // 群组异常 3000 ～ 3999
    GROUP_USER_ALREADY_JOIN_GROUP: new ErrorEnum(3000, '用户已经加入组了'),
    GROUP_IS_FULL: new ErrorEnum(3001, '群组已经满员了'),

    // 账户异常 4000 ～ 4999
    ACCOUNT_ACCOUNT_ID_AND_USER_ID_IS_NECESSARY: new ErrorEnum(4000, '账户 ID 和 用户 ID 必须上传')
}

function throwError(error) {
    throw new ServerError(error);
}

module.exports = {
    throwError,
    errors
}