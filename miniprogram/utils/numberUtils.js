function getNumberFromStr(str) {
    return str.replace(/[^0-9]/ig, "");
}

module.exports = {
    getNumberFromStr: getNumberFromStr
}