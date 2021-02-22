const express = require("express");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

//const signer = require('node-signpdf').default;
//const fs = require("fs");
//const helpers = require('node-signpdf/dist/helpers');

const app = express();
app.use(bodyParser.json());

//Connexion à la base de donnée
mongoose
    .connect('mongodb+srv://admin_bdd:admin_bdd@cluster0.aqzty.mongodb.net/dll?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('\nConnexion à mongo réussi'))
    .catch(() => console.log ('\nEchec de la connexion à mongo'));

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

app.get('/api/getSeanceByProf', (req,res) => {
    const unProf = req.body.enseignant;
    db.collection('seances').findOne({prof: unProf})
        .then(docs => res.status(200).json(docs))
        .catch(err => {
            console.log(err);
            throw err;
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

function digitallySignDocument ( fileName ) {

    console.log("SIGNATURE");

    //const passphrase = 'DA5cJvezM6Px6JLR';
    const p12Buffer  = fs.readFileSync (`./assets/certificate.p12`);
    let pdfBuffer    = fs.readFileSync (`./assets/` + fileName);

    pdfBuffer = helpers.plainAddPlaceholder ( { pdfBuffer, reason: 'Presences', signatureLength: 1612, author: "Laiolo", Date: "21/02/2021" } )
    
    pdfBuffer = signer.sign ( pdfBuffer, p12Buffer ) //,{ passphrase }
    const {signature, signeData} = helpers.extractSignature(pdfBuffer);

    console.log(signer);
    console.log(signature);
   //console.log(signeData);

    fs.writeFileSync ( `./assets/results/` + fileName, pdfBuffer )
  }

//lancement de l'api sur le port 3000
app.listen(3000, () => {
    console.log("\nServeur à l'écoute 3000")
    //digitallySignDocument( "table.pdf" )
});