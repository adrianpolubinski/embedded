///////////////////////////////////////// Sqlite ////////////////////////////////////////
import sqlite3 from 'sqlite3';

const deleteDataSqlite = (searchObj) => {
    var start = new Date();

    const columns = Object.keys(searchObj);

    const personsList=['id', 'titleName', 'firstName', 'lastName', 'gender', 'national', 'cell', 'phone', 'email', 'picture', 'dateOfBirth', 'age'];
    const accontsList=['userName', 'password', 'registredDate', 'registredYear'];
    const addressesList=['streetName', 'streetNumber', 'city', 'state', 'country', 'postCode', 'coordLatitude', 'coordLongitude', 'offsetTimeZone', 'descriptionTimeZone'];
    const documentsList=['name', 'value'];

    const personsObj = [];
    const accountsObj = [];
    const addressesObj = [];
    const documentsObj = [];

    for(let i=0; i<columns.length; i++){

        if(personsList.includes(columns[i])){
            const temp = (isNaN(searchObj[columns[i]]))? '"'+searchObj[columns[i]]+'"': searchObj[columns[i]];
            personsObj.push(`${columns[i]}=${temp}`)
        }
        if(accontsList.includes(columns[i])){
            const temp = (isNaN(searchObj[columns[i]]))? '"'+searchObj[columns[i]]+'"': searchObj[columns[i]];
            accountsObj.push(`${columns[i]} =${temp}`)
        }
        if(addressesList.includes(columns[i])){
            const temp = (isNaN(searchObj[columns[i]]))? '"'+searchObj[columns[i]]+'"': searchObj[columns[i]];
            addressesObj.push(`${columns[i]}=${temp}`)
        }
        if(documentsList.includes(columns[i])){
            const temp = (isNaN(searchObj[columns[i]]))? '"'+searchObj[columns[i]]+'"': searchObj[columns[i]];
            documentsObj.push(`${columns[i]}=${temp}`)
        }
    }

    let personStr="";
    let tmp=""
    for(let i=0; i<personsObj.length; i++){
        tmp= personsObj[i].split("=");
        personStr += (i<personsObj.length-1)? tmp[0]+"="+tmp[1]+" AND ": tmp[0]+"="+tmp[1]+"";
    }

    let accountStr="";
    tmp=""
    for(let i=0; i<accountsObj.length; i++){
        tmp= accountsObj[i].split("=");
        accountStr += (i<accountsObj.length-1)? tmp[0]+"="+tmp[1]+" AND ": tmp[0]+"="+tmp[1]+"";
    }

    let addressStr="";
    tmp=""
    for(let i=0; i<addressesObj.length; i++){
        tmp= addressesObj[i].split("=");
        addressStr += (i<addressesObj.length-1)? tmp[0]+"="+tmp[1]+" AND ": tmp[0]+"="+tmp[1]+"";
    }

    let documentStr="";
    tmp=""
    for(let i=0; i<documentsObj.length; i++){
        tmp= documentsObj[i].split("=");
        documentStr += (i<documentsObj.length-1)? tmp[0]+"="+tmp[1]+" AND ": tmp[0]+"="+tmp[1]+"";
    }

    var db4 = new sqlite3.Database('db/sqlite3.db');


    if(personStr!="")
        db4.run("DELETE FROM persons WHERE "+ personStr,()=>{
            var end = new Date() - start;
            console.info('[SQLite] Czas usuwania danych z tabeli persons: %dms', end);
        })
    if(accountStr!="")
        db4.run("DELETE FROM accounts WHERE "+  accountStr,()=>{
            var end = new Date() - start;
            console.info('[SQLite] Czas usuwania danych z tabeli accounts: %dms', end);
        })
    if(addressStr!="")
        db4.run("DELETE FROM addresses WHERE "+ addressStr,()=>{
            var end = new Date() - start;
            console.info('[SQLite] Czas usuwania danych z tabeli addresses: %dms', end);
        })
    if(documentStr!="")
        db4.run("DELETE FROM documents WHERE "+ documentStr,()=>{
            var end = new Date() - start;
            console.info('[SQLite] Czas usuwania danych z tabeli documents: %dms', end);
        })


    
}


//////////////////////////////////////////// Nedb ////////////////////////////////////////////

import Datastore from 'nedb';

