const express = require("express");
const app = express();

const enseignants = require('../data/enseignant.json');
const etudiants = require('../data/etudiant.json');

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'dll';
let db;
MongoClient.connect(url, function(err, client) {
    console.log("Connexion mongo ok");
    db = client.db(dbName);
});


app.use(express.json())

app.get('/api/enseignants', (req,res) => {
    db.collection('enseignants').find({}).toArray()
        .then(docs => res.status(200).json(docs))
        .catch(err => {
            console.log(err);
            throw err;
        });
});

app.get('/api/etudiants', (req, res) => {
    db.collection('etudiants').find({}).toArray()
        .then(docs => res.status(200).json(docs))
        .catch(err => {
            console.log(err);
            throw err;
        });
});




app.listen(3000, () => {
    console.log("Serveur à l'écoute 3000")
});