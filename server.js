var express = require('express')
var bodyParser = require('body-parser')
var multer = require('multer')
var upload = multer()
var app = express()
var port = process.env.PORT || 8080
//var http = require('http');
//var url = require('url') ;
const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('./database/database.db');

var pages = {}

createPage({
  title: 'index'
})

function createPage (page) {
  let id = Object.keys(pages).length
  pages[id] = page
}

app.set('view engine', 'ejs')
app.use(express.static('public'))
// for parsing application/json
app.use(bodyParser.json())
// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded
// for parsing multipart/form-data
app.use(upload.array())


var users = [];
var products = [];
app.get('/', function (request, response) {
  db.serialize(function () {
    db.each("SELECT * FROM users", (err, rows) => {
      users.push({ name: rows.name })
    }),
    db.each("SELECT * FROM products", (err, rows) => {
      products.push({ product: rows.product, price: rows.price })
    },
    function () {
      response.render('pages/index', {
        pages: pages,
        users: users,
        products: products
      })
    })
  })
})

app.post('/getUsers', function (request, response) {
  // console.log ( request.body.name )
  // db.get('SELECT * FROM users WHERE name = $name', { // right way
  //     $name: request.body.name
  // },
  // ( err, row ) => {
  //   response.render('pages/index', {
  //     pages: pages,
  //     user: row
  //   })
  // })
  db.get("SELECT * FROM users WHERE name = '" + request.body.name + "'", // wrong way
    (error, row) => {
      // console.log ( row )
      response.render('pages/index', {
        pages: pages,
        user: row
      })
    }
  )
})

app.listen(port)
