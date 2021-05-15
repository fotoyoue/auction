const ms = require('ms');

function loop(category, data, client, db) {
    if (data.finished == false) {
        let timenow = Date.now()
        let endtime = data.info.endtime
    
        if ((timenow/1000) >= endtime/1000) {
            db.set(`category_${category}.finished`, true)
    
            require("./update.js").update(
                data, 
                data.info.price, 
                client.channels.cache.get(data.mainChannel).messages.fetch(data.mainmsg),
                client,
                db,
                category
            )
        }
    
        setInterval(() => {
            loop(category, data, client, db)
        }, 5000)
    }
}

module.exports.execute = async function(client, db) {
    client.channels.cache.filter(c => c.type === 'category').forEach(element => {
        let data = db.get(`category_${element.id}`)
        if (data.info) {
            loop(element.id, data, client, db)
        }
    });
}