const express = require("express");
const app = express();

const enseignants = require('./data/enseignant.json');
const etudiants = require('./data/etudiant.json');

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'dll';
let db;
MongoClient.connect(url, function(err, client) {
    console.log("Connected successfully to server");
    db = client.db(dbName);
});


app.use(express.json())

app.get('/enseignants', (req,res) => {
    db.collection('enseignants').find({}).toArray()
        .then(docs => res.status(200).json(docs))
        .catch(err => {
            console.log(err);
            throw err;
        });
});

app.get('/etudiants', (req, res) => {
    db.collection('etudiants').find({}).toArray()
        .then(docs => res.status(200).json(docs))
        .catch(err => {
            console.log(err);
            throw err;
        });
});




app.listen(8080, () => {
    console.log("Serveur à l'écoute sur 8080")
})












