# Tune.ly Sprint 0

## Overview

This sprint we will:
* set up an express server from scratch
* serve the _partially_ pre-built front-end from the express server
* set up a modular file structure for models and controllers



## Step 0:

Now would be a great time to explore the files provided for you.  In particular, note:
* the html in `views/index.html`
* the JavaScript, CSS, and image files in the `public` directory

### Workflow Tips


- Start your work on a new branch (`git checkout -b my-sprint-0`).  Add and commit your change frequently -- **at least once per step**!

- Continually verify that your browser console is displaying the `app.js loaded!` message on document-ready.

- Use `nodemon` or `node server.js` to run your server.

- Once you have your server set up and running, check for error messages in both the terminal where your server is running and in the browser console.


- **If you're stuck, take a look at the solutions branch for sprint 0.**


## Step 1: Server basic setup.

A front-end skeleton is already in place (you can view it by opening `index.html` in your browser).  To get started serving that front-end, we need a server.

1. Run `npm init` to create a `package.json` file. Specify at least the following fields:

  ```
  name: tunely
  description: An app for tracking a music collection
  entry point / main: server.js
  ```

  > Confirm that this information is set in your `package.json`.

1. Install and save `express`, `body-parser`, and `mongoose` Node.js packages.  

  <details><summary>click for code to run in terminal</summary>
  ```bash
  npm install --save express body-parser mongoose
  ```
  </details>

  > Confirm that the packages have been saved as dependencies in your `package.json`.

1. Create a `server.js` file.  In this file:
  - `require` Express
  - create an Express app
  - add a route so your server will respond to `GET /` with a simple message
  - tell the app to `listen` on a port so that the server will start

  > It's okay if you need to reference code for this steps! Check the sprint 0 solutions branch or see recent notes and projects.

1. Start your server, and make sure you see your message when you visit the `/` route.


## Step 2: Serving the HTML views from Express.

1. We're going to serve `index.html` on the root route, `/`, so change the current GET `/` route from serving your message to sending the `index.html` file.

  <details><summary>hint: click for code</summary>
  ```
  // inside the GET / route
  res.sendFile('views/index.html' , { root : __dirname});
  ```

  Curious about what this does? Try logging `__dirname` to your console.

  > If you restart your server now and visit 'localhost:3000' in the browser, you'll notice the site now shows the contents of the html file. From now on, **do not visit your site by opening `index.html` in the browser.** Visit it by making a request to the correct URL.

  > Your page should show missing JavaScript and CSS.  We will fix that by serving the contents of the `public` directory from the server as well.

## Step 3: Serve static files from Express.

1. Set up the express app to serve the `public` directory as a static file directory.

  ```js
    // server.js
    app.use(express.static('public'));
  ```

  > This serves the files and directories inside `public` "next to" `index.html`, so `index.html` will be able to access everything inside `public` as if `index.html` were in the `public` directory, too.

1. Reconnect the client-side JavaScript to your view by updating the `script` tag in `index.html`.  Get a sanity check log message from your `app.js` to appear in your browser dev tools console.

1. Reconnect the client-side CSS to your view by updating the `link` tag in `index.html`. Get the css styles in `styles.css` working again on the index page.

1. Reconnect the client-side images to your view by updating `index.html` and `styles.css`. You should see the images again once this is working.

1. If you still have errors when you visit  `localhost:3000`, try to diagnose them, check the solutions, or ask for help.


## Step 4: Setting up database file structure.

Time to prepare a file structure for pulling data from an API!

1. Create a  `models` directory, a `models/index.js` file, and a `models/album.js` file.

1. In `models/index.js`, require mongoose and connect to a database for the tunely app.

  <details><summary>click to see a code reminder</summary>
  ```js
  // models/index.js
  var mongoose = require("mongoose");
  mongoose.connect("mongodb://localhost/tunely");
  ```
  </details>

1. In `models/album.js`, require mongoose and, if you'd like, set up a shorthand `Schema` variable to stand in for `mongoose.Schema`.

1. Require the `models` directory in `server.js`.  We've usually been importing the models directory as a variable called `db`.  


## Step 5: Setting up a "controller" pattern to organize routes.

We're eventually going to add the API routes on the server, like:

```
GET /api/albums
```

To better organize this app, we're going to be using "controllers" to separate out logic for different _resources_ (different kinds of data we store).  That means that when you create a route like `/api/albums/:id`, you'll put the server code to handle that in a separate file, grouped with all the other handlers for routes dealing with the albums resource.  

