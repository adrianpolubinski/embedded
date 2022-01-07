import fetch from 'node-fetch';
import sqlite3 from 'sqlite3';
import Datastore from 'nedb';


const usersCount = 1000;


const response = await fetch(`https://randomuser.me/api/?results=${usersCount}&nat=US,ES,FR,NL,GB,FI,IE,AU,CH,DK,NO`);
const data = await response.json();
const results = data.results;


// persons data
const titleNames = [];
const firstNames = [];
const lastNames = [];
const genders = [];
const nationals = [];
const cells = [];
const phones = [];
const emails = [];
const pictures = [];
const datesOfBirth = [];
const ages = [];

for(let i=0; i<results.length; i++){
    titleNames.push(results[i].name.title);
    firstNames.push(results[i].name.first);
    lastNames.push(results[i].name.last);
    genders.push(results[i].gender);
    nationals.push(results[i].nat);
    cells.push(results[i].cell);
    phones.push(results[i].phone);
    emails.push(results[i].email);
    pictures.push(results[i].picture.medium);
    datesOfBirth.push(results[i].dob.date);
    ages.push(results[i].dob.age);
}


// addresses data
const streetNames = [];
const streetNumbers = [];
const cities = [];
const states = [];
const countries = [];
const postCodes = [];
const coordLatitudes = [];
const coordLongitudes = [];
const offsetTimeZones = [];
const descriptionsTimeZone = [];

for(let i=0; i<results.length; i++){
    streetNames.push(results[i].location.street.name);
    streetNumbers.push(results[i].location.street.number);
    cities.push(results[i].location.city);
    states.push(results[i].location.state);
    countries.push(results[i].location.country);
    postCodes.push(results[i].location.postcode);
    coordLatitudes.push(results[i].location.coordinates.latitude);
    coordLongitudes.push(results[i].location.coordinates.longitude);
    offsetTimeZones.push(results[i].location.timezone.offset);
    descriptionsTimeZone.push(results[i].location.timezone.description);
}


// documents data
const documentNames = [];
const documentValues = [];

for(let i=0; i<results.length; i++){
    documentNames.push(results[i].id.name);
    documentValues.push(results[i].id.value);
}

// accounts data
const userNames = [];
const passwords = [];
const registredDates = [];
const registredYears = [];

for(let i=0; i<results.length; i++){
    userNames.push(results[i].login.username);
    passwords.push(results[i].login.password);
    registredDates.push(results[i].registered.date);
    registredYears.push(results[i].registered.age);
}


// SQLITE INSERT ROWS
var db = new sqlite3.Database('db/sqlite3.db');
// serialize czeka na zakonczenie i wywolanie db.close
db.serialize(function() {
    // db.run("CREATE TABLE users (firstName TEXT, lastName TEXT)");

    let addressesId = [];
    let personsId = [];

    // addAddresses();

    // insert to addresses table
    const addAddresses = () => {
        var start = new Date()
        var stmt = db.prepare("INSERT INTO addresses(streetname, streetnumber, city, state, country, postcode, coordlatitude, coordlongitude, offsettimezone, descriptiontimezone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        for (let i = 0; i < results.length; i++) {
            stmt.run(streetNames[i], streetNumbers[i], cities[i], states[i], countries[i], postCodes[i], coordLatitudes[i], coordLongitudes[i], offsetTimeZones[i], descriptionsTimeZone[i]);
        }
        stmt.finalize(()=>{
            var end = new Date() - start;
            console.info('[SQLite] Czas instertowania do tabeli Addresses: %dms', end);
            getIdAddress();
        });
    }

    // get new id from adresses
    const getIdAddress = ()=>{
        db.each(`select id from addresses order by id desc limit ${results.length}`, function(err, row) {
            addressesId.push(row.id);
        }, function(){
            addressesId.reverse();
            addPersons();
        }); 
    }

    // insert to persons table
    const addPersons = ()=> { 
        var start = new Date()
        var stmt = db.prepare("INSERT INTO persons(titlename, firstName, lastName, gender, adress_id, national, cell, phone, email, picture, dateofbirth, age) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        for (let i = 0; i < results.length; i++) {
            stmt.run(titleNames[i], firstNames[i], lastNames[i], genders[i], addressesId[i], nationals[i], cells[i], phones[i], emails[i], pictures[i], datesOfBirth[i], ages[i]);
        }
        stmt.finalize(()=>{
            var end = new Date() - start;
            console.info('[SQLite] Czas instertowania do tabeli Persons: %dms', end);
            getIdperson();
        });
    }

    const getIdperson = ()=>{
        db.each(`select id from persons order by id desc limit ${results.length}`, function(err, row) {
            personsId.push(row.id);
        }, function(){
            personsId.reverse();  
            addDocuments();
        }); 
    }

    const addDocuments = () => {
        var start = new Date()
        var stmt = db.prepare("INSERT INTO documents(person_id, name, value) VALUES (?, ?, ?)");
        for (let i = 0; i < results.length; i++) {
            stmt.run(personsId[i], documentNames[i], documentValues[i]);
        }
        stmt.finalize(()=>{
            var end = new Date() - start;
            console.info('[SQLite] Czas instertowania do tabeli Documents: %dms', end);
            addAccounts();
        });
    }

    const addAccounts = () => {
        var start = new Date()
        var stmt = db.prepare("INSERT INTO accounts(person_id, username, password, registreddate, registredyears) VALUES (?, ?, ?, ?, ?)");
        for (let i = 0; i < results.length; i++) {
            stmt.run(personsId[i], userNames[i], passwords[i], registredDates[i], registredYears[i]);
        }
        stmt.finalize(()=>{
            var end = new Date() - start;
            console.info('[SQLite] Czas instertowania do tabeli Accounts: %dms', end);
            db.close(); 
        });
    }

});


 
// NEDO insert rows

