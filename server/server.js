const express = require("express");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const signer = require('node-signpdf').default;
const fs = require("fs");
const userFiles = './assets/user_upload/';
const dummyCertificateP12 = './assets/certificate/certificate.p12';
const helpers = require('node-signpdf/dist/helpers');

const nodemailer = require('nodemailer');
const dummySender = "m2miaa_rd@hotmail.com";
const dummyReceiver = "perduo@live.fr";
const transporter = nodemailer.createTransport({ service: 'hotmail', auth: { user: dummySender, pass: 'Poiuytreza1' } });

const app = express();
app.use(bodyParser.json({limit: '50mb'})); //app.use(bodyParser.json());

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

app.use('/api/files', express.static(userFiles)); //static hosting puisque les fichiers seront toujours dans user_upload

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

//----** PUT **----
app.put('/api/files', (req, res) => {
    const file = req.body;
    const base64data = file.content.replace(/^data:.*,/, '');
    fs.writeFile(userFiles + file.name, base64data, 'base64', (err) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        res.set('Location', userFiles + file.name);
        res.status(200);
        res.send(file);
        digitallySignDocument ( file.name );
        sendDocumentByMail( file.name );
      }
    });
});

//----** DELETE **----
app.delete('/api/files/**', (req, res) => {
    const fileName = req.url.substring(7).replace(/%20/g, ' ');
    fs.unlink(userFiles + fileName, (err) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        res.status(204);
        res.send({});
      }
    });
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
    //const passphrase = 'DA5cJvezM6Px6JLR';
    const p12Buffer  = fs.readFileSync (dummyCertificateP12);
    let pdfBuffer    = fs.readFileSync (userFiles + fileName);
    pdfBuffer = helpers.plainAddPlaceholder ( { pdfBuffer, reason: 'Presences confirmées', signatureLength: 1612, author: "Laiolo", Date: "21/02/2021" } )
    pdfBuffer = signer.sign ( pdfBuffer, p12Buffer ) //possible de rajouter ,{ passphrase } juste apres p12Buffer
    const {signature, signeData} = helpers.extractSignature(pdfBuffer);
    fs.writeFileSync ( `./assets/signed_upload/` + fileName, pdfBuffer )
  }

function sendDocumentByMail( fileName ){
    var mailOptions = {
        from: dummySender,
        to: dummyReceiver,
        subject: '[FICHE] ' + fileName,
        attachments: [{ filename: fileName, path: './assets/signed_upload/' + fileName }],
        text: 'Projet R&D - M2 MIAGE APP - 2021'
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email envoyé : ' + info.response);
        }
    }); 
}
//lancement de l'api sur le port 3000
app.listen(3000, () => { console.log("\nServeur à l'écoute 3000") });