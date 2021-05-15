
module.exports.execute = async function(message, args, color, command, client, db) {
    const category = await message.guild.channels.cache.get(args[0])
    category.children.forEach(channel => channel.delete())
    category.delete()
}


module.exports.configs = {
    name: ["dlct"],
    description: 'ลบช่อง',
    args: "<id>",
    admin: true
}