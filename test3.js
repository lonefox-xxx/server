const { LinearClient } = require('bybit-api')

const API_KEY = 'MDwvCPqoZtIH8BsdmI';
const API_SECRET = 'AS1pd69PboZA1IoxoID1qhi9IMnCOmyAoG14';
const useTestnet = true;

const client = new LinearClient({
    key: API_KEY,
    secret: API_SECRET,
    testnet: useTestnet
})

const get_qty = (price, per) => {

    const data = client.getWalletBalance().then(({ result }) => {
        const bal = result.USDT.available_balance
        const amo = per * bal / 100
        const qty = amo / price
        return qty.toFixed(2)
    })
    return data
}

get_qty(16879.65, 10).then((data) => {
    console.log(data);
})