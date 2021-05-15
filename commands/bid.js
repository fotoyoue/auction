const temembed = require('../configs/getembed.js');
const config = require('../config.json')
const update = require('../events/update.js')

module.exports.execute = async function(message, args, color, command, client, db) {
    if (!args[0]) return;
    if ((typeof(parseInt(args[0])) != "number")) return message.channel.send(temembed.wrongType(color.red));
    if (!message.channel.parentID) return;

    var categoryId = message.channel.parentID
    var AuctionData = db.get(`category_${categoryId}`)

    if (AuctionData) {
        var bidPrice = parseInt(args[0]) // bid price
        update.update(AuctionData, bidPrice, message, client, db)
    }
    
}

module.exports.configs = {
    name: ["bid"],
    description: 'บิด',
    args: "<ราคา> (จำนวนเต็ม)",
    admin: false
}