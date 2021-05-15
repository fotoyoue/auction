const config = require("../config.json")

function mainAuction(color, title, thumbnail, price, bid, starttime, endtime, bidder, pricenow, autowin) {
    return {
        color: color,
        title: "ประมูล <:auciton:841131601781325824> " + title, // args[0] == แท็ก
        thumbnail: {url: thumbnail || "https://i.imgur.com/wSTFkRM.png"},
        fields: [
            { name: 'Start Price', value: price, inline: true }, // ราคาเริ่มต้น
            { name: 'Bid', value: bid, inline: true }, // ราคาบิดขั้นต่ำ
            { name: 'Start Time', value: starttime,}, // เวลาเปิดประมูล
            { name: 'End Time', value: endtime,}, // เวลาปิดประมูล
            { name: '\u200B', value: '\u200B' },
            { name: 'Bidder', value: bidder || "No"}, // ผู้บิดสูงสุดตอนนี้
            { name: 'Price Now', value: pricenow}, // ราคาล่าสุด
            { name: 'AutoWin', value: autowin} // ราคาชนะอัตโนมัติ
        ],
        footer: {text: `พิมพ์ ${config.prefix}bid <ราคาที่จะบิด> เพื่อประมูล`}
    }
}

function logAuction(color, bidder, description) {
    return {
        color: color,
        // title: ,
        description: "ผู้ประมูลล่าสุด ของสินค้า " + (bidder || "-"),
        timestamp: new Date(),
    }
}

function lowerPrice(color, description) {
    return {
        color: color,
        title: description || "**คุณบิดต่ำกว่าราคาล่าสุด!!!**"
    }
}

function wrongType(color, description) {
    return {
        color: color,
        title: description || `**วิธีบิด ${config.prefix}bid <ราคาที่ต้องการ> (จำนวนเต็ม) เช่น \`${config.prefix}bid 120\`**`
    }
}

module.exports = {
    mainAuction,
    logAuction,
    lowerPrice,
    wrongType
}