// controllers/apiController.js
function index(req, res) {
  res.json({
    message: 'Welcome to tunely!!!!!!!',
    documentation_url: 'https://github.com/sf-wdi-labs/tunely',
    base_url: 'localhost:3000',
    endpoints: [
      {
        method: 'GET', path: '/api', description: 'Describes available endpoints'
      }
    ]
  });
}






// controllers/apiController.js
module.exports = {
  index: index
}
