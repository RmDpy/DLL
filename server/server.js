const express = require("express");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const expressJWT = require('express-jwt');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

mongoose
    .connect('mongodb://127.0.0.1:27017/dll', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à mongo réussi'))
    .catch(() => console.log ('Echec de la connexion à mongo'));

let db = mongoose.connection;


app.get('/api', (req, res) => {
    res.json("Vous êtes bien sur l'API");
});

app.get('/api/etudiants', (req, res) => {
    db.collection('etudiants').find({}).toArray()
        .then(docs => res.status(200).json(docs))
        .catch(err => {
            console.log(err);
            throw err;
        });
});

app.get('/api/password/:password', (req, res) => {
    const password = req.params.password;
    db.collection('enseignants').findOne({password})
        .then(docs => res.status(200).json(docs))
        .catch(err => {
            console.log(err);
            throw err;
        });
});

app.get('/api/email/:mail', (req, res) => {
    const mail = req.params.mail;
    db.collection('enseignants').findOne({mail})
        .then(docs => res.status(200).json(docs))
        .catch(err => {
            console.log(err);
            throw err;
        })
});

app.post('/api/login', (req, res) => {
    const email = req.body.email;
    const mdp = req.body.mdp;
    console.log('login api');
    db.collection('enseignants').findOne({mail: email, password: mdp})
        .then(docs => {
            console.log(docs);
            if(docs != null){
                jwt.sign({docs}, 'ninja', {expiresIn: '600s'}, (err, token) => {
                    res.json({token});
                })
            }
        })
        .catch(err => {
            console.log(err);
            throw err;
        })
});

app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'ninja', (err, authData) => {
        if(err) {
            res.sendStatus(403);
        }else {
            res.json({
                message: 'post created...',
                authData
            })
        }
    })
});

app.get('/api/enseignants', verifyToken, (req, res) => {
    jwt.verify(req.token, 'ninja', (err, authData) => {
        if(err) {
            res.sendStatus(403);
            console.log('not authorized');
        }else {
            res.json({
                message: 'get okay...',
                authData
            })
        }
    })
});


// Verify Token
function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Next middleware
        next();
    } else {
        // Forbidden
        res.sendStatus(403);
    }

}

app.listen(3000, () => {
    console.log("Serveur à l'écoute 3000")
});