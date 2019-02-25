var express = require('express')
var bodyParser = require('body-parser')
var multer = require('multer')
var upload = multer()
var app = express()
//var http = require('http');
//var url = require('url') ;
var port = process.env.PORT || 8080
const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('./database/database.db');

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/xwww-form-urlencoded
app.use(upload.array()) // for parsing multipart/form-data

// Create Pages
var pages = {}

createPage({
  title: 'index'
})
function createPage (page) {
  let id = Object.keys(pages).length
  pages[id] = page
}

// Functions
var functions = require('./functions.js')


// Routes
app.get('/', function (request, response) {
  // functions.index()

  let users =[]
  let products = []

  db.serialize(function () {
    db.each("SELECT * FROM users", (err, rows) => {
      users.push({ name: rows.name })
      // users = functions.pushToArray(rows.name)
      console.log ( users )
    }),
    db.each("SELECT * FROM products", (err, rows) => {
      products.push({ product: rows.product, price: rows.price })
      //var products = functions.pushToArray(rows.price)
    },
    function () {
      console.log ( users )
      response.render('pages/index', {
        pages: pages,
        users: users,
        products: products
      })
    })
  })
})
app.post('/getUsersSafe', function (request, response) {
  db.get('SELECT * FROM users WHERE name = $name', { // right way
      $name: request.body.name
  }, ( err, row ) => {
    if ( typeof(row) === 'undefined')
      row = 'No User Found!'

    response.render('pages/index', {
      pages: pages,
      user: row
    })
  })
})
app.post('/getUsersVuln', function (request, response) {
  db.get("SELECT * FROM users WHERE name = '" + request.body.name + "'", (err, row) => { // wrong way
    if ( typeof(row) === 'undefined')
      row = 'No User Found!'

    response.render('pages/index', {
      pages: pages,
      user: row
    })
  })
})

app.listen(port)
