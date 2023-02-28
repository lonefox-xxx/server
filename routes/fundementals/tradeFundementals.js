const client = require("../authentication/auth");


const get_tpsl = (price, type) => {
    var tp = 0
    var sl = 0
    if (type == 'buy') {
        tp = Math.abs(0.5 * price / 100 + price);
        sl = Math.abs(1 * price / 100 - price);
    } else {
        tp = Math.abs(0.5 * price / 100 - price);
        sl = Math.abs(1 * price / 100 + price);
    };
    const tpsl = {
        tp: tp.toFixed(2),
        sl: sl.toFixed(2)
    }
    return tpsl;
}

const get_qty = (price, per) => {

    const data = client.getWalletBalance().then(({ result }) => {
        const bal = result.USDT.available_balance
        const amo = per * bal / 100
        const qty = amo / price
        return qty.toFixed(2)
    })
    return data
}

module.exports = {
    get_tpsl: get_tpsl, get_qty: get_qty
}