const deleteDataNedb = (obj) => {
    var start = new Date()

    const columns = Object.keys(obj);

    const personsList=['_id', 'titleName', 'firstName', 'lastName', 'gender', 'national', 'cell', 'phone', 'email', 'picture', 'dateOfBirth', 'age'];
    const accontsList=['userName', 'password', 'registredDate', 'registredYear'];
    const addressesList=['streetName', 'streetNumber', 'city', 'state', 'country', 'postCode', 'coordLatitude', 'coordLongitude', 'offsetTimeZone', 'descriptionTimeZone'];
    const documentsList=['name', 'value'];


    const personsObj = [];
    const accountsObj = [];
    const addressesObj = [];
    const documentsObj = [];

    for(let i=0; i<columns.length; i++){

        if(personsList.includes(columns[i])){
            const temp = (isNaN(obj[columns[i]]))? '"'+obj[columns[i]]+'"': obj[columns[i]];
            personsObj.push(`"${columns[i]}": ${temp}`)
        }
        if(accontsList.includes(columns[i])){
            const temp = (isNaN(obj[columns[i]]))? '"'+obj[columns[i]]+'"': obj[columns[i]];
            accountsObj.push(`"${columns[i]}": ${temp}`)
        }
        if(addressesList.includes(columns[i])){
            const temp = (isNaN(obj[columns[i]]))? '"'+obj[columns[i]]+'"': obj[columns[i]];
            addressesObj.push(`"${columns[i]}": ${temp}`)
        }
        if(documentsList.includes(columns[i])){
            const temp = (isNaN(obj[columns[i]]))? '"'+obj[columns[i]]+'"': obj[columns[i]];
            documentsObj.push(`"${columns[i]}": ${temp}`)
        }
    }

    let personStr="";
    let addressStr="";
    let accountStr="";
    let documentStr="";
    for(let i=0; i<personsObj.length; i++){
        (i==personsObj.length-1)?  personStr+=personsObj[i]:personStr+=personsObj[i]+"," ;
    }
    for(let i=0; i<addressesObj.length; i++){
        (i==addressesObj.length-1)?  addressStr+=addressesObj[i]:addressStr+=addressesObj[i]+"," ;
    }
    for(let i=0; i<accountsObj.length; i++){
        (i==accountsObj.length-1)?  accountStr+=accountsObj[i]:accountStr+=accountsObj[i]+"," ;
    }
    for(let i=0; i<documentsObj.length; i++){
        (i==documentsObj.length-1)?  documentStr+=documentsObj[i]:documentStr+=documentsObj[i]+"," ;
    }



    var db3 = {};

    db3.persons = new Datastore('db/nedb/persons.db');
    db3.accounts = new Datastore('db/nedb/accounts.db');
    db3.addresses = new Datastore('db/nedb/addresses.db');
    db3.documents = new Datastore('db/nedb/documents.db');

    db3.persons.loadDatabase();
    db3.accounts.loadDatabase();
    db3.addresses.loadDatabase();
    db3.documents.loadDatabase();



    if(personStr!=""){
        const PersonObject = JSON.parse(`{${personStr}}`);
        db3.persons.remove(PersonObject, { multi: true }, function (err, numRemoved) {
            db3.persons.persistence.compactDatafile();
            var end = new Date() - start;
            console.info('[Nedb] Czas usuwania danych z kolekcji persons: %dms', end);
        });
    }
    if(accountStr!=""){
        const AccountObject = JSON.parse(`{${accountStr}}`);
        db3.accounts.remove(AccountObject, { multi: true }, function (err, numRemoved) {
            db3.accounts.persistence.compactDatafile();
            var end = new Date() - start;
            console.info('[Nedb] Czas usuwania danych z kolekcji accounts: %dms', end);
        });
    }
    if(addressStr!=""){
        const AddressObject = JSON.parse(`{${addressStr}}`);
        db3.addresses.remove(AddressObject, { multi: true }, function (err, numRemoved) {
            db3.addresses.persistence.compactDatafile();
            var end = new Date() - start;
            console.info('[Nedb] Czas usuwania danych z kolekcji addresses: %dms', end);
        });
    }
    if(documentStr!=""){
        const DocumentObject = JSON.parse(`{${documentStr}}`);
        db3.documents.remove(DocumentObject, { multi: true }, function (err, numRemoved) {
            db3.documents.persistence.compactDatafile();
            var end = new Date() - start;
            console.info('[Nedb] Czas usuwania danych z kolekcji documents: %dms', end);
        });
    }  
}






