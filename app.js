const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

app = express();

// ----APP CONFIGURATION----

// View Engine/Templating
app.set('view engine', 'pug');
app.use(express.static('public'));
// Assing bodyParser
app.use(bodyParser.urlencoded({extended: true}));
// Port settings
app.set('port', process.env.PORT || 3000);
// Mongoose
mongoose.connect('mongodb://localhost/restful_blog_app');

// ----MONGOOSE/MODEL CONFIG----
let blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now},
});

let Blog = mongoose.model('Blog', blogSchema);

// ----RESTFUL ROUTES----

// Server port listen
app.listen(app.get('port'), () => {
  console.log('Server is running');
});
