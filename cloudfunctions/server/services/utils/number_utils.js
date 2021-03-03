function toPercent(point) {
    let str = Number(point * 100).toFixed(2);
    return str + '%';
}

function calculateIncomeRate(now, last) {
    if (last === 0) {
        return '-%'
    }
    return toPercent((now - last) / last);
}

module.exports = {
    toPercent,
    calculateIncomeRate
}