const saveData = require("../../saveData")

function sleep(req, res) {
    const value = req.body.status
    saveData('status', value)
    res.send('ok')
}

function status(req, res) {
    const status = process.env.status
    res.send(status)
}

function schedule(req, res) {
    const times = req.body
    setTimeout(() => {
        const data = { status: 'off' }
        axios.post('https://tradefrenzy.up.railway.app/sleep', data).then(({ data }) => {
            console.log(data);
        })
    }, times.start);

    setTimeout(() => {
        const data = { status: 'on' }
        axios.post('https://tradefrenzy.up.railway.app/sleep', data).then(({ data }) => {
            console.log(data);
        })
    }, times.stop);

    res.send(times)
}
module.exports = { sleep, status, schedule }