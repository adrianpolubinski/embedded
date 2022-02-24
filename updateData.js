///////////////////////////////////////// Sqlite ////////////////////////////////////////
import sqlite3 from 'sqlite3';

const updateDataSqlite = (searchObj, updateObj) => {
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


    const columnsUpdate= Object.keys(updateObj);

    const updateDataPersons = [];
    const updateDataAccounts = [];
    const updateDataAddresses = [];
    const updateDataDocuments = [];

    for(let i=0; i<columnsUpdate.length; i++){

        if(personsList.includes(columnsUpdate[i])){
            const temp = (isNaN(updateObj[columnsUpdate[i]]))? '"'+updateObj[columnsUpdate[i]]+'"': updateObj[columnsUpdate[i]];
            updateDataPersons.push(`${columnsUpdate[i]}=${temp}`)
        }
        if(accontsList.includes(columnsUpdate[i])){
            const temp = (isNaN(updateObj[columnsUpdate[i]]))? '"'+updateObj[columnsUpdate[i]]+'"': updateObj[columnsUpdate[i]];
            updateDataAccounts.push(`${columnsUpdate[i]} =${temp}`)
        }
        if(addressesList.includes(columnsUpdate[i])){
            const temp = (isNaN(updateObj[columnsUpdate[i]]))? '"'+updateObj[columnsUpdate[i]]+'"': updateObj[columnsUpdate[i]];
            updateDataAddresses.push(`${columnsUpdate[i]}=${temp}`)
        }
        if(documentsList.includes(columnsUpdate[i])){
            const temp = (isNaN(updateObj[columnsUpdate[i]]))? '"'+updateObj[columnsUpdate[i]]+'"': updateObj[columnsUpdate[i]];
            updateDataDocuments.push(`${columnsUpdate[i]}=${temp}`)
        }
    }

    let personUpdateStr="";
    tmp=""
    for(let i=0; i<updateDataPersons.length; i++){
        tmp= updateDataPersons[i].split("=");
        personUpdateStr += (i<updateDataPersons.length-1)? tmp[0]+"="+tmp[1]+", ": tmp[0]+"="+tmp[1]+"";
    }

    let accountUpdateStr="";
    tmp=""
    for(let i=0; i<updateDataAccounts.length; i++){
        tmp= updateDataAccounts[i].split("=");
        accountUpdateStr += (i<updateDataAccounts.length-1)? tmp[0]+"="+tmp[1]+", ": tmp[0]+"="+tmp[1]+"";
    }

    let addressUpdateStr="";
    tmp=""
    for(let i=0; i<updateDataAddresses.length; i++){
        tmp= updateDataAddresses[i].split("=");
        addressUpdateStr += (i<updateDataAddresses.length-1)? tmp[0]+"="+tmp[1]+", ": tmp[0]+"="+tmp[1]+"";
    }

    let documentUpdateStr="";
    tmp=""
    for(let i=0; i<updateDataDocuments.length; i++){
        tmp= updateDataDocuments[i].split("=");
        documentUpdateStr += (i<updateDataDocuments.length-1)? tmp[0]+"="+tmp[1]+", ": tmp[0]+"="+tmp[1]+"";
    }
    console.log(personUpdateStr, accountUpdateStr, addressUpdateStr, documentUpdateStr)

    var db4 = new sqlite3.Database('db/sqlite3.db');


    if(personUpdateStr!="" && personStr!="")
        db4.run("UPDATE persons SET "+ personUpdateStr+ " WHERE "+ personStr)
    if(accountUpdateStr!="" && accountStr!="")
        db4.run("UPDATE accounts SET "+ accountUpdateStr+ " WHERE "+  accountStr)
    if(addressUpdateStr!="" && addressStr!="")
        db4.run("UPDATE addresses SET "+ addressUpdateStr+ " WHERE "+ addressStr)
    if(documentUpdateStr!="" && documentStr!="")
        db4.run("UPDATE documents SET "+ documentUpdateStr+ " WHERE "+ documentStr)


    var end = new Date() - start;
    console.info('[SQLite] Czas Updatowania danych: %dms', end);
}

//////////////////////////////////////////// Nedb ////////////////////////////////////////////

