require('dotenv').config()
const fs = require('fs')

function saveData(key, value) {
    process.env[key] = value
    fs.writeFileSync(".env", Object.entries(process.env)
        .map(([key, value]) => `${key}=${value}`)
        .join("\n")
    );

}

module.exports = saveData