///////////////////////////////////////////////// LowDB //////////////////////////////////////////

class Name{
    constructor(titleName, firstName, lastName){
        if(titleName!=undefined)
            this.title = titleName;
        if(firstName!=undefined)
            this.first = firstName;
        if(lastName!=undefined)
            this.last = lastName;
    } 
}

class Street{
    constructor(streetName, streetNumber){
        if(streetname!=undefined)
            this.name = streetName;
        if(streetNumber!=undefined)
            this.number = streetNumber;
    }
}

class Coordiantes{
    constructor(coordLatitude, coordLongitude){
        if(coordLatitude!=undefined)
            this.latitude = coordLatitude;
        if(coordLongitude!=undefined)
            this.longitude = coordLongitude;
    }
}

class Timezone{
    constructor(offsetTimeZone, descriptionTimeZone){
        if(offsetTimeZone!=undefined)
            this.offset = offsetTimeZone;
        if(descriptionTimeZone!=undefined)
            this.description = descriptionTimeZone;
    }
}

class Location{
    constructor(streetName, streetNumber, city, state, country, postCode, coordLatitude, coordLongitude, offsetTimeZone, descriptionTimeZone)
    {
        if(streetName!=undefined || streetNumber!=undefined)
            this.street = new Street(streetName, streetNumber);
        if(city!=undefined)
            this.city = city;
        if(state!=undefined)
            this.state = state;
        if(country!=undefined)
            this.country = country;
        if(postCode!=undefined)
            this.postCode = postCode;
        if(coordLatitude!=undefined || coordLongitude!=undefined)
            this.coordinates = new Coordiantes(coordLatitude, coordLongitude);
        if(offsetTimeZone!=undefined || descriptionTimeZone!=undefined)
            this.timezone = new Timezone(offsetTimeZone, descriptionTimeZone);
    }
}

class Login{
    constructor(uuid, userName, password){
        if(uuid!=undefined)
            this.uuid = uuid;
        if(userName!=undefined)
            this.userName = userName;
        if(password!=undefined)
            this.password = password;
    }
}

class DateOfBirth{
    constructor(dateOfBirth, age){
        if(dateOfBirth!=undefined)
            this.date = dateOfBirth;
        if(age!=undefined)
            this.age = age;
    }
}

class Registred{
    constructor(registredDate, registredYear){
        if(registredDate!=undefined)
            this.date = registredDate;
        if(registredYear!=undefined)
            this.age = registredYear;
    }
}

class Id{
    constructor(documentName, documentValue){
        if(documentName!=undefined)
            this.name = documentName;
        if(documentValue!=undefined)
            this.value = documentValue;
    }
}

class User{
    constructor(gender, titleName, firstName, lastName, streetName, streetNumber, city, state, country, 
        postCode, coordLatitude, coordLongitude, offsetTimeZone, descriptionTimeZone,
        email, uuid, userName, password, dateOfBirth, age, registredDate, registredYear, phone, cell, 
        documentName, documentValue, picture, national){

        if(gender != undefined)
            this.gender = gender;
        if(titleName != undefined || firstName!= undefined || lastName !=undefined)
            this.name = new Name(titleName, firstName, lastName);

        if(streetName != undefined || streetNumber!= undefined || city !=undefined || state !=undefined || country !=undefined|| postCode !=undefined
            || coordLatitude !=undefined || coordLongitude !=undefined || offsetTimeZone !=undefined|| descriptionTimeZone !=undefined)
            this.location = new Location(streetName, streetNumber, city, state, country, postCode, 
                coordLatitude, coordLongitude, offsetTimeZone, descriptionTimeZone);
        if(email!=undefined)
            this.email = email;
        if(uuid!=undefined || userName!=undefined || password !=undefined)
            this.login = new Login(uuid, userName, password);
        if(dateOfBirth != undefined || age != undefined)
            this.dateOfBirth = new DateOfBirth(dateOfBirth , age);
        if(registredDate!=undefined || registredYear!= undefined)
            this.registred = new Registred(registredDate, registredYear);
        if(phone!=undefined)
            this.phone = phone;
        if(cell!=undefined)
            this.cell = cell;
        if(documentName!=undefined || documentValue!=undefined)
            this.id = new Id(documentName, documentValue);
        if(picture!=undefined)
            this.picture = picture;
        if(national!=undefined)
            this.national = national;
    }
}

