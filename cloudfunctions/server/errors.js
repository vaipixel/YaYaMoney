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
    USER_ALREADY_JOIN_GROUP: new ErrorEnum(3000, '用户已经加入组了'),
    GROUP_IS_FULL: new ErrorEnum(3001, '群组已经满员了')
}

function throwError(error) {
    throw new ServerError(error);
}

module.exports = {
    throwError,
    errors
}