const discord = require("discord.js");
const fs = require("fs");
const db = require('quick.db');

const client = new discord.Client({ ws: { intents: new discord.Intents(discord.Intents.ALL) }});

const config = require("./config.json")
const color = require("./color")

const prefix = config.prefix

client.commands = new discord.Collection();

function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}

for (const file of getFiles('./commands/')) {
    const command = require(file)
    if (Array.isArray(command.configs.name)) {
        for (let i = 0; i < command.configs.name.length; i++) {
            client.commands.set(command.configs.name[i], command)
        }
    } else {
        client.commands.set(command.configs.name, command)
    }
}

client.on('ready', () => {
    console.log(config.name + " is Online Now!")
    require("./events/count.js").execute(client, db)
})

client.on('message', async (message) => {
    if (!message.content.startsWith(prefix)) return;
    
    var embedAuction = {
        color: color.green,
        title: "ประมูล <:auciton:841131601781325824> " + "-", // args[0] == แท็ก
        thumbnail: {url: "https://i.imgur.com/wSTFkRM.png"},
        fields: [
            { name: 'Start Price', value: "-", inline: true }, // ราคาเริ่มต้น
            { name: 'Bid', value: "-", inline: true }, // ราคาบิดขั้นต่ำ
            { name: 'Start Time', value: "-",}, // เวลาเปิดประมูล
            { name: 'End Time', value: "-",}, // เวลาปิดประมูล
            { name: '\u200B', value: '\u200B' },
            { name: 'Bidder', value: "No"}, // ผู้บิดสูงสุดตอนนี้
            { name: 'Price Now', value: "-"}, // ราคาล่าสุด
            { name: 'AutoWin', value: "-"} // ราคาชนะอัตโนมัติ
        ],
        footer: {text: `พิมพ์ ${config.prefix}bid <ราคาที่จะบิด> เพื่อประมูล`}
    }

    var embedLogAuction = {
        color: color.green,
        title: "ผู้ประมูลล่าสุด ของสินค้า " + "-",
        description: "**เปิดประมูล!**",
        timestamp: new Date(),
    }

    var lowerPrice = {
        color: color.red,
        title: "**คุณบิดต่ำกว่าราคาล่าสุด!!!**"
    }

    var wrongType = {
        color: color.red,
        title: `**วิธีบิด ${config.prefix}bid <ราคาที่ต้องการ> (จำนวนเต็ม) เช่น \`${config.prefix}bid 120\`**`
    }

    db.set("embed", {
        main: embedAuction,
        log: embedLogAuction,
        lowerPrice: lowerPrice,
        wrongType: wrongType
    })

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    try {
        client.commands.get(command).execute(message, args, color, command, client, db);
    } catch {}
})

client.login(config.token)