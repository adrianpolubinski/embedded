import fetch from 'node-fetch';
import sqlite3 from 'sqlite3';


const usersCount = 5;


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





var db = new sqlite3.Database('db/sqlite3.db');
// serialize czeka na zakonczenie i wywolanie db.close
db.serialize(function() {
    // db.run("CREATE TABLE users (firstName TEXT, lastName TEXT)");

    let addressesId = [];
    let personsId = [];
    // insert to addresses table
    var start = new Date()
    var stmt = db.prepare("INSERT INTO addresses(streetname, streetnumber, city, state, country, postcode, coordlatitude, coordlongitude, offsettimezone, descriptiontimezone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    for (let i = 0; i < results.length; i++) {
        stmt.run(streetNames[i], streetNumbers[i], cities[i], states[i], countries[i], postCodes[i], coordLatitudes[i], coordLongitudes[i], offsetTimeZones[i], descriptionsTimeZone[i]);
    }
    stmt.finalize(()=>{
        var end = new Date() - start;
        console.info('Czas instertowania do tabeli Addresses: %dms', end);
        getIdAddress();
    });

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
            console.info('Czas instertowania do tabeli Persons: %dms', end);
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
            console.info('Czas instertowania do tabeli Documents: %dms', end);
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
            console.info('Czas instertowania do tabeli Accounts: %dms', end);
            db.close(); 
        });
    }




});


 