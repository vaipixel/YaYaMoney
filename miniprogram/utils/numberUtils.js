function getNumberFromStr(str) {
    return parseInt(str.replace(/[^0-9]/ig, ""));
}

module.exports = {
    getNumberFromStr: getNumberFromStr
}