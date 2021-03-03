function getYearAndMonth(date) {
    return `${date.getFullYear()}-${date.getMonth()}`
}

function getChineseMonth(month) {
    switch (month.split('-')[1]) {
        case '01':
            return '一月'
        case '02':
            return '二月'
        case '03':
            return '三月'
        case '04':
            return '四月'
        case '05':
            return '五月'
        case '06':
            return '六月'
        case '0七':
            return '七月'
        case '08':
            return '八月'
        case '09':
            return '九月'
        case '10':
            return '十月'
        case '11':
            return '十一月'
        case '12':
            return '十二月'
    }
}

function getDateByInterval(interval) {
    switch (interval) {
        case '每日':
            return getLastDayDate();
        case '每月':
            return getLastMonthDate();
        case '每年':
            return getLastYearDate();
        default:
            return getLastMonthDate();
    }
}

function getLastDayDate() {
    let now = new Date();
    return new Date(now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0);
}

function getLastMonthDate() {
    let now = new Date();
    return new Date(now.getFullYear(),
        now.getMonth(),
        1,
        0,
        0,
        0);
}

function getLastYearDate() {
    let now = new Date();
    return new Date(now.getFullYear(),
        0,
        1,
        0,
        0,
        0);
}

module.exports = {
    getDateByInterval,
    getYearAndMonth,
    getChineseMonth
}