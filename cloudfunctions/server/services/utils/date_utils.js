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
    getDateByInterval
}