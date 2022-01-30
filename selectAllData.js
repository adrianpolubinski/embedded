///////////////////////////////////////// Sqlite ////////////////////////////////////////
import sqlite3 from 'sqlite3';

const selectAllDataSqlite = () => {
    var start = new Date();

    var db4 = new sqlite3.Database('db/sqlite3.db');

    db4.each("SELECT * FROM persons join addresses ON persons.id=addresses.id join documents ON persons.id=documents.person_id join accounts ON persons.id=accounts.person_id", function(err, row) {
        console.log("id: "+row.id + ", titleName: " + row.titlename +", firstName: " + row.firstname + ", lastName: "+ row.lastname +", gender: "+ row.gender+", streetName: "+row.streetname+", streetNumber: "+row.streetnumber+", city: "+row.city+", state: "+row.state+", country: "+row.country+", postCode: "+row.postcode+", coordLatitude: "+row.coordlatitude+", coordLongitude: "+row.coordlongitude+", offsetTimeZone: "+row.offsettimezone+", descriptionTimeZone: "+row.descriptiontimezone+", national: "+row.national+", cell: "+row.cell+", phone: "+row.phone+", email: "+row.email+", picture: "+row.picture+", dateOfBirth: "+row.dateofbirth+", age: "+row.age+", documentName: "+row.name+", value: "+row.value+", userName: "+row.username+", password: "+row.password+", registredDate: "+row.registreddate+", registredYears: "+row.registredyears);
    }, function(){
        var end = new Date() - start;
        console.info('[SQLite] Czas wczytywania i wyswietlania danych: %dms', end);
    });  
}


//////////////////////////////////////////// Nedb ////////////////////////////////////////////

import Datastore from 'nedb';

const selectAllDataNedb = () => {
    var start = new Date()

    var db3 = {};

    db3.persons = new Datastore('db/nedb/persons.db');
    db3.accounts = new Datastore('db/nedb/accounts.db');
    db3.addresses = new Datastore('db/nedb/addresses.db');
    db3.documents = new Datastore('db/nedb/documents.db');

    db3.persons.loadDatabase();
    db3.accounts.loadDatabase();
    db3.addresses.loadDatabase();
    db3.documents.loadDatabase();


    db3.persons.find({}, function (err, docs) {
        let account = [];
        let address = [];
        let document = [];

        for(let i = 0; i < docs.length; i++)
        {
            db3.addresses.findOne({ _id: docs[i].adress_id }, function (err, doc) {
                address[i] = doc;
                db3.accounts.findOne({ person_id: docs[i]._id }, function (err, doc) {
                    account[i] = doc;
                    db3.documents.findOne({ person_id: docs[i]._id }, function (err, doc) {
                        document[i]= doc;

                        console.log("id: "+docs[i]._id + ", titleName: " + docs[i].titleName +", firstName: " + docs[i].firstName + ", lastName: "+ docs[i].lastName +", gender: "+ docs[i].gender+", streetName: "+address[i].streetName+", streetNumber: "+address[i].streetNumber+", city: "+address[i].city+", state: "+address[i].state+", country: "+address[i].country+", postCode: "+address[i].postCode+", coordLatitude: "+address[i].coordLatitude+", coordLongitude: "+address[i].coordLongitude+", offsetTimeZone: "+address[i].offsetTimeZone+", descriptionTimeZone: "+address[i].descriptionTimeZone+", national: "+docs[i].national+", cell: "+docs[i].cell+", phone: "+docs[i].phone+", email: "+docs[i].email+", picture: "+docs[i].picture+", dateOfBirth: "+docs[i].dateOfBirth+", age: "+docs[i].age+", documentName: "+document[i].name+", value: "+document[i].value+", userName: "+account[i].userName+", password: "+account[i].password+", registredDate: "+account[i].registredDate+", registredYears: "+account[i].registredYear);

                        if(i==docs.length-1){
                            var end = new Date() - start;
                            console.info('[Nedb] Czas wczytywania i wyswietlania danych: %dms', end);
                        }
                    });
                });
            });           
            
        }
    });
}



///////////////////////////////////////////////// LowDB //////////////////////////////////////////


import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'
import lodash from 'lodash'

