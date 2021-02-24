# R&D - Feuille de présence virtuelle

Reprise à 0 du projet de feuille de présence initialement repris en DLL suite aux différents manquements du rendu de l'année précédente. Mise en place d'une architecture MEAN propre et responsive, avec module d'auth via token et fonction de signature digitale. Récupération de séances de VT-Agenda et génération d'une fiche de présence PDF client-side, qui peut être signée, archivée, et envoyée par mail server-side sur décision de l'enseignant.

## Installation

Attention, seule la version du projet située sur la branche **DEV** est à prendre en considération.

**Client :** Executer ``npm install`` puis ``npm start``
	* Résultat sur localhost:4200 (Tout navigateur)

**Server :** Executer ``npm install`` puis ``npm start``
	* Résultat sur localhost:3000 (Tout navigateur)

**DB :** Créer une DB 'dll' sur MongoDB et y importer le contenu de client\src\assets\data

Note - La DB est actuellement en ligne, installation localhost facultative. Changer lien DB server-side.

## Technologies

Architecture MEAN adaptée et fonctionelle pour une application RESTful.

* MongoDB (avec Compass)
* Express (Server-side)
* Angular (IHM client)
* Node JS (API backend)

## Dépendances

Deux principaux packages : Node-signPDF et jsPDF (avec un plugin pour ce dernier : Autotable)

* [Repo Node-sginPDF](https://github.com/vbuch/node-signpdf) - Signatures Digitales pour Node
* [Repo jsPDF](https://github.com/MrRio/jsPDF) - Génération de fichier PDF
* [Repo jsPDF-Autotable](https://github.com/simonbengtsson/jsPDF-AutoTable) - Création simplifiée de tableaux dans fichier

## TODO - Tâches immédiates

1) Fix message d'alerte login (subscribe asynchrone = verification d'auth parfois triggered trop tôt)
2) Gérer le cas ou l'enseignant oublie de signer la feuille  (feature de rappel)
3) Gérer le cas ou l'enseignant est toujours connecté à une séance terminée
4) Gérer le cas ou l'enseignant se reconnecte à une séance (en cours) dont l'appel a déjà été signé et terminé
5) Modifier les informations rentrées en dur server-side (notamment constantes pour les mails)
6) Contrôler la réussite ou non de la signature et de l'envoie mail selon upload du fichier (server-side)

## TODO - Grandes lignes

1) Traiter toutes les séances de VT-Agenda (Actuellement seules celles de M2 MIAGE APP)
2) Implémenter les véritables comptes enseignants (dummy datas en BD actuellement)
3) Accéder à la liste des étudiants (dummy datas en BD actuellement)
4) Intégrer le projet au sein d'une plateforme globale (projet d'un autre groupe)
5) Appli responsive via CSS, pourrait bénéficier d'une refonte sur Bootstrap
6) Mettre en place une gestion des rôles
7) Mettre en place un meilleur systeme d'archive/upload (actuellement les docs sont stockés dans un rep server-side)





