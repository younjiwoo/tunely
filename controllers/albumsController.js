// controllers/albumsController.js
// GET /api/albums
function mustard(req, res) {
  res.send("im ketchup and I want to eat now!!!");// send back all albums as JSON
}

// POST /api/albums
function create(req, res) {
  // create an album based on request body and send it back as JSON
}

// GET /api/albums/:albumId
function show(req, res) {
  // find one album by id and send it back as JSON
}

// DELETE /api/albums/:albumId
function destroy(req, res) {
  // find one album by id, delete it, and send it back as JSON
}

// PUT or PATCH /api/albums/:albumId
function update(req, res) {
  // find one album by id, update it based on request body,
  // and send it back as JSON
}


// controllers/albumsController.js
module.exports = {
  ketchup: mustard,
  create: create,
  show: show,
  destroy: destroy,
  update: update
};