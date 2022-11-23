const { LinearClient } = require('bybit-api')
const bodyParser = require('body-parser')
const axios = require('axios')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000;

const API_KEY = 'MDwvCPqoZtIH8BsdmI';
const API_SECRET = 'AS1pd69PboZA1IoxoID1qhi9IMnCOmyAoG14';
const useTestnet = true;

const client = new LinearClient({
    key: API_KEY,
    secret: API_SECRET,
    testnet: useTestnet
})

app.use(bodyParser.json())
app.listen(port, console.log(`running on ${port}`))

app.post('/price', (req, res) => {
    client.getIndexPriceKline(req.body)
        .then((result) => {
            res.send(result.result[0])
        })
        .catch(err => {
            res.send('no symbol exist')
        });
})

app.post('/order', (req, res) => {

    function get_tpsl(price, type) {

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

            tp: tp,
            sl: sl
        }

        return tpsl;
    }
    const side = req.body.side
    const ts = get_tpsl(req.body.price, side)
    const parms = {
        symbol: req.body.symbol,
        price: req.body.price,
        qty: 1,
        side: side.charAt(0).toUpperCase() + side.slice(1),
        order_type: 'Limit',
        time_in_force: 'GoodTillCancel',
        take_profit: ts.tp,
        stop_loss: ts.sl,
        close_on_trigger: false,
        reduce_only: false,
        position_idx: 0
    };

    console.log(parms);

    client.placeActiveOrder(parms).then((d) => {
        console.log(d);
        res.send(d);

        (async () => {
            await axios.post('https://soulfox-bot.herokuapp.com/sendlog', d.result)
        })()
    })
})

app.post('/walletbalance', (req, res) => {
    client.getWalletBalance(req.body)
        .then((result) => {
            const response = result.result
            res.send(response)
        })
        .catch(err => {
            res.send(err)
        });
})

app.post('/sendlog', (req, res) => {

    const data = req.body;
    const msg = `SIMBOL : ${data.symbol}\n\nTYPE : ${data.side}\n\n\QTY : ${data.qty}\n\nENTRY PRICE : ${data.price}\n\nTAKE PROFIT : ${data.take_profit}\n\n\STOP LOSE : ${data.stop_loss}\n\nID : ${data.order_id}\n\n`;
    (async () => {

        await axios.get(`https://api.telegram.org/bot5129025740:AAF_asgA7Kbvxq-o3lqopFp7OfywA8KW8uU/sendMessage?chat_id=-1001592447140&text=${encodeURIComponent(msg)}`)
    })()
    res.send('ok')
})