db = {};

db.persons = new Datastore('db/nedb/persons.db');
db.accounts = new Datastore('db/nedb/accounts.db');
db.addresses = new Datastore('db/nedb/addresses.db');
db.documents = new Datastore('db/nedb/documents.db');

db.persons.loadDatabase();
db.accounts.loadDatabase();
db.addresses.loadDatabase();
db.documents.loadDatabase();

class Address{
    constructor(streetName, streetNumber, city, state, country, postCode, coordLatitude, coordLongitude, offsetTimeZone, descriptionTimeZone){
        this.streetName = streetName;
        this.streetNumber = streetNumber;
        this.city = city;
        this.state = state;
        this.country = country;
        this.postCode = postCode;
        this.coordLatitude = coordLatitude;
        this.coordLongitude = coordLongitude;
        this.offsetTimeZone = offsetTimeZone;
        this.descriptionsTimeZone = descriptionTimeZone;
    }
}

class Person {
    constructor(titleName, firstName, lastName, gender, adress_id, national, cell, phone, email, picture, dateOfBirth, age){
        this.titleName = titleName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.adress_id  = adress_id;
        this.national = national;
        this.cell = cell;
        this.phone = phone;
        this.email = email;
        this.picture = picture;
        this.dateOfBirth = dateOfBirth;
        this.age = age;
    }
}

class Document{
    constructor(person_id, name, value){
        this.person_id = person_id;
        this.name = name;
        this.value = value;
    }
}

class Account{
    constructor(person_id, userName, password, registredDate, registredYear){
        this.person_id = person_id;
        this.userName = userName;
        this.password = password;
        this.registredDate = registredDate;
        this.registredYear = registredYear;
    }
}

const addressesIdMongo = [];
const personsIdMongo = [];

const addAccountsMongo = () => {
    var start = new Date()

    const accounts = [];
    for(let i=0; i<results.length; i++)
        accounts.push(new Account(personsIdMongo[i], userNames[i], passwords[i], registredDates[i], registredYears[i]));

    db.accounts.insert(accounts, function(err, newDocs){
            var end = new Date() - start;
            console.info('[MongoDB] Czas instertowania do tabeli Accounts: %dms', end);
        });
}

const addDocumentsMongo = () => {
        var start = new Date()

        const documents = [];
        for(let i=0; i<results.length; i++)
            documents.push(new Document(personsIdMongo[i], documentNames[i], documentValues[i]))

        db.documents.insert(documents, function(err, newDocs){
            var end = new Date() - start;
            console.info('[MongoDB] Czas instertowania do tabeli Documents: %dms', end); 
            addAccountsMongo();
        });
        
}

const addPersonsMongo = () => {   
    var start = new Date()

    const persons = [];
    for(let i=0; i<results.length; i++)
        persons.push(new Person(titleNames[i], firstNames[i], lastNames[i], genders[i], addressesIdMongo[i], nationals[i], cells[i], phones[i], emails[i], pictures[i], datesOfBirth[i], ages[i]));
    
    db.persons.insert(persons, function(err, newDocs){
        for(let i = 0; i < results.length; i++)
            personsIdMongo.push(newDocs[i]._id);
        var end = new Date() - start;
        console.info('[MongoDB] Czas instertowania do tabeli Persons: %dms', end);  
        addDocumentsMongo();
    });
}

const addAddressesMongo = () => {
    var start = new Date()

    // const addresses = [];
    // for(let i=0; i<results.length; i++)
    //     addresses.push(new Address(streetNames[i], streetNumbers[i], cities[i], states[i], countries[i], postCodes[i], coordLatitudes[i], coordLongitudes[i], offsetTimeZones[i], descriptionsTimeZone[i]));

    for(let i = 0; i < results.length; i++)
        db.addresses.insert(new Address(streetNames[i], streetNumbers[i], cities[i], states[i], countries[i], postCodes[i], coordLatitudes[i], coordLongitudes[i], offsetTimeZones[i], descriptionsTimeZone[i]), function(err, newDocs){
            addressesIdMongo.push(newDocs._id);
            if(i==results.length-1){
                var end = new Date() - start;
                console.info('[MongoDB] Czas instertowania do tabeli Adresses: %dms', end);
                addPersonsMongo();
            }
                
    });
    
    // db.addresses.insert(addresses, function(err, newDocs){
    //     for(let i = 0; i < results.length; i++)
    //         addressesIdMongo.push(newDocs[i]._id);
    //     var end = new Date() - start;
    //     console.info('[MongoDB] Czas instertowania do tabeli Adresses: %dms', end);
    //     addPersonsMongo();
    // });
}

addAddressesMongo();
