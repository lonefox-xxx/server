const { LinearClient } = require('bybit-api');

const env = process.env
const API_KEY = env.API_KEY
const API_SECRET = env.API_SECRET
const useTestnet = env.useTestnet

const client = new LinearClient({
    key: API_KEY,
    secret: API_SECRET,
    testnet: useTestnet
})

module.exports = client