import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'
import lodash from 'lodash'

async function deleteDataLowDB(obj){
    var start = new Date();


    const SearchObj = new User(obj.gender, obj.titleName, obj.firstName, obj.lastName, obj.streetName, obj.streetNumber, obj.city, obj.state, obj.country, obj.postCode, obj.coordLatitude, obj.coordLongitude, obj.offsetTimeZone, obj.descriptionTimeZone, obj.email, obj.uuid, obj.userName, obj.password, obj.dateOfBirth, obj.age, obj.registredDate, obj.registredYear, obj.phone, obj.cell, obj.documentName, obj.documentValue, obj.picture, obj.national)


    const __dirname = dirname(fileURLToPath(import.meta.url));

    // Use JSON file for storage
    const file = join(__dirname, 'db/lowdb.json')
    const adapter = new JSONFile(file)
    const db2 = new Low(adapter)

    await db2.read();
    db2.chain = lodash.chain(db2.data.users)
    db2.chain
        .remove(SearchObj)
        .value()
    db2.write();


    var end = new Date() - start;
    console.info('[LowDB] Czas usuwania danych: %dms', end); 
}






////////////////////////////////////////////// LevelDB /////////////////////////////////////////////


import levelup from 'levelup';
import leveldown  from 'leveldown';
import { Console } from 'console';
import { title } from 'process';

