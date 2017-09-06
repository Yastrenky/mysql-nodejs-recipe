const express = require('express');
const app = express();
const mysql = require('mysql');
const connnection = mysql.createConnection(require('./dbconfig.json'));
connnection.connect();
const cors = require('cors');// to alow anny domain to connect
//this is code to accept request body
const bodyParse = require('body-parser')
app.use(cors());
app.use(bodyParse.json()); //all request bodies in JSON are build into req.body only if content type is aplication/json

app.use(bodyParse.urlencoded({extended:true}));
//GET POST(CREATE) PUT(EDIT) DELETE
app.get('/', function(req, res) {
  console.log("hello " + new Date);
  res.end("jet.com .....somsing somsing")
});
app.get('/randomfight/:player1/:player2', function(req, res) {
  var p1 = req.params.player1;
  var p2 = req.params.player2;

  console.log("Resive request to fight players", p1, p2);
  if (Math.random() > 0.5) res.end(p1 + " wins");
  else res.end(p2 + " wins!");

});
app.get('/classics', function(req, res) {
  connnection.query('SELECT * FROM classics', function(err, books) {
    if (err) res.send(500);
    res.json(books);
  });
});


app.get('/author', function(req, res) {
  connnection.query('SELECT * FROM author', function(err, books) {
    if (err) res.send(500);
    res.json(books);
  });
});


app.post('/classics', function(req, res) {
  console.log(req.body);
  let query = 'INSERT INTO classics(author_id, title, type, year)' + `VALUES(${req.body.author_id},'${req.body.title}','${req.body.type}','${req.body.year}')`;
  console.log(query);
  connnection.query(query, function(err, result) {
    if (err) {
      console.log(err);
      return res.send(500);
    }
    res.end('Success')
  });
});

app.post('/author', function(req, res) {
  console.log(req.body);
  let query = 'INSERT INTO author(first_name,last_name,nationality,id)' + `VALUES('${req.body.first_name}','${req.body.last_name}','${req.body.nationality}','${req.body.id}')`;
  console.log(query);
  connnection.query(query, function(err, result) {
    if (err) {
      console.log(err);
      return res.send(500);
    }
    res.end('Success')
  });
});

app.put('/classics/:id', function(req, res) {
  let id = req.params.id;
  let rb = req.body;
  let query = 'UPDATE classics set ';
  if (rb.author_id) query += `author_id=${rb.author_id},`;
  if (rb.title) query += `title='${rb.title}',`;
  if (rb.year) query += `year='${rb.year}',`;
  if (rb.type) query += `type='${rb.type}',`;
  query = query.substr(0, query.length - 1);
  query += ` WHERE id=${id}`;
  connnection.query(query, function(err, result) {
    if (err) {
      console.log(err);
      return res.send(500);
    }
    res.end('Success id:' + id)
  });
});

app.put('/author/:id', function(req, res) {
  let id = req.params.id;
  let rb = req.body;
  let query = 'UPDATE author set ';
  if (rb.first_name) query += `first_name='${rb.first_name}',`;
  if (rb.last_name) query += `last_name='${rb.last_name}',`;
  if (rb.nationality) query += `nationality='${rb.nationality}',`;
  if (rb.id) query += `id=${rb.id},`;
  query = query.substr(0, query.length - 1);
  query += ` WHERE id=${id}`;
  connnection.query(query, function(err, result) {
    if (err) {
      console.log(err);
      return res.send(500);
    }
    res.end('Success id:' + id)
  });
});


app.delete('/classics/:id', function(req, res) {
  let query = `DELETE from classics WHERE id=${req.params.id}`;
  connnection.query(query, function(err, result) {
    if (err) {
      console.log(err);
      return res.send(500);
    }
    res.end('Success delete id:' + req.params.id)
  });
})
app.delete('/author/:id', function(req, res) {
  let query = `DELETE from author WHERE id=${req.params.id}`;
  connnection.query(query, function(err, result) {
    if (err) {
      console.log(err);
      return res.send(500);
    }
    res.end('Success delete id:' + req.params.id)
  });
})



app.listen(1337);
console.log("server listening on port 1337");
