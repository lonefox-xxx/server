const { default: axios } = require("axios");

function sendLog(req, res) {
    const data = req.body;
    const msg = `SIMBOL : ${data.symbol}\n\nTYPE : ${data.side}\n\n\QTY : ${data.qty}\n\nENTRY PRICE : ${data.price}\n\nTAKE PROFIT : ${data.take_profit}\n\n\STOP LOSE : ${data.stop_loss}\n\nID : ${data.order_id}\n\n`;
    (async () => {
        await axios.get(`https://api.telegram.org/bot5129025740:AAF_asgA7Kbvxq-o3lqopFp7OfywA8KW8uU/sendMessage?chat_id=-1001592447140&text=${encodeURIComponent(msg)}`);
        await axios.post("https://tradefrenzy-db.up.railway.app/putdata", data)
    })()
    res.send('ok')
}

module.exports = sendLog