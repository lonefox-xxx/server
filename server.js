const CryptoJS = require('crypto-js')
const fs = require('fs');
const request = require('request');
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

app.get('*', (req, res) => {
    res.send('EVERYTHING IS FINE')
})



app.post('/order', (req, res) => {
    try {
        fs.readFile('detials.json', (err, data) => {
            if (err) {
                // handle the error and send a response to the client
                return res.status(500).send({ error: 'Error reading JSON file' });
            }

            const jsonData = JSON.parse(data);
            const main = jsonData.main
            const status = main.status
            const time = main.sleep_until
            const nowtime = new Date / 1

            if (status == "off" || time > nowtime) {
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

                    // make HTTP request using the request module
                    axios.post('https://dark-teal-crayfish-tutu.cyclic.app/openorder', data).then((d) => {
                        // if (error) {
                        //     // handle the error and send a response to the client
                        //     return res.status(500).send({ error: 'Error making HTTP request' });
                        // }
                        // send a response to the client
                        res.send({ success: 'Request succeeded' });
                        console.log(d.data);
                    });
                }
                else if (type == 'close') {
                    const data = {
                        side: body.side,
                        id: body.symbol,
                        price: body.price,
                        symbol: body.symbol
                    }

                    console.log(data);
                    // make HTTP request using the request module
                    axios.post('https://dark-teal-crayfish-tutu.cyclic.app/orderclose', data).then((data) => {

                        // send a response to the client
                        res.send({ success: 'Request succeeded' });
                        console.log(data);
                    });
                } else {
                    // send a response to the client
                    res.send('sorry');
                }
            }
        });
    } catch (error) {
        // handle the error and send a response to the client
        return res.status(500).send({ error: 'An unexpected error occurred' });
    }
});

app.post('/openorder', (req, res) => {
    try {
        const side = req.body.side;
        const price = req.body.price;
        const ts = get_tpsl(price, side);
        // make HTTP request using the request module
        get_qty(price, 10).then((qty) => {

            const parms = {
                symbol: req.body.symbol,
                price: price.toFixed(2),
                qty: qty,
                side: side.charAt(0).toUpperCase() + side.slice(1),
                order_type: 'Limit',
                time_in_force: 'GoodTillCancel',
                take_profit: ts.tp,
                stop_loss: ts.sl,
                close_on_trigger: false,
                reduce_only: false,
                position_idx: 0
            };
            const arg = {
                index: req.body.symbol,
                price: price.toFixed(2),
                qty: qty,
                time: new Date / 1
            }
            add_recode(arg)
            client.placeActiveOrder(parms).then(({ result }) => {
                console.log(result);
                res.send(result);
                // make another HTTP request using the request module
                request.post({
                    url: 'https://dark-teal-crayfish-tutu.cyclic.app/sendlog',
                    json: true,
                    body: result
                }, (error, response, body) => {
                    if (error) {
                        // handle the error
                        console.error(error);
                    }
                });
            });
        });
    } catch (error) {
        // handle the error and send a response to the client
        return res.status(500).send({ error: 'An unexpected error occurred' });
    }

});


app.post('/orderclose', (req, res) => {
    fs.readFile('detials.json', (err, data) => {

        const symbol = req.body.symbol
        const side = req.body.side
        const price = req.body.price

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
            reduce_only: false,
            position_idx: 0
        };
        client.placeActiveOrder(parms).then(({ result }) => {
            // console.log(result);
            res.send(result);
        });
        delete_record(symbol)
    });
})

app.post('/qty', (req, res) => {

    const data = {
        api_key: API_KEY,
        coin: 'USDT',
        timestamp: new Date / 1000,
    }

    const send_data = {
        api_key: API_KEY,
        coin: 'USDT',
        timestamp: new Date / 1000,
        sing: createSignedParams(API_SECRET, data)
    }

    axios.get('https://api-testnet.bybit.com/v2/private/wallet/balance', send_data).then((d) => {
        console.log(d);
    })

})

app.post('/sendlog', (req, res) => {
    const data = req.body;
    const msg = `SIMBOL : ${data.symbol}\n\nTYPE : ${data.side}\n\n\QTY : ${data.qty}\n\nENTRY PRICE : ${data.price}\n\nTAKE PROFIT : ${data.take_profit}\n\n\STOP LOSE : ${data.stop_loss}\n\nID : ${data.order_id}\n\n`;
    (async () => {
        await axios.get(`https://api.telegram.org/bot5129025740:AAF_asgA7Kbvxq-o3lqopFp7OfywA8KW8uU/sendMessage?chat_id=-1001592447140&text=${encodeURIComponent(msg)}`);
        // await axios.post("https://soulfox-bot-db.herokuapp.com/putdata", data)
    })()
    res.send('ok')
})

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

const add_recode = (arg) => {
    const index = arg.index
    const price = arg.price
    const qty = arg.qty
    const time = arg.time
    fs.readFile('detials.json', (err, data) => {
        if (err) return
        const jsonData = JSON.parse(data);
        const exesdata = jsonData.open_order_detials
        const newdata = {
            [`${index}`]: {
                price: price,
                qty: qty,
                time: time
            }
        }
        const fdata = Object.assign({}, exesdata, newdata);
        const filedata = fs.readFileSync('detials.json');
        const obj = JSON.parse(filedata);
        obj.open_order_detials = fdata
        const json = JSON.stringify(obj);
        fs.writeFileSync('detials.json', json);
    })
}

const delete_record = (index) => {
    fs.readFile('detials.json', (err, data) => {
        if (err) return
        const jsonData = JSON.parse(data);
        const exesdata = jsonData.open_order_detials
        const newdata = { [`${index}`]: undefined }
        const fdata = Object.assign({}, exesdata, newdata);
        const filedata = fs.readFileSync('detials.json');
        const obj = JSON.parse(filedata);
        obj.open_order_detials = fdata
        const json = JSON.stringify(obj);
        fs.writeFileSync('detials.json', json);
    })
}


const createSignedParams = (data, secretKey) => {
    const hash = CryptoJS.HmacSHA256(JSON.stringify(data), secretKey);
    const base64Hash = CryptoJS.enc.Base64.stringify(hash);
    return base64Hash
};

const get_qty = (price, per) => {

    const data = client.getWalletBalance().then(({ result }) => {
        const bal = result.USDT.available_balance
        const amo = per * bal / 100
        const qty = amo / price
        return qty.toFixed(2)
    })
    return data
}
