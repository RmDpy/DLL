# DLL - Feuille de présence virtuelle

Reprise à 0 du projet de feuille de présence initialement repris en DLL suite aux différents manquements du rendu de l'année précédente. Mise en place d'une architecture MEAN propre avec module d'auth via token.

## Installation

**Client :** Executer ``npm install`` puis ``npm start``
	* Résultat sur localhost:4200 (Tout navigateur)

**Server :** Executer ``npm install`` puis ``npm start``
	* Résultat sur localhost:3000 (Tout navigateur)

**DB :** Créer une DB 'dll' sur MongoDB et y importer le contenu de client\src\assets\data

Note - l'APP a accés aux routes de l'API grâce à son **proxy.conf.json**

Exemple : localhost:4200/api/etudiants est une route viable pour HTTP dans le code de l'APP  

## Technologies

Architecture MEAN adaptée et fonctionelle pour une application RESTful.

* MongoDB (avec Compass)
* Express (Server-side)
* Angular (IHM client)
* Node JS (API backend)
* [Doc Angular](https://angular.io/tutorial/toh-pt6) - Pour lier API/APP

## Existant - APP

**Module d'auth :** voir app/node_modules/nebular/auth - avec front et diverses stratégies

**[Doc Nebular Auth](https://akveo.github.io/nebular/docs/auth/configuring-a-strategy#strategy) :** Documentation Nebular sur les stratégies et l'auth

**Modules GMAO :** voir app/src/app/pages/tables - Nous n'utilisons que des components à base de tables

## Existant - API

**Modules GMAO :** voir api/src/modules - Les routes et controllers permettent un CRUD basique

**DB :** voir api/data - Les collections des modules et quelques données (identiques aux Dummy Datas du front)

## TODO - Tâches immédiates

1) Recuperer le contenu de VT Agenda
	* Possible d'utiliser l'API réalisée par l'équipe d'Achraf

2) Modifier l'API pour traiter les données de VT Agenda
	
3) Modifier l'API pour proposer différents logins possibles
	* UEVE, Paris Sud, Paris Telecom...similaire à E-campus

4) Mise en place de l'export des données en format PDF

5) Mise en place de signature numérique et des QR-Codes







