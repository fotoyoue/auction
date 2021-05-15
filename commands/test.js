module.exports.execute = async function(message, args, color, command, client, db) {
    message.channel.guild.channels.cache.get("842557726202658819").messages.fetch("842557737808560168").then(console.log)
}

module.exports.configs = {
    name: ["test"],
    description: 'tset',
    args: "test",
    admin: false
}