import Datastore from 'nedb';

const updateDataNedb = (searchObj, updateObj) => {
    var start = new Date()

    const columns = Object.keys(searchObj);

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
            const temp = (isNaN(searchObj[columns[i]]))? '"'+searchObj[columns[i]]+'"': searchObj[columns[i]];
            personsObj.push(`"${columns[i]}": ${temp}`)
        }
        if(accontsList.includes(columns[i])){
            const temp = (isNaN(searchObj[columns[i]]))? '"'+searchObj[columns[i]]+'"': searchObj[columns[i]];
            accountsObj.push(`"${columns[i]}": ${temp}`)
        }
        if(addressesList.includes(columns[i])){
            const temp = (isNaN(searchObj[columns[i]]))? '"'+searchObj[columns[i]]+'"': searchObj[columns[i]];
            addressesObj.push(`"${columns[i]}": ${temp}`)
        }
        if(documentsList.includes(columns[i])){
            const temp = (isNaN(searchObj[columns[i]]))? '"'+searchObj[columns[i]]+'"': searchObj[columns[i]];
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



    const columnsUpdate = Object.keys(updateObj);


    /////////////////////////////////////////////// changed object ///////////////////////////
    const personsDataObj = [];
    const accountsDataObj = [];
    const addressesDataObj = [];
    const documentsDataObj = [];

    for(let i=0; i<columns.length; i++){

        if(personsList.includes(columnsUpdate[i])){
            const temp = (isNaN(updateObj[columnsUpdate[i]]))? '"'+updateObj[columnsUpdate[i]]+'"': updateObj[columnsUpdate[i]];
            personsDataObj.push(`"${columnsUpdate[i]}": ${temp}`)
        }
        if(accontsList.includes(columnsUpdate[i])){
            const temp = (isNaN(updateObj[columnsUpdate[i]]))? '"'+updateObj[columnsUpdate[i]]+'"': updateObj[columnsUpdate[i]];
            accountsDataObj.push(`"${columnsUpdate[i]}": ${temp}`)
        }
        if(addressesList.includes(columnsUpdate[i])){
            const temp = (isNaN(updateObj[columnsUpdate[i]]))? '"'+updateObj[columnsUpdate[i]]+'"': updateObj[columnsUpdate[i]];
            addressesDataObj.push(`"${columnsUpdate[i]}": ${temp}`)
        }
        if(documentsList.includes(columnsUpdate[i])){
            const temp = (isNaN(updateObj[columnsUpdate[i]]))? '"'+updateObj[columnsUpdate[i]]+'"': updateObj[columnsUpdate[i]];
            documentsDataObj.push(`"${columnsUpdate[i]}": ${temp}`)
        }
    }


    let personUpdateStr="";
    let addressUpdateStr="";
    let accountUpdateStr="";
    let documentUpdateStr="";
    
    for(let i=0; i<personsDataObj.length; i++){
        (i==personsDataObj.length-1)?  personUpdateStr+=personsDataObj[i]:personUpdateStr+=personsDataObj[i]+"," ;
    }
    for(let i=0; i<addressesDataObj.length; i++){
        (i==addressesDataObj.length-1)?  addressUpdateStr+=addressesDataObj[i]:addressUpdateStr+=addressesDataObj[i]+"," ;
    }
    for(let i=0; i<accountsDataObj.length; i++){
        (i==accountsDataObj.length-1)?  accountUpdateStr+=accountsDataObj[i]:accountUpdateStr+=accountsDataObj[i]+"," ;
    }
    for(let i=0; i<documentsDataObj.length; i++){
        (i==documentsDataObj.length-1)?  documentUpdateStr+=documentsDataObj[i]:documentUpdateStr+=documentsDataObj[i]+"," ;
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



    if(personStr!="" && personUpdateStr!=""){
        const PersonObject = JSON.parse(`{${personStr}}`);
        const PersonChangeObject = JSON.parse(`{${personUpdateStr}}`);
        db3.persons.update(PersonObject, { $set: PersonChangeObject }, { multi: true }, function (err, numReplaced) {
            db3.persons.persistence.compactDatafile();
            var end = new Date() - start;
            console.info('[Nedb] Czas Updatowania danych: %dms', end);
        });
    }
    
    if(addressStr!="" && addressUpdateStr!=""){
        const AdressObject = JSON.parse(`{${addressStr}}`);
        const PersonChangeObject = JSON.parse(`{${addressUpdateStr}}`);
        db3.addresses.update(AdressObject, { $set: PersonChangeObject }, { multi: true }, function (err, numReplaced) {
            db3.addresses.persistence.compactDatafile();
            var end = new Date() - start;
            console.info('[Nedb] Czas Updatowania danych: %dms', end);
        });
    }

    if(accountStr!="" && accountUpdateStr!=""){
        const AccountObject = JSON.parse(`{${accountStr}}`);
        const AccountChangeObject = JSON.parse(`{${accountUpdateStr}}`);
        db3.accounts.update(AccountObject, { $set: AccountChangeObject }, { multi: true }, function (err, numReplaced) {
            db3.accounts.persistence.compactDatafile();
            var end = new Date() - start;
            console.info('[Nedb] Czas Updatowania danych: %dms', end);
        });
    }

    if(documentStr!="" && documentUpdateStr!=""){
        const DocumentObject = JSON.parse(`{${documentStr}}`);
        const DocumentChangeObject = JSON.parse(`{${documentUpdateStr}}`);
        db3.accounts.update(DocumentObject, { $set: DocumentChangeObject }, { multi: true }, function (err, numReplaced) {
            db3.accounts.persistence.compactDatafile();
            var end = new Date() - start;
            console.info('[Nedb] Czas Updatowania danych: %dms', end);
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

async function updateDataLowDB(searchObj, updateObj){
    var start = new Date();


    const SearchObj = new User(searchObj.gender, searchObj.titleName, searchObj.firstName, searchObj.lastName, searchObj.streetName, searchObj.streetNumber, searchObj.city, searchObj.state, searchObj.country, searchObj.postCode, searchObj.coordLatitude, searchObj.coordLongitude, searchObj.offsetTimeZone, searchObj.descriptionTimeZone, searchObj.email, searchObj.uuid, searchObj.userName, searchObj.password, searchObj.dateOfBirth, searchObj.age, searchObj.registredDate, searchObj.registredYear, searchObj.phone, searchObj.cell, searchObj.documentName, searchObj.documentValue, searchObj.picture, searchObj.national)

    const UpdateObj = new User(updateObj.gender, updateObj.titleName, updateObj.firstName, updateObj.lastName, updateObj.streetName, updateObj.streetNumber, updateObj.city, updateObj.state, updateObj.country, updateObj.postCode, updateObj.coordLatitude, updateObj.coordLongitude, updateObj.offsetTimeZone, updateObj.descriptionTimeZone, updateObj.email, updateObj.uuid, updateObj.userName, updateObj.password, updateObj.dateOfBirth, updateObj.age, updateObj.registredDate, updateObj.registredYear, updateObj.phone, updateObj.cell, updateObj.documentName, updateObj.documentValue, updateObj.picture, updateObj.national)

    const __dirname = dirname(fileURLToPath(import.meta.url));

    // Use JSON file for storage
    const file = join(__dirname, 'db/lowdb.json')
    const adapter = new JSONFile(file)
    const db2 = new Low(adapter)

    await db2.read();
    db2.data ||= { users: [] };

    db2.chain = lodash.chain(db2.data)

    db2.chain
    .get('users')
    .filter(SearchObj)
    .each( (user) => {
        if('gender' in UpdateObj)
            user.gender=UpdateObj.gender;

        if('name' in UpdateObj){
            if('title' in UpdateObj.name)
                user.name.title=UpdateObj.name.title;
            if('first' in UpdateObj.name)
                user.name.first=UpdateObj.name.first;
            if('last' in UpdateObj.name)
                user.name.last=UpdateObj.name.last;
        }

        if('location' in UpdateObj){
            if('street' in UpdateObj.location){
                if('name' in UpdateObj.location.street)
                    user.location.street.name = UpdateObj.location.street.name;
                if('number' in UpdateObj.location.street)
                    user.location.street.number = UpdateObj.location.street.number;
            }
            if('city' in UpdateObj.location){
                user.location.city = UpdateObj.location.city;
            }
            if('state' in UpdateObj.location){
                user.location.state = UpdateObj.location.state;
            }
            if('country' in UpdateObj.location){
                user.location.country = UpdateObj.location.country;
            }
            if('postCode' in UpdateObj.location){
                user.location.postCode = UpdateObj.location.postCode;
            }
            if('coordinates' in UpdateObj.location){
                if('latitude'in UpdateObj.location.coordinates)
                    user.location.coordinates.latitude = UpdateObj.location.coordinates.latitude;
                if('longitude'in UpdateObj.location.coordinates)
                    user.location.coordinates.longitude = UpdateObj.location.coordinates.longitude;
            }

            if('timezone' in UpdateObj.location){
                if('offset'in UpdateObj.location.timezone)
                    user.location.timezone.offset = UpdateObj.location.timezone.offset;
                if('description'in UpdateObj.location.timezone)
                    user.location.timezone.description = UpdateObj.location.timezone.description;
            }
        }

        if('email' in UpdateObj)
            user.email = UpdateObj.email;
        if('login' in UpdateObj){
            if('uuid' in UpdateObj.login)
                user.login.uuid = UpdateObj.login.uuid;
            if('userName' in UpdateObj.login)
                user.login.userName = UpdateObj.login.userName;
            if('password' in UpdateObj.login)
                user.login.password = UpdateObj.login.password;
        }

        if('dateOfBirth' in UpdateObj){
            if('date' in UpdateObj.dateOfBirth)
                user.dateOfBirth.date = UpdateObj.dateOfBirth.date;
            if('age' in UpdateObj.dateOfBirth)
                user.dateOfBirth.age = UpdateObj.dateOfBirth.age;
        }

        if('registred' in UpdateObj){
            if('date' in UpdateObj.registred)
                user.registred.date = UpdateObj.registred.date;
            if('age' in UpdateObj.registred)
                user.registred.age = UpdateObj.registred.age;
        }

        if('phone' in UpdateObj)
            user.phone = UpdateObj.phone;

        if('cell' in UpdateObj)
            user.cell = UpdateObj.cell;

        if('id' in UpdateObj){
            if('name' in UpdateObj.id)
                user.id.name = UpdateObj.id.name;
            if('value' in UpdateObj.id)
                user.id.value = UpdateObj.id.value;
        }

        if('picture' in UpdateObj)
            user.picture = UpdateObj.picture;
        if('national' in UpdateObj)
            user.national = UpdateObj.national;
    })
    .value()


    db2.write()
    .then(()=>{
        var end = new Date() - start;
        console.info('[LowDB] Czas Updatowania danych: %dms', end);
    });
}





////////////////////////////////////////////// LevelDB /////////////////////////////////////////////


import levelup from 'levelup';
import leveldown  from 'leveldown';


async function selectDataLevelDB(SearchObj, UpdateObj){
    var start = new Date();

    const columns = Object.keys(UpdateObj);

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
    
    let str;
    for await (const [key, value] of db.iterator()) {

        str = key+"";
        if(str.split(':')[0] == "age"){
            if(SearchObj.age==value+"" || SearchObj.age==undefined)
                ages.push(value+"");
            else
                ages.push(undefined);
        }
        if(str.split(':')[0] == "cell")
        {
            if(SearchObj.cell==value+"" || SearchObj.cell==undefined)
                cells.push(value+"");
            else
                cells.push(undefined);
        }
        if(str.split(':')[0] == "city")
        {
            if(SearchObj.city==value+""  || SearchObj.city==undefined)
                cities.push(value+"");
            else
                cities.push(undefined);
        }
        if(str.split(':')[0] == "coordLatitude")
        {
            if(SearchObj.coordLatitude==value+""  || SearchObj.coordLatitude==undefined)
                coordLatitudes.push(value+"");
            else
                coordLatitudes.push(undefined);
        }
        if(str.split(':')[0] == "coordLongitude")
        {
            if(SearchObj.coordLongitude==value+"" || SearchObj.coordLongitude==undefined)
                coordLongitudes.push(value+"");
            else
                coordLongitudes.push(undefined);
        }
        if(str.split(':')[0] == "country")
        {
            if(SearchObj.country==value+""  || SearchObj.country==undefined)
            countries.push(value+"");
            else
            countries.push(undefined);
        }
        if(str.split(':')[0] == "dateOfBirth")
        {
            if(SearchObj.dateOfBirth==value+""  || SearchObj.dateOfBirth==undefined)
                datesOfBirth.push(value+"");
            else
                datesOfBirth.push(undefined);
        }
        if(str.split(':')[0] == "descriptionTimeZone")
        {
            if(SearchObj.descriptionTimeZone==value+""  || SearchObj.descriptionsTimeZone==undefined)
                descriptionsTimeZone.push(value+"");
            else
                descriptionsTimeZone.push(undefined);
        }
        if(str.split(':')[0] == "documentName")
        {
            if(SearchObj.documentName==value+""  || SearchObj.documentNames==undefined)
                documentNames.push(value+"");
            else
                documentNames.push(undefined);
        }
        if(str.split(':')[0] == "documentValue")
        {
            if(SearchObj.documentValue==value+""  || SearchObj.documentValue==undefined)
                documentValues.push(value+"");
            else
                documentValues.push(undefined);
        }
        if(str.split(':')[0] == "email")
        {
            if(SearchObj.email==value+""  || SearchObj.email==undefined)
                emails.push(value+"");
            else
                emails.push(undefined);
        }
        if(str.split(':')[0] == "firstName")
        {
            if(SearchObj.firstName==value+""  || SearchObj.firstName==undefined)
            firstNames.push(value+"");
            else
            firstNames.push(undefined);
        }
        if(str.split(':')[0] == "gender")
        {
            if(SearchObj.gender==value+""  || SearchObj.gender==undefined)
            genders.push(value+"");
            else
            genders.push(undefined);
        }
        if(str.split(':')[0] == "id")
        {
            if(SearchObj.id==value+""  || SearchObj.id==undefined)
            id.push(value+"");
            else
            id.push(undefined);
        }
        if(str.split(':')[0] == "lastName")
        {
            if(SearchObj.lastName==value+""  || SearchObj.lastName==undefined)
            lastNames.push(value+"");
            else
            lastNames.push(undefined);
        }
        if(str.split(':')[0] == "national")
        {
            if(SearchObj.national==value+"" || SearchObj.national==undefined)
            nationals.push(value+"");
            else
            nationals.push(undefined);
        }
        if(str.split(':')[0] == "offsetTimeZone")
        {
            if(SearchObj.offsetTimeZone==value+"" || SearchObj.offsetTimeZone==undefined)
            offsetTimeZones.push(value+"");
            else
            offsetTimeZones.push(undefined);
        }
        if(str.split(':')[0] == "password")
        {
            if(SearchObj.password==value+""  || SearchObj.password==undefined)
            passwords.push(value+"");
            else
            passwords.push(undefined);
        }
        if(str.split(':')[0] == "phone")
        {
            if(SearchObj.phone==value+""  || SearchObj.phone==undefined)
            phones.push(value+"");
            else
            phones.push(undefined);
        }
        if(str.split(':')[0] == "picture")
        {
            if(SearchObj.picture==value+"" || SearchObj.picture==undefined)
            pictures.push(value+"");
            else
            pictures.push(undefined);
        }
        if(str.split(':')[0] == "postCode")
        {
            if(SearchObj.postCode==value+"" || SearchObj.postCode==undefined)
            postCodes.push(value+"");
            else
            postCodes.push(undefined);
        }
        if(str.split(':')[0] == "registredDate")
        {
            if(SearchObj.registredDate==value+"" || SearchObj.registredDate==undefined)
            registredDates.push(value+"");
            else
            registredDates.push(undefined);
        }
        if(str.split(':')[0] == "registredYear")
        {
            if(SearchObj.registredYear==value+"" || SearchObj.registredYear==undefined)
            registredYears.push(value+"");
            else
            registredYears.push(undefined);
        }
        if(str.split(':')[0] == "state")
        {
            if(SearchObj.state==value+""  || SearchObj.state==undefined)
            states.push(value+"");
            else
            states.push(undefined);
        }
        if(str.split(':')[0] == "streetName")
        {
            if(SearchObj.streetName==value+"" || SearchObj.streetName==undefined)
            streetNames.push(value+"");
            else
            streetNames.push(undefined);
        }
        if(str.split(':')[0] == "streetNumber")
        {
            if(SearchObj.streetNumber==value+"" || SearchObj.streetNumber==undefined)
            streetNumbers.push(value+"");
            else
            streetNumbers.push(undefined);
        }
        if(str.split(':')[0] == "titleName")
        {
            if(SearchObj.titleName==value+"" || SearchObj.titleName==undefined)
            titleNames.push(value+"");
            else
            titleNames.push(undefined);
        }
        if(str.split(':')[0] == "userName")
        {
            if(SearchObj.userName==value+"" || SearchObj.userName==undefined)
            userNames.push(value+"");
            else
            userNames.push(undefined);
        }
    }

    for(let i =0; i<id.length; i++){
        if(id[i]!=undefined && titleNames[i]!=undefined && firstNames[i]!=undefined && lastNames[i]!=undefined && genders[i]!=undefined && streetNames[i]!=undefined && streetNumbers[i]!=undefined && cities[i]!=undefined && states[i]!=undefined && countries[i]!=undefined && postCodes[i]!=undefined && coordLatitudes[i]!=undefined && coordLongitudes[i]!=undefined && offsetTimeZones[i]!=undefined && descriptionsTimeZone[i]!=undefined && nationals[i]!=undefined && cells[i]!=undefined && phones[i]!=undefined && emails[i]!=undefined && pictures[i]!=undefined && datesOfBirth[i]!=undefined && ages[i]!=undefined && documentNames[i]!=undefined &&  documentValues[i]!=undefined && userNames[i]!=undefined && passwords[i]!=undefined && registredDates[i]!=undefined && registredYears[i]!=undefined){

                    
            for(let j =0 ; j<columns.length; j++){
                        
                if(columns[j] == "titleName"){
                    db.put(`titleName:${id[i]}`, UpdateObj[columns[j]], function (err) {
                        if (err) return console.log('Ooops!', err)
                    })  
                }

                if(columns[j] == "firstName"){
                    db.put(`firstName:${id[i]}`, UpdateObj[columns[j]], function (err) {
                        if (err) return console.log('Ooops!', err)
                    })  
                }

                if(columns[j] == "lastName"){
                    db.put(`lastName:${id[i]}`, UpdateObj[columns[j]], function (err) {
                        if (err) return console.log('Ooops!', err)
                    })  
                }

                if(columns[j] == "gender"){
                    db.put(`gender:${id[i]}`, UpdateObj[columns[j]], function (err) {
                        if (err) return console.log('Ooops!', err)
                    })  
                }

                if(columns[j] == "streetName"){
                    db.put(`streetName:${id[i]}`, UpdateObj[columns[j]], function (err) {
                        if (err) return console.log('Ooops!', err)
                    })  
                }

                if(columns[j] == "streetNumber"){
                    db.put(`streetNumber:${id[i]}`, UpdateObj[columns[j]], function (err) {
                        if (err) return console.log('Ooops!', err)
                    })  
                }

                if(columns[j] == "city"){
                    db.put(`city:${id[i]}`, UpdateObj[columns[j]], function (err) {
                        if (err) return console.log('Ooops!', err)
                    })  
                }

                if(columns[j] == "state"){
                    db.put(`state:${id[i]}`, UpdateObj[columns[j]], function (err) {
                        if (err) return console.log('Ooops!', err)
                    })  
                }

                if(columns[j] == "country"){
                    db.put(`country:${id[i]}`, UpdateObj[columns[j]], function (err) {
                        if (err) return console.log('Ooops!', err)
                    })  
                }

                if(columns[j] == "postCode"){
                    db.put(`postCode:${id[i]}`, UpdateObj[columns[j]], function (err) {
                        if (err) return console.log('Ooops!', err)
                    })  
                }

                if(columns[j] == "coordLatitude"){
                    db.put(`coordLatitude:${id[i]}`, UpdateObj[columns[j]], function (err) {
                        if (err) return console.log('Ooops!', err)
                    })  
                }

                if(columns[j] == "coordLongitude"){
                    db.put(`coordLongitude:${id[i]}`, UpdateObj[columns[j]], function (err) {
                        if (err) return console.log('Ooops!', err)
                    })  
                }

                if(columns[j] == "offsetTimeZone"){
                    db.put(`offsetTimeZone:${id[i]}`, UpdateObj[columns[j]], function (err) {
                        if (err) return console.log('Ooops!', err)
                    })  
                }

                if(columns[j] == "descriptionTimeZone"){
                    db.put(`descriptionTimeZone:${id[i]}`, UpdateObj[columns[j]], function (err) {
                        if (err) return console.log('Ooops!', err)
                    })  
                }

                if(columns[j] == "national"){
                    db.put(`national:${id[i]}`, UpdateObj[columns[j]], function (err) {
                        if (err) return console.log('Ooops!', err)
                    })  
                }

                if(columns[j] == "cell"){
                    db.put(`cell:${id[i]}`, UpdateObj[columns[j]], function (err) {
                        if (err) return console.log('Ooops!', err)
                    })  
                }
                if(columns[j] == "phone"){
                    db.put(`phone:${id[i]}`, UpdateObj[columns[j]], function (err) {
                        if (err) return console.log('Ooops!', err)
                    })  
                }

                if(columns[j] == "email"){
                    db.put(`email:${id[i]}`, UpdateObj[columns[j]], function (err) {
                        if (err) return console.log('Ooops!', err)
                    })  
                }

                if(columns[j] == "picture"){
                    db.put(`picture:${id[i]}`, UpdateObj[columns[j]], function (err) {
                        if (err) return console.log('Ooops!', err)
                    })  
                }

                if(columns[j] == "dateOfBirth"){
                    db.put(`dateOfBirth:${id[i]}`, UpdateObj[columns[j]], function (err) {
                        if (err) return console.log('Ooops!', err)
                    })  
                }

                if(columns[j] == "age"){
                    db.put(`age:${id[i]}`, UpdateObj[columns[j]], function (err) {
                        if (err) return console.log('Ooops!', err)
                    })  
                }

                if(columns[j] == "documentName"){
                    db.put(`documentName:${id[i]}`, UpdateObj[columns[j]], function (err) {
                        if (err) return console.log('Ooops!', err)
                    })  
                }

                if(columns[j] == "value"){
                    db.put(`value:${id[i]}`, UpdateObj[columns[j]], function (err) {
                        if (err) return console.log('Ooops!', err)
                    })  
                }

                if(columns[j] == "userName"){
                    db.put(`userName:${id[i]}`, UpdateObj[columns[j]], function (err) {
                        if (err) return console.log('Ooops!', err)
                    })  
                }

                if(columns[j] == "password"){
                    db.put(`password:${id[i]}`, UpdateObj[columns[j]], function (err) {
                        if (err) return console.log('Ooops!', err)
                    })  
                }

                if(columns[j] == "registredDate"){
                    db.put(`registredDate:${id[i]}`, UpdateObj[columns[j]], function (err) {
                        if (err) return console.log('Ooops!', err)
                    })  
                }

                if(columns[j] == "registredYears"){
                    db.put(`registredYears:${id[i]}`, UpdateObj[columns[j]], function (err) {
                        if (err) return console.log('Ooops!', err)
                    })  
                }
            }      
        }
    }


    var end = new Date() - start;
    console.info('[LevelDB] Czas Updatowania danych: %dms', end);


}


// updateDataSqlite({id: 1},{firstName: "Marek", });
// updateDataNedb({_id:"0JsLME9vp5YJTiFC"}, {streetName: "Avenue Tony-Garnier2", firstName});
// updateDataLowDB({uuid: "04e258e5-2168-4d56-ade0-afcafbb58475"}, {email:"alfred.gibson@o2.pl", city:"Białystok"})
selectDataLevelDB({titleName: "Mrs"}, {picture:"chlopiec", dateOfBirth:"działa 3 !"})