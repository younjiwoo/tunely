# <img src="https://cloud.githubusercontent.com/assets/7833470/10899314/63829980-8188-11e5-8cdd-4ded5bcb6e36.png" height="60">    Tune.ly lab

Full CRUD app with MongoDB, Mongoose, and Express.


## Prerequisites:

* html `data-` attributes
* jQuery, AJAX
  * `$('asdf').on('click', '.add-song', handleAdd)`
  * `$.get` or `$.ajax`
  * `$.post` or `$.ajax`
  * `$(document).ready(function(){}); `
  * Advanced CSS selectors could be helpful.  Example: `$('[data-album-id=a7397f6f2e]')`
* Express server, static assets
* RESTful route design
* serving JSON with `/api` routes
* Bootstrap grid system, forms, buttons
* CRUD with mongoose for MongoDB
  * `find`, `findOne`, `new`, `save`, `remove`
  * mongoose embedded data associations
  * mongoose referenced data associations
* Controllers using Node's module pattern (see [docs/controllers_example.md](docs/controllers_example.md) for an introduction)

## Other tools
* Front-end package manager `bower` is used, but developers need not interact with it
  * components are automatically installed via an npm postinstall script
* Bootstrap "modals"



## Overview

This lab begins with a basic front-end to display a list of music albums.  As we progress through, we'll:

* serve the album data from our server's `/api/` routes  
* get the data from the server using ajax and display it on the page with jQuery  
* retrieve the data from the database  
* add functionality to create a new album  
* add functionality to remove/delete an album  
* add the ability to edit/update an album  
* support storing song information (mongoose embedded)  
* add another major resource with for artist information  (mongoose reference)  


### Project Planning

When working on large projects, it's important to do a good amount of planning and whiteboarding before you start coding.  

- Diligent planning will save you from costly mistakes and help you to refine the user experience before you've spent hours on the project.   
- The planning techniques and habits you develop here will be essential throughout your career as a web developer.    
- Every successful company invests time in planning and design, and you should too!

We're going to use **"outside-in development"** practices.  This means that we'll start by designing our UI (the outside).
Then we'll move "inside" by connecting our UI to a server serving hard-coded data.  Next, we'll retrieve that data from a database.

We will also be breaking our work into short **sprints** with specific design goals.  This is another very common practice in the web development industry. In each sprint, we'll try to work outside-in.   

Let's start with a basic wireframe.  

![simple layout of tunely homepage](docs/assets/images/tunely_wireframe-1.png)

Typically when you work on a project, you'll start with a basic idea and do your initial development on paper or whiteboard.  You can develop simple prototypes and "virtually" test your app with wireframes.  If good old fashioned paper or whiteboards aren't your thing, a number of software packages can will help you build wireframes. But remember: a wireframe should include simple diagrams of your site's layout and flow, not full mockups.

In the wireframe above, you can see we're building a site that displays a list of musical albums.  It also has a jumbotron to introduce users to the page.  This is only our starting point; you'll be responsible for evolving it as we work through the lab.


## Getting Started

1. Fork and clone this repository, and `cd` into your local copy.
1. Run `npm install`, which will:
  * install back-end packages from package.json AND
  * install front-end libraries from bower.json as a "postinstall" action
1. Start the server with `node server.js`, `npm start`, or `nodemon`.
1. View the site at `localhost:3000`.
1. Read the rest of this readme, then continue to Sprint 1.




## Sprints

### Module A: Create and Read with Mongo and embedded model relationships.

#### Sprint 1

[Sprint 1: serve & display hard-coded data on the page, then connect to a database](/docs/sprint1.md)

#### Sprint 2

[Sprint 2: add a form and support creation of new data](/docs/sprint2.md)

#### Sprint 3

[Sprint 3: add mongo embedded song data](/docs/sprint3.md)


### Module B: Update and Delete with Mongo and embedded model relationships.

#### Sprint 4

[Sprint 4: delete albums](/docs/sprint4.md)

#### Sprint 5

[Sprint 5: edit and update album info](/docs/sprint5.md)

#### Sprint 6

[Sprint 6: update song info & delete songs](/docs/sprint6.md)

<!--
### Module C: Full CRUD with Mongo and reference relationships. -->

## Using Tune.ly Solutions

There is a solution branch in this repository for each sprint. For the most part, we expect you'll reference these solutions online as needed.   Follow the instructions below if you ever need to start working from the solutions of a previous sprint:

1. First, `git add` and `commit` any current changes.

1. Check out the desired solutions branch to start from:

  > `git checkout solutions_sprint_3`

1. Create a new branch from the solution branch for your work:

  > `git checkout -b my_sprint4`
