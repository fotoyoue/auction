function setStartTime(db, category,to) {
    return db.set(`category_${category}.info.starttime`, to)
}

function getStartTime(db, category,to) {
    return db.get(`category_${category}.info.starttime`)
}

module.exports = {
    setStartTime,
    getStartTime
}