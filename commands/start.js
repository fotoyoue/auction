const moment = require('moment');
const ms = require('ms');
const temembed = require('../configs/getembed.js');

module.exports.execute = async function(message, args, color, command, client, db) {
    if (args.length < 4) return;

    var starttime = Date.now(); // เวลาที่เรื่มเปิดประมูล No Fomat
    var [tags, price, bid, autowin, endtime] = args 
    var timenowFormat = moment(starttime).locale('th').format("[วัน]dddd Do MMMM YYYY HH:mm:ss") // เวลาวัน ที่ เดือน ปี ชั่วโมง:นาที:วินาที
    var endtimeFormat = moment(starttime + ms(endtime)).locale('th').format("[วัน]dddd Do MMMM YYYY HH:mm:ss") // เวลาวัน ที่ เดือน ปี ชั่วโมง:นาที:วินาที

    var autcionCatagory = await message.guild.channels.create("ประมูล " + tags, { type: "category"})

    var auctionChannel = await message.guild.channels.create("ประมูล", { type: "text", permissionsOverwrites: [
        {
            id: message.guild.roles.everyone.id,
            deny: ['SEND_MESSAGES']
        }
    ]})
    var auctionBidChannel = await message.guild.channels.create("ลงประมูล", { type: "text" })
    var auctionChatChannel = await message.guild.channels.create("แชทพูดคุย", { type: "text" })
    var auctionLogChannel = await message.guild.channels.create("logs", { type: "text", permissionsOverwrites: [
        {
            id: message.guild.roles.everyone.id,
            deny: ['SEND_MESSAGES']
        }
    ]})

    await auctionChannel.setParent(autcionCatagory.id)
    await auctionBidChannel.setParent(autcionCatagory.id)
    await auctionChatChannel.setParent(autcionCatagory.id)
    await auctionLogChannel.setParent(autcionCatagory.id)
    //tags, price, bid, autowin, endtime

    var auctionEmbed = temembed.mainAuction(color.green, tags, null, price, bid, timenowFormat, endtimeFormat, null, price, autowin)
    var auctionLogEmbed = temembed.logAuction(color.green, null, "**เริ่มประมูล**")

    var aucitonEmbedMsg = await auctionChannel.send({embed: auctionEmbed})
    var aucitonLogEmbedMsg = await auctionLogChannel.send({embed: auctionLogEmbed})

    db.set(`category_${autcionCatagory.id}`, {
        finished: false,
        info: {
            title: tags,
            price: price,
            bid: bid,
            bidder: "no",
            autowin: autowin,
            starttime: starttime,
            endtime: starttime + ms(endtime),
        },
        mainChannel: auctionChannel.id,
        bidChannel: auctionBidChannel.id,
        chatChannel: auctionChatChannel.id,
        logChannel: auctionLogChannel.id,
        mainmsg: aucitonEmbedMsg.id,
        mainembed: auctionEmbed,
        logembed: auctionLogEmbed
    })

    // const filter = m => m.channel.id == auctionChannel.id
    // const collector = auctionChannel.createMessageCollector(filter, { time: ms(endtime)})
    // const bidprice = 0

    // price = parseInt(price) // make price (startprice) to number 
    // bid = parseInt(bid) // make bid to number
    // autowin = parseInt(autowin)

    // collector.on("collect", msg => {
    //     if (msg.author.bot) return;

    //     const args = msg.content.slice(settings.prefix.length).split(/ +/);
    //     const command = args.shift().toLowerCase();

    //     msg.delete({ timeout: 1000}) // delete message

    //     if (command == "bid" && args.length > 0) {
    //         if (typeof(parseInt(args[0])) == "number") {
    //             if (parseInt(args[0]) - price >= bid) {
    //                 if (parseInt(args[0]) < autowin) {
    //                     updateMainNSendLog(msg, args)
    //                 } else if (parseInt(args) >= autowin) {
    //                     updateMainNSendLog(msg, args)
    //                     collector.stop()
    //                 }
    //             } else {
    //                 // lower than now price
    //                 message.author.send({ embed:  lowerPrice})
    //             }
    //         } else {
    //             // wrong argruments
    //             message.author.send({ embed:  wrongType})
    //         }
    //     }
    // })

    // collector.on("end", size => {
    //     embedAuction.color = color.red
    //     embedAuction.title = "ปิด" + embedAuction.title

    //     aucitonEmbedMsg.edit({ embed: embedAuction })
    //     auctionLogChannel.send({ embed: embedLogAuction})
    // })
}

module.exports.configs = {
    name: ["start"],
    description: 'เริ่มการประมูล',
    args: "<item> <startprice> <bid> <autowin> <end>",
    admin: false
}