// controllers/index.js
module.exports = {
    api: require('./apiController'),
    albums: require('./albumsController')
}

//mongoose.connect( process.env.MONGODB_URI || "mongodb://localhost/tunelyDB")