const fs = require('fs')

const dataFilePath = path.join(__dirname,"data.json")
const data = fs.readFileSync(dataFilePath);
const userData = JSON.parse(data);



