const axios = require('axios')
const client = require('../routes/authentication/auth')
const { get_qty } = require('../routes/fundementals/tradeFundementals')
const { add_recode } = require('../routes/trade/record')

const data = {
    type: 'close',
    symbol: 'BTCUSDT',
    side: 'sell',
    price: 23267.20
}
axios.post("http://localhost:3000/order", data).then(({ data }) => {
    console.log(data);
})

// const arg = {
//     index: "data.symbol",
//     price: 'price',
//     qty: "qty",
//     time: new Date / 1
// }

// add_recode(arg)

// const data = client.getWalletBalance().then(({ result }) => {
//     const bal = result.USDT.available_balance
//     const amo = per * bal / 100
//     const qty = amo / price
//     return qty.toFixed(2)
// })