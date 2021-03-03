function iconToKey(icon) {
    switch (icon) {
        case '/assets/images/fund.svg':
            return 'fund';
        case '/assets/images/stock.svg':
            return 'stock';
        case '/assets/images/saves.svg':
            return 'saves';
        case '/assets/images/cash.svg':
            return 'cash';
        case '/assets/images/home.svg':
            return 'home';
        case '/assets/images/cars.svg':
            return 'cars';
        case '/assets/images/alipay.svg':
            return 'alipay';
        case '/assets/images/wechatpay.svg':
            return 'wechatpay';
    }
}

function keyToIcon(key) {
    switch (key) {
        case 'fund':
            return '/assets/images/fund.svg';
        case 'stock':
            return '/assets/images/stock.svg';
        case 'saves':
            return '/assets/images/saves.svg';
        case 'cash':
            return '/assets/images/cash.svg';
        case 'home':
            return '/assets/images/home.svg';
        case 'cars':
            return '/assets/images/cars.svg';
        case 'alipay':
            return '/assets/images/alipay.svg';
        case 'wechatpay':
            return '/assets/images/wechatpay.svg';
    }
}

module.exports = {
    iconToKey: iconToKey,
    keyToIcon: keyToIcon
}