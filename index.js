var http = require("http");
const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: true
  }));
var mysqlConnection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'passwd12',
    database:'sopdb',
    multipleStatements: true
});

mysqlConnection.connect((err)=>{
    if(!err)
    console.log('Sikerült a csatlakozás.')
    else
    console.log('Nem sikerült a csatlakozás \n HIBA : ' + JSON.stringify(err, undefined, 2));
});

app.listen(3000,()=>console.log('Express server fut a következő porton: 3000'));

// Minden személy lekérése | GET
app.get('/christmas', (req, res) => {
    mysqlConnection.query('SELECT * FROM christmas', (err, rows, fields) => {
        if (!err)
        res.send(rows);
        else
        console.log(err);
    })
});

// Személy lekérése meghatározott ID alapján | GETID
app.get('/christmas/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM christmas WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

// Személy törlése | DELETE
app.delete('/christmas/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM christmas WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Sikeres törlés.');
        else
            console.log(err);
    })
});

// Személy hozzáadása | POST (INSERT)
app.post('/christmas', (req, res) => {
    let chr = req.body;
    var sql = "SET @id = ?; SET @name = ?; SET @age = ?; SET @address = ?; SET @gift = ?;\
    CALL christmasAddOrEdit(@id,@name,@age,@address,@gift);";
    mysqlConnection.query(sql, [chr.id, chr.name, chr.age, chr.address, chr.gift], (err, rows, fields) => {
        if (!err)
            rows.forEach(element => {
                if(element.constructor == Array)
                res.send('Beillesztve, id: '+element[0].id);
            }); 
        else
            console.log(err);
    })
});

// PUT Parancs (UPDATE)
app.put('/christmas', (req, res) => {
    let chr = req.body;
    var sql = "SET @id = ?;SET @name = ?;SET @age = ?;SET @address = ?; SET @gift = ?;\
    CALL ChristmasAddOrEdit(@id,@name,@age,@address,@gift);";
    mysqlConnection.query(sql, [chr.id, chr.name, chr.age, chr.address, chr.gift], (err, rows, fields) => {
        if (!err)
            res.send('Sikeres módosítás');
        else
            console.log(err);
    })
});