const fs = require("fs");
const answers = require("./answers.json");

if (process.env.TRANSPORTER) {
    answers.transporter = process.env.TRANSPORTER == "None" ? null : process.env.TRANSPORTER
}

fs.writeFileSync(process.env.TRANSPORTER == "None" ? "./answers.simple.json" : "./answers.full.json", JSON.stringify(answers, null, 4), "utf8");

console.log("Done", answers);