require('dotenv').config()
const { add_recode } = require('./record');
const { get_qty, get_tpsl } = require('../fundementals/tradeFundementals');
const client = require('../authentication/auth');

function openTrade(data) {
    const side = data.side;
    const price = data.price;
    const ts = get_tpsl(price, side);

    const order = get_qty(price, 10).then((qty) => {

        const parms = {
            symbol: data.symbol,
            price: price,
            qty: 0.002,
            side: side.charAt(0).toUpperCase() + side.slice(1),
            order_type: 'Limit',
            time_in_force: 'GoodTillCancel',
            stop_loss: ts.sl,
            close_on_trigger: false,
            reduce_only: false,
            position_idx: 0
        };
        const arg = {
            index: data.symbol,
            price: price,
            qty: 0.002,
            time: new Date / 1
        }
        add_recode(arg)
        const place = client.placeActiveOrder(parms).then((result) => {
            console.log(result);
            return result
        });
        return place
    });
    return order
}
module.exports = openTrade