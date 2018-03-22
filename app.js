const bodyParser = require('body-parser');
const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const app = express();

// ----APP CONFIGURATION----

// View Engine/Templating
app.set('view engine', 'pug');
app.use(express.static('public'));
// Assign bodyParser
app.use(bodyParser.urlencoded({extended: true}));
// Assign methodOverride
app.use(methodOverride('_method'));
// Port settings
app.set('port', process.env.PORT || 3000);
// Mongoose
mongoose.connect('mongodb://localhost/restful_blog_app');

// ----MONGOOSE/MODEL CONFIG----
const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now},
});

const Blog = mongoose.model('Blog', blogSchema);

// ----RESTFUL ROUTES----
app.get('/', (req, res) => {
  res.redirect('/blogs');
});

// Index Route
app
  .route('/blogs')
  .get((req, res) => {
    Blog.find({}, (err, blogs) => {
      if (err) {
        console.log(err);
      } else {
        res.render('index', {blogs: blogs});
      }
    });
  })
  .post((req, res) => {
    // create blog object
    Blog.create(req.body.blog, (err, newBlog) => {
      if (err) {
        res.render('new');
      } else {
        res.redirect('/blogs');
      }
    });
  });

// New Post Route
app.get('/blogs/new', (req, res) => {
  res.render('new');
});

// Show Route
app
  .route('/blogs/:id')
  .get((req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
      if (err) {
        res.redirect('/blogs');
      } else {
        res.render('show', {blog: foundBlog});
      }
    });
  })
  .put((req, res) => {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
      if (err) {
        res.redirect('/blogs');
      } else {
        res.redirect('/blogs/' + req.params.id);
      }
    });
  })
  .delete((req, res) => {
    // destroy blog
    Blog.findByIdAndRemove(req.params.id, (err) => {
      if (err) {
        res.redirect('/blogs');
      } else {
        res.redirect('/blogs');
      }
    });
  });

// Edit Route
app.get('/blogs/:id/edit', (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.render('edit', {blog: foundBlog});
    }
  });
});

// Server port listen
app.listen(app.get('port'), () => {
  console.log('Server is running');
});
