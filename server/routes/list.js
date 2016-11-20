var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/todoapp';

//POST the tasks to database
router.post('/', function(req, res) {
  var newTask = req.body;
  //console.log(newTask);
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }

    client.query(
      'INSERT INTO tasklist(todo) VALUES($1)',
      [newTask.task],
      function(err, result) {
        done();

        if(err) {
          console.log('insert query error: ', err);
          res.sendStatus(500);
        } else {
          res.sendStatus(201);
        }
      });

  });

});


//GET the tasks
router.get('/', function(req, res) {
  console.log('get request');
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }

    client.query('SELECT * FROM tasklist ORDER BY id DESC', function(err, result) {
      done();

      if(err) {
        console.log('select query error: ', err);
        res.sendStatus(500);
      }
      //console.log("results.rows", result.rows);
      res.send(result.rows);

    });

  });
});

//DELETE the tasks
router.delete('/:id', function(req, res) {
  console.log("the delete worked");
  taskID = req.params.id;

  console.log('task id to delete: ', taskID);
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }

    client.query(
      'DELETE FROM tasklist WHERE id = $1',
      [taskID],
      function(err, result) {
        done();

        if(err) {
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      });
    });

});

router.put('/:id', function(req, res) {
  taskID = req.params.id;

  console.log("task id: ", taskID);

  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }

    client.query(
      'UPDATE tasklist SET completed=NOT completed WHERE id=$1',
      // array of values to use in the query above
      [taskID],
      function(err, result) {
        if(err) {
          console.log('update error: ', err);
          res.sendStatus(500);
        } else {
          console.log("[taskID]", taskID);
          res.sendStatus(200);
        }
      });
    }); // close connect

});


module.exports = router;
