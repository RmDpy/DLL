const express = require("express");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());



//Connexion à la base de donnée
mongoose
    .connect('mongodb+srv://admin_bdd:admin_bdd@cluster0.aqzty.mongodb.net/dll?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à mongo réussi'))
    .catch(() => console.log ('Echec de la connexion à mongo'));

let db = mongoose.connection;



//----*** GET **----
app.get('/api', (req, res) => {
    res.json("Vous êtes bien sur l'API");
});

app.get('/api/getEtudiants', verifyToken, (req, res) => {
    jwt.verify(req.token, 'ninja', (err, authData) => {
        if(err) {
            res.sendStatus(403);
        }else {
            db.collection('etudiants').find({}).toArray()
                .then(docs => res.status(200).json(docs))
                .catch(err => {
                    console.log(err);
                    throw err;
                })
        }
    })
});

app.get('/api/getSeance', verifyToken, (req,res) => {
    jwt.verify(req.token, 'ninja', (err, authData) => {
        if(err) {
            res.sendStatus(403);
        }else {
            db.collection('seances').find({}).toArray()
                .then(docs => res.status(200).json(docs))
                .catch(err => {
                    console.log(err);
                    throw err;
                })
        }
    })
})

app.get('/api/compteUser', verifyToken, (req, res) => {
    jwt.verify(req.token, 'ninja', (err, authData) => {
        if(err) {
            res.sendStatus(403);
        }else {
            res.json({
                authData
            })
        }
    })
});



//----** POST **----
app.post('/api/login', (req, res) => {
    const email = req.body.email;
    const mdp = req.body.mdp;
    db.collection('enseignants').findOne({mail: email, password: mdp})
        .then(docs => {
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



function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }

}



//lancement de l'api sur le port 3000
app.listen(3000, () => {
    console.log("Serveur à l'écoute 3000")
});