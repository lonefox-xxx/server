const closeOrder = require("./closeTrade");
const openTrade = require("./openTrade");

function placeOrder(req, res) {
    const status = process.env.status
    if (status == "off") {
        res.send('BOT IS SLEEPING')
        return;
    } else {
        const body = req.body
        const type = body.type
        if (type == 'open') {
            const data = {
                symbol: body.symbol,
                side: body.side,
                price: body.price,
            }
            console.log('opening trade ');
            openTrade(data).then(data => {
                res.send(data)
            })
        }
        else if (type == 'close') {
            const data = {
                side: body.side,
                id: body.symbol,
                price: body.price,
                symbol: body.symbol
            }
            console.log('closeing trade ');

            closeOrder(data).then(data => {
                res.send(data)
            })
        } else {
            res.send('sorry');
        }
    }
}

module.exports = placeOrder