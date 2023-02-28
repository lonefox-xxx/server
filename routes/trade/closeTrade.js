const fs = require('fs');
const client = require('../authentication/auth');
const { delete_record } = require('./record');

function closeOrder(req) {
    const close = fs.readFile('./detials.json', (err, data) => {

        const symbol = req.symbol
        const side = req.side
        const price = req.price

        if (err) return
        const jsonData = JSON.parse(data);
        const exesdata = jsonData.open_order_detials[`${symbol}`]
        const qty = exesdata.qty

        const parms = {
            symbol: symbol,
            price: price,
            qty: qty,
            side: side.charAt(0).toUpperCase() + side.slice(1),
            order_type: 'Limit',
            time_in_force: 'GoodTillCancel',
            close_on_trigger: false,
            reduce_only: true,
            position_idx: 0
        };
        const place = client.placeActiveOrder(parms).then((result) => {
            console.log(result);
            return result
        });
        delete_record(symbol)
        return place
    });
    return close
}

module.exports = closeOrder