You've already been using Node.js's modules to bring code for database models into the server (though that's not set up for this app, yet).  We'll also use the module pattern to make "controller" functions available in the server.  See also: [big explanation about controllers and the module pattern!](controllers_example.md).  

1. Create:
  - a `controllers` directory,
  - a `controllers/index.js` file,
  - a `controllers/apiController.js` file, and
  - a `controllers/albumsController.js` file.


1. Inside `controllers/apiController.js`, add the following code:

  ```js
  // controllers/apiController.js
  function index(req, res) {
    res.json({
      message: 'Welcome to tunely!',
      documentation_url: 'https://github.com/sf-wdi-labs/tunely',
      base_url: 'localhost:3000',
      endpoints: [
        {
          method: 'GET', path: '/api', description: 'Describes available endpoints'
        }
      ]
    });
  }
  ```

  > Look over the structure of this code. Given your experience with Express servers, how do you think this code will be used?

1. We need to get access to that code in the server file.  After creating your `index` function in `controllers/apiController.js`, export it as part of the module's exports:
  ```js
  // controllers/apiController.js
  module.exports = {
    index: index;
  }
  ```

1. Like with models, our controllers module has an `index.js` to collect the various controllers.  Inside `controllers/index.js`, require the code from `controllers/apiController.js` and then export it as part of an object:

  ```js
  // controllers/index.js
  module.exports = {
    api: require('./apiController')
  }
  ```


1. In `server.js`, add a line that `require`s the `controllers` directory.  Save the result in a variable called `controllers`.

  ```js
  //server.js
  var controllers = require('./controllers');
  ```

1. Also in `server.js`, create a new route for `GET /api`.  Based on the controller pattern we've built, this route's callback can be `controllers.api.index`.

  ```js
  // server.js
  app.get('/api', controllers.api.index);
  ```

  > Trace back through the series of requires and exports until you have this working and you understand why.

## Step 6: A controller skeleton for albums.

1. In `controllers/albumsController.js`, add a skeleton where you'll create and export the request handler callbacks for each albums API route. That is, add the following code:

  <details><summary>click to expand</summary>
  ```js
  // controllers/albumsController.js
  // GET /api/albums
  function index(req, res) {
    // send back all albums as JSON
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
  ```
  </details>

1. Also, after the function definitions, add each function to the `exports` object for this module:

  ```js
  // controllers/albumsController.js
  module.exports = {
    index: index,
    create: create,
    show: show,
    destroy: destroy,
    update: update
  };
  ```

1. Using `controllers/apiController.js` as an example, require the exported information from `controllers/albumsController.js` in `controllers/index.js`.

1. Also, add that information to the exports for `controllers/index.js` by creating a new `albums` key in the exports object that already has the `api` key.

## Continuity Step: Baby steps toward database.

1. We don't have the database set up yet, but we can start thinking about some data. Purely for continuity with later sprints, add the following starter album information at the top of  `controllers/albumsController.js`:

  <details><summary>click to expand</summary>
  ```js
  // controllers/albumsController.js
  var albums = [];
  albums.push({
                _id: 132,
                artistName: 'Nine Inch Nails',
                name: 'The Downward Spiral',
                releaseDate: '1994, March 8',
                genres: [ 'industrial', 'industrial metal' ]
              });
  albums.push({
                _id: 133,
                artistName: 'Metallica',
                name: 'Metallica',
                releaseDate: '1991, August 12',
                genres: [ 'heavy metal' ]
              });
  albums.push({
                _id: 134,
                artistName: 'The Prodigy',
                name: 'Music for the Jilted Generation',
                releaseDate: '1994, July 4',
                genres: [ 'electronica', 'breakbeat hardcore', 'rave', 'jungle' ]
              });
  albums.push({
                _id: 135,
                artistName: 'Johnny Cash',
                name: 'Unchained',
                releaseDate: '1996, November 5',
                genres: [ 'country', 'rock' ]
              });
  ```
  </details>

1. Also for continuity with later sprints, create a `seed.js` file in the base directory of your project. Add the following code to it:

  <details><summary>click to expand</summary>
  ```js
  //seed.js

  var db = require("./models");

  var albumsList =[
    // data here soon!
  ];

  db.Album.remove({}, function(err, albums){
    // code in here runs after all albums are removed
    db.Album.create(albumsList, function(err, albums){
      // code in here runs after all albums are created
      if (err) { return console.log('ERROR', err); }
      console.log("all albums:", albums);
      console.log("created", albums.length, "albums");
      process.exit();
    });
  });
  ```
  </details>


## Sprint 0 Conclusion

At this point, you have HTML, JavaScript, CSS and image files served from the Express server. You have a very modular back-end file structure set up. This will help build out an organized API in a step-by-step way over the coming sprints. You also have some extra code that you'll need to ensure continuity with future sprints.
