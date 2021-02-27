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

function toPercent(point) {
    let str = Number(point * 100).toFixed(2);
    return str + '%';
}

function calculateIncomeRate(now, last) {
    return toPercent((now - last) / last)
}

module.exports = {
    getLastDayDate,
    getLastMonthDate,
    getLastYearDate,
    toPercent,
    calculateIncomeRate
}