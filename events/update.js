const color = require('../color.json')

function changeEmbedAuction(AuctionData, embedAuction, bidder, price, finished) {
    AuctionData.info.price = price
    AuctionData.info.bidder = bidder
    if (finished) {
        AuctionData.finished = true
        embedAuction.color = color.red
        embedAuction.title = "ปิด" + embedAuction.title
    }
    embedAuction.fields[5].value = `<@${bidder}>`
    embedAuction.fields[6].value = price

    AuctionData.mainembed = embedAuction
}

function changeEmbedLogAuction(AuctionData, embedLogAuction, bidder, price) {
    embedLogAuction.description = `ผู้ประมูลล่าสุด <@${bidder}> | ราคาล่าสุด ${price} บาท`

    AuctionData.logembed = embedLogAuction
}

function sendEmbed(client, AuctionData, embed, channel, msg, price, finished) {
    msg = msg.author ? msg.author.id : msg

    changeEmbedAuction(AuctionData, embed[0], msg, price, finished) // update offer and price
    client.channels.cache.get(channel[0][0]).messages.fetch(channel[0][1]).then(msg => {
        msg.edit({embed: embed[0]})
    })

    // log
    changeEmbedLogAuction(AuctionData, embed[1], msg, price) // update log offer and price
    client.channels.cache.get(channel[1][0]).send({embed: embed[1]}) // log edit embed

    //save
}

function update(AuctionData, bidPrice, message, client, db, category) {
    var auctionInfo = AuctionData.info // info
    var mainmsg = AuctionData.mainmsg

    var mainChannel = AuctionData.mainChannel
    var bidChannel = AuctionData.bidChannel
    var chatChannel = AuctionData.chatChannel
    var logChannel = AuctionData.logChannel

    var auctionEmbed = AuctionData.mainembed //auction embed template
    var auctionLogEmbed = AuctionData.logembed //log embed template

    message = message.channel ? message : client.channels.cache.get(logChannel)
    var categoryId = message.channel ? message.channel.parentID : category

    if (AuctionData.finished == false) {
        if ((bidPrice - parseInt(auctionInfo.price)) >= parseInt(auctionInfo.bid)) {
            if (bidPrice < parseInt(auctionInfo.autowin)) {
                sendEmbed(client, AuctionData, [auctionEmbed, auctionLogEmbed], [[mainChannel, mainmsg], [logChannel]], message, bidPrice)
            } else if (bidPrice >= parseInt(auctionInfo.autowin)) {
                db.set(`category_${categoryId}.finished`, true)
                sendEmbed(client, AuctionData, [auctionEmbed, auctionLogEmbed], [[mainChannel, mainmsg], [logChannel]], message, bidPrice, true)
                message.guild.channels.cache.get(mainChannel).send(`<@${AuctionData.info.bidder}>`)

                message.guild.channels.cache.get(bidChannel).updateOverwrite(message.guild.roles.everyone, { SEND_MESSAGES: false });
                message.guild.channels.cache.get(chatChannel).updateOverwrite(message.guild.roles.everyone, { SEND_MESSAGES: false });
            }
        } else {
            message.channel.send(temembed.lowerPrice(color.red));
        }
    } else if (AuctionData.finished == true) {
        if (auctionEmbed.color != color.red) {
            db.set(`category_${categoryId}.finished`, true)
            sendEmbed(client, AuctionData, [auctionEmbed, auctionLogEmbed], [[mainChannel, mainmsg], [logChannel]], AuctionData.info.bidder, AuctionData.info.price, true)
            message.guild.channels.cache.get(mainChannel).send(`<@${AuctionData.info.bidder}>`)

            message.guild.channels.cache.get(bidChannel).updateOverwrite(message.guild.roles.everyone, { SEND_MESSAGES: false });
            message.guild.channels.cache.get(chatChannel).updateOverwrite(message.guild.roles.everyone, { SEND_MESSAGES: false });
        }
    }

    
    //save
    db.set(`category_${categoryId}`, AuctionData)
}

module.exports = {
    update
}