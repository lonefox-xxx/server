const { client } = require('../fundementals/tradeFundementals');

function positions(req, res) {
    const parms = req.body
    client.getPosition(parms).then((data) => {
        const array = data.result
        const sarray = [];
        (async () => {
            await array.forEach((item) => {
                item.data.size != 0 ? sarray.push(item) : null
            })
        })()
        console.log(sarray);
        res.send(sarray)
    })
}

module.exports = positions