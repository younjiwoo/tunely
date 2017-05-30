let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let AlbumSchema = new Schema({
    artistName: String,
         name: String,
         releaseDate: String,
         genres: [ String ]
});

let Album = mongoose.model('Album', AlbumSchema);


 module.exports = Album;
