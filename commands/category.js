module.exports.execute = async function(message, args, color, command) {
    console.log(message.channel)
}

module.exports.configs = {
    name: ["ct"],
    description: 'บิด',
    args: "<ราคา> (จำนวนเต็ม)",
    admin: false
}