const deleteDataLevelDB = (obj) => {
    var start = new Date();

    var db = levelup(leveldown('db/levelDB'))

    const keys = [];

    const id =[];
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
    const documentNames = [];
    const documentValues = [];
    const userNames = [];
    const passwords = [];
    const registredDates = [];
    const registredYears = [];
    
    const dataToDelete = [];

    let count=0;
    let i=0;
    db.createKeyStream()
    .on('data', function (data) {
        if(i%28==0) count++;
        i++;
    })
    .on('end', function (data) {
        i=0;
        let str, key;
        db.createKeyStream()
        .on('data', function (data) {
            if(i<count){
                str = data+"";
                key = str.split(':');
                keys.push(key[1]);
            }
            else if(i==count) return;
            i++;
        })
        .on('end', function (data) {
            for(let i=0; i<keys.length; i++){
                db.get(`id:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)

                    if(obj.id!=undefined){
                        if(obj.id == value)
                            id.push(value);
                        else
                            id.push(undefined);
                    }
                    else{
                        id.push(value);
                    }

                })
                db.get(`titleName:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)

                    if(obj.titleName!=undefined){
                        if(obj.titleName == value)
                            titleNames.push(value);
                        else
                            titleNames.push(undefined);
                    }
                    else{
                        titleNames.push(value);
                    }

                })
                db.get(`firstName:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)

                    if(obj.firstName!=undefined){
                        if(obj.firstName == value)
                            firstNames.push(value);
                        else
                            firstNames.push(undefined);
                    }
                    else{
                        firstNames.push(value);
                    }
                })
                db.get(`lastName:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)

                    if(obj.lastName!=undefined){
                        if(obj.lastName == value)
                            lastNames.push(value);
                        else
                            lastNames.push(undefined);
                    }
                    else{
                        lastNames.push(value);
                    }
                })
                db.get(`gender:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    if(obj.gender!=undefined){
                        if(obj.gender == value)
                            genders.push(value);
                        else
                            genders.push(undefined);
                    }
                    else{
                        genders.push(value);
                    }
                })
                db.get(`national:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    if(obj.national!=undefined){
                        if(obj.national == value)
                            nationals.push(value);
                        else
                            nationals.push(undefined);
                    }
                    else{
                        nationals.push(value);
                    }
                })
                db.get(`cell:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    if(obj.cell!=undefined){
                        if(obj.cell == value)
                            cells.push(value);
                        else
                            cells.push(undefined);
                    }
                    else{
                        cells.push(value);
                    }
                })
                db.get(`phone:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    if(obj.phone!=undefined){
                        if(obj.phone == value)
                            phones.push(value);
                        else
                            phones.push(undefined);
                    }
                    else{
                        phones.push(value);
                    }
                })
                db.get(`email:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    if(obj.email!=undefined){
                        if(obj.email == value)
                            emails.push(value);
                        else
                            emails.push(undefined);
                    }
                    else{
                        emails.push(value);
                    }
                })
                db.get(`picture:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    if(obj.picture!=undefined){
                        if(obj.picture == value)
                            pictures.push(value);
                        else
                            pictures.push(undefined);
                    }
                    else{
                        pictures.push(value);
                    }
                })
                db.get(`dateOfBirth:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    if(obj.dateOfBirth!=undefined){
                        if(obj.dateOfBirth == value)
                            datesOfBirth.push(value);
                        else
                            datesOfBirth.push(undefined);
                    }
                    else{
                        datesOfBirth.push(value);
                    }
                })
                db.get(`age:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    if(obj.age!=undefined){
                        if(obj.age == value)
                            ages.push(value);
                        else
                            ages.push(undefined);
                    }
                    else{
                        ages.push(value);
                    }
                })
                db.get(`streetName:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    if(obj.streetName!=undefined){
                        if(obj.streetName == value)
                            streetNames.push(value);
                        else
                            streetNames.push(undefined);
                    }
                    else{
                        streetNames.push(value);
                    }
                })
                db.get(`streetNumber:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    if(obj.streetNumber!=undefined){
                        if(obj.streetNumber == value)
                            streetNumbers.push(value);
                        else
                            streetNumbers.push(undefined);
                    }
                    else{
                        streetNumbers.push(value);
                    }
                })
                db.get(`city:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    if(obj.city!=undefined){
                        if(obj.city == value)
                            cities.push(value);
                        else
                            cities.push(undefined);
                    }
                    else{
                        cities.push(value);
                    }
                })
                db.get(`state:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    if(obj.state!=undefined){
                        if(obj.state == value)
                            states.push(value);
                        else
                            states.push(undefined);
                    }
                    else{
                        states.push(value);
                    }
                })
                db.get(`country:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    if(obj.country!=undefined){
                        if(obj.country == value)
                            countries.push(value);
                        else
                            countries.push(undefined);
                    }
                    else{
                        countries.push(value);
                    }
                })
                db.get(`postCode:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    if(obj.postCode!=undefined){
                        if(obj.postCode == value)
                            postCodes.push(value);
                        else
                            postCodes.push(undefined);
                    }
                    else{
                        postCodes.push(value);
                    }
                })
                db.get(`coordLatitude:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    if(obj.coordLatitude!=undefined){
                        if(obj.coordLatitude == value)
                            coordLatitudes.push(value);
                        else
                            coordLatitudes.push(undefined);
                    }
                    else{
                        coordLatitudes.push(value);
                    }
                })
                db.get(`coordLongitude:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    if(obj.coordLongitude!=undefined){
                        if(obj.coordLongitude == value)
                            coordLongitudes.push(value);
                        else
                            coordLongitudes.push(undefined);
                    }
                    else{
                       coordLongitudes.push(value);
                    }
                })
                db.get(`offsetTimeZone:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    if(obj.offsetTimeZone!=undefined){
                        if(obj.offsetTimeZone == value)
                            offsetTimeZones.push(value);
                        else
                            offsetTimeZones.push(undefined);
                    }
                    else{
                        offsetTimeZones.push(value);
                    }
                })
                db.get(`descriptionTimeZone:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    if(obj.descriptionTimeZone!=undefined){
                        if(obj.descriptionTimeZone == value)
                            descriptionsTimeZone.push(value);
                        else
                            descriptionsTimeZone.push(undefined);
                    }
                    else{
                        descriptionsTimeZone.push(value);
                    }
                })
                db.get(`documentName:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    if(obj.documentName!=undefined){
                        if(obj.documentName == value)
                            documentNames.push(value);
                        else
                            documentNames.push(undefined);
                    }
                    else{
                        documentNames.push(value);
                    }
                })
                db.get(`documentValue:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    if(obj.documentValue!=undefined){
                        if(obj.documentValue == value)
                            documentValues.push(value);
                        else
                            documentValues.push(undefined);
                    }
                    else{
                        documentValues.push(value);
                    }
                })
                db.get(`userName:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    if(obj.userName!=undefined){
                        if(obj.userName == value)
                            userNames.push(value);
                        else
                            userNames.push(undefined);
                    }
                    else{
                        userNames.push(value);
                    }
                })
                db.get(`password:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    if(obj.password!=undefined){
                        if(obj.password == value)
                            passwords.push(value);
                        else
                            passwords.push(undefined);
                    }
                    else{
                        passwords.push(value);
                    }
                })
                db.get(`registredDate:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    if(obj.registredDate!=undefined){
                        if(obj.registredDate == value)
                            registredDates.push(value);
                        else
                            registredDates.push(undefined);
                    }
                    else{
                        registredDates.push(value);
                    }
                })
                db.get(`registredYear:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    if(obj.registredYear!=undefined){
                        if(obj.registredYear == value)
                            registredYears.push(value);
                        else
                            registredYears.push(undefined);
                    }
                    else{
                        registredYears.push(value);
                    }


                    if(id[i]!=undefined && titleNames[i]!=undefined && firstNames[i]!=undefined && lastNames[i]!=undefined && genders[i]!=undefined && streetNames[i]!=undefined && streetNumbers[i]!=undefined && cities[i]!=undefined && states[i]!=undefined && countries[i]!=undefined && postCodes[i]!=undefined && coordLatitudes[i]!=undefined && coordLongitudes[i]!=undefined && offsetTimeZones[i]!=undefined && descriptionsTimeZone[i]!=undefined && nationals[i]!=undefined && cells[i]!=undefined && phones[i]!=undefined && emails[i]!=undefined && pictures[i]!=undefined && datesOfBirth[i]!=undefined && ages[i]!=undefined && documentNames[i]!=undefined &&  documentValues[i]!=undefined && userNames[i]!=undefined && passwords[i]!=undefined && registredDates[i]!=undefined && registredYears[i]!=undefined){


                        dataToDelete.push(id[i]+"");


                        
                    }

 
                    if(i==keys.length-1){
                        for(let i=0; i<dataToDelete.length; i++){
                            db.del(`id:${dataToDelete[i]}`, )
                            db.del(`titleName:${dataToDelete[i]}`)
                            db.del(`firstName:${dataToDelete[i]}`);
                            db.del(`lastName:${dataToDelete[i]}`)
                            db.del(`gender:${dataToDelete[i]}`)
                            db.del(`streetName:${dataToDelete[i]}`)
                            db.del(`streetNumber:${dataToDelete[i]}`)
                            db.del(`city:${dataToDelete[i]}`)
                            
                            db.del(`state:${dataToDelete[i]}`)
                            db.del(`country:${dataToDelete[i]}`)
                            db.del(`postCode:${dataToDelete[i]}`)
                            db.del(`coordLatitude:${dataToDelete[i]}`)
                            db.del(`coordLongitude:${dataToDelete[i]}`)
                            db.del(`offsetTimeZone:${dataToDelete[i]}`)
                            db.del(`descriptionTimeZone:${dataToDelete[i]}`)
                            db.del(`national:${dataToDelete[i]}`)
                            db.del(`cell:${dataToDelete[i]}`)
                            db.del(`phone:${dataToDelete[i]}`)
                            db.del(`email:${dataToDelete[i]}`)
                            db.del(`picture:${dataToDelete[i]}`)
                            db.del(`dateOfBirth:${dataToDelete[i]}`)
                            db.del(`age:${dataToDelete[i]}`)
                            db.del(`documentName:${dataToDelete[i]}`)
                            db.del(`value:${dataToDelete[i]}`)
                            db.del(`userName:${dataToDelete[i]}`)
                            db.del(`password:${dataToDelete[i]}`)
                            db.del(`registredDate:${dataToDelete[i]}`)
                            db.del(`registredYears:${dataToDelete[i]}`)
                        }
                        var end = new Date() - start;
                        console.info('[LevelDB] Czas wczytywania i wyswietlania danych: %dms', end); 
                    }
                })
            }
        }) 
    })

}





// deleteDataSqlite({lastName:"Dixon"})
// deleteDataNedb({name:"NINO"})
// deleteDataLowDB({gender:"female", city:"Meldal"})

deleteDataLevelDB({registredYear: 14})