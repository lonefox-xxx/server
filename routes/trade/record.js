const fs = require('fs');

const add_recode = (arg) => {
    const index = arg.index
    const price = arg.price
    const qty = arg.qty
    const time = arg.time
    fs.readFile('./detials.json', (err, data) => {
        if (err) console.log(err);
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
        const filedata = fs.readFileSync('./detials.json');
        const obj = JSON.parse(filedata);
        obj.open_order_detials = fdata
        const json = JSON.stringify(obj);
        fs.writeFileSync('./detials.json', json);
    })
}

const delete_record = (index) => {
    fs.readFile('./detials.json', (err, data) => {
        if (err) return
        const jsonData = JSON.parse(data);
        const exesdata = jsonData.open_order_detials
        const newdata = { [`${index}`]: undefined }
        const fdata = Object.assign({}, exesdata, newdata);
        const filedata = fs.readFileSync('./detials.json');
        const obj = JSON.parse(filedata);
        obj.open_order_detials = fdata
        const json = JSON.stringify(obj);
        fs.writeFileSync('./detials.json', json);
    })
}

module.exports = {
    add_recode, delete_record
}