async function selectAllDataLowDB(){
    var start = new Date();

    const __dirname = dirname(fileURLToPath(import.meta.url));

    // Use JSON file for storage
    const file = join(__dirname, 'db/lowdb.json')
    const adapter = new JSONFile(file)
    const db2 = new Low(adapter)

    await db2.read();
    db2.data ||= { users: [] };

    db2.chain = lodash.chain(db2.data)

    const users = db2.chain
    .get('users')
    // .find({})
    .value()

    for(let i =0; i<users.length; i++){
        console.log("id: "+users[i].login.uuid + ", titleName: " + users[i].name.title +", firstName: " + users[i].name.first + ", lastName: "+ users[i].name.last +", gender: "+ users[i].gender+", streetName: "+users[i].location.street.name+", streetNumber: "+users[i].location.street.number+", city: "+users[i].location.city+", state: "+users[i].location.state+", country: "+users[i].location.country+", postCode: "+users[i].location.postCode+", coordLatitude: "+users[i].location.coordinates.latitude+", coordLongitude: "+users[i].location.coordinates.longitude+", offsetTimeZone: "+users[i].location.timezone.offset+", descriptionTimeZone: "+users[i].location.timezone.description+", national: "+users[i].national+", cell: "+users[i].cell+", phone: "+users[i].phone+", email: "+users[i].email+", picture: "+users[i].picture+", dateOfBirth: "+users[i].dateOfBirth.date+", age: "+users[i].dateOfBirth.age+", documentName: "+users[i].id.name+", value: "+users[i].id.value+", userName: "+users[i].login.userName+", password: "+users[i].login.password+", registredDate: "+users[i].registred.date+", registredYears: "+users[i].registred.age);
    }
    

    var end = new Date() - start;
    console.info('[LowDB] Czas wczytywania i wyswietlania danych: %dms', end); 
}


////////////////////////////////////////////// LevelDB /////////////////////////////////////////////


import levelup from 'levelup';
import leveldown  from 'leveldown';
import { Console } from 'console';

const selectAllDataLevelDB = () => {
    var start = new Date();

    var db = levelup(leveldown('db/levelDB'))

    const keys = [];

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
    
    let count=0;
    let i=0;
    db.createKeyStream()
    .on('data', function (data) {
        if(i%27==0) count++;
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
                db.get(`titleName:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    titleNames.push(value);
                })
                db.get(`firstName:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    firstNames.push(value);
                })
                db.get(`lastName:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    lastNames.push(value);
                })
                db.get(`gender:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    genders.push(value);
                })
                db.get(`national:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    nationals.push(value);
                })
                db.get(`cell:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    cells.push(value);
                })
                db.get(`phone:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    phones.push(value);
                })
                db.get(`email:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    emails.push(value);
                })
                db.get(`picture:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    pictures.push(value);
                })
                db.get(`dateOfBirth:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    datesOfBirth.push(value);
                })
                db.get(`age:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    ages.push(value);
                })
                db.get(`streetName:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    streetNames.push(value);
                })
                db.get(`streetNumber:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    streetNumbers.push(value);
                })
                db.get(`city:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    cities.push(value);
                })
                db.get(`state:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    states.push(value);
                })
                db.get(`country:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    countries.push(value);
                })
                db.get(`postCode:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    postCodes.push(value);
                })
                db.get(`coordLatitude:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    coordLatitudes.push(value);
                })
                db.get(`coordLongitude:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    coordLongitudes.push(value);
                })
                db.get(`offsetTimeZone:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    offsetTimeZones.push(value);
                })
                db.get(`descriptionTimeZone:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    descriptionsTimeZone.push(value);
                })
                db.get(`documentName:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    documentNames.push(value);
                })
                db.get(`documentValue:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    documentValues.push(value);
                })
                db.get(`userName:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    userNames.push(value);
                })
                db.get(`password:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    passwords.push(value);
                })
                db.get(`registredDate:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    registredDates.push(value);
                })
                db.get(`registredYear:${keys[i]}`, function (err, value) {
                    if (err) return console.log('Ooops!', err)
                    registredYears.push(value);

                    console.log("id: "+keys[i]+ ", titleName: " + titleNames[i] +", firstName: " + firstNames[i] + ", lastName: "+ lastNames[i] +", gender: "+ genders[i]+", streetName: "+streetNames[i]+", streetNumber: "+streetNumbers[i]+", city: "+cities[i]+", state: "+states[i]+", country: "+countries[i]+", postCode: "+postCodes[i]+", coordLatitude: "+coordLatitudes[i]+", coordLongitude: "+coordLongitudes[i]+", offsetTimeZone: "+offsetTimeZones[i]+", descriptionTimeZone: "+descriptionsTimeZone[i]+", national: "+nationals[i]+", cell: "+cells[i]+", phone: "+phones[i]+", email: "+emails[i]+", picture: "+pictures[i]+", dateOfBirth: "+datesOfBirth[i]+", age: "+ages[i]+", documentName: "+documentNames[i]+", value: "+documentValues[i]+", userName: "+userNames[i]+", password: "+passwords[i]+", registredDate: "+registredDates[i]+", registredYears: "+registredYears[i]);
                    
                    if(i==keys.length-1){
                        var end = new Date() - start;
                        console.info('[LevelDB] Czas wczytywania i wyswietlania danych: %dms', end); 
                    }
                })
            }
        }) 
    })

}

selectAllDataSqlite();
selectAllDataNedb();
selectAllDataLowDB();
selectAllDataLevelDB();

