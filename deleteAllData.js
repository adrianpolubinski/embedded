//////////////////////////////////// Sqlite //////////////////////////////////////////////

import sqlite3 from 'sqlite3';

const deleteAllDataFromSqlite = () => {
    var start = new Date();
    var db4 = new sqlite3.Database('db/sqlite3.db');
    // polecenia w serialize wykonuja sie po kolei
    db4.serialize(function() {
        db4.run("delete from persons");
        db4.run("delete from accounts");
        db4.run("delete from addresses"); 
        db4.run("delete from documents", function(){
            var end = new Date() - start;
            console.info('[Sqlite] Czas usuwania danych: %dms', end);
            db4.close(); 
        });
    })
}


///////////////////////////////////////// nedb ///////////////////////////////////////

import Datastore from 'nedb';

const deleteAllDataFromNedb = () => {
    var start = new Date();

    const db3 = {};

    db3.persons = new Datastore('db/nedb/persons.db');
    db3.accounts = new Datastore('db/nedb/accounts.db');
    db3.addresses = new Datastore('db/nedb/addresses.db');
    db3.documents = new Datastore('db/nedb/documents.db');

    db3.persons.loadDatabase();
    db3.accounts.loadDatabase();
    db3.addresses.loadDatabase();
    db3.documents.loadDatabase();

    db3.persons.remove({}, {multi:true}, function (err, numRemoved){
        db3.persons.persistence.compactDatafile()
        var end = new Date() - start;
        console.info('[Nedb] Czas usuwania danych z kolekcji persons: %dms', end); 
    });
    db3.accounts.remove({}, {multi:true}, function (err, numRemoved){
        db3.accounts.persistence.compactDatafile()
        var end = new Date() - start;
        console.info('[Nedb] Czas usuwania danych z kolekcji accounts: %dms', end); 
    });
    db3.addresses.remove({}, {multi:true}, function (err, numRemoved){
        db3.addresses.persistence.compactDatafile()
        var end = new Date() - start;
        console.info('[Nedb] Czas usuwania danych z kolekcji addresses: %dms', end); 
    });
    db3.documents.remove({}, {multi:true}, function (err, numRemoved){
        db3.documents.persistence.compactDatafile()
        var end = new Date() - start;
        console.info('[Nedb] Czas usuwania danych z kolekcji documents: %dms', end); 
    }); 
}


///////////////////////////////////////////// LowDB /////////////////////////////////////////////////
import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'
import lodash from 'lodash'

async function deleteAllDataFromLowDB(){
    var start = new Date();

    const __dirname = dirname(fileURLToPath(import.meta.url));

    // Use JSON file for storage
    const file = join(__dirname, 'db/lowdb.json')
    const adapter = new JSONFile(file)
    const db2 = new Low(adapter)

    await db2.read();
    db2.chain = lodash.chain(db2.data.users)
    db2.chain
        .remove()
        .value()
    db2.write()
    .then(()=>{
        var end = new Date() - start;
        console.info('[LowDB] Czas usuwania danych: %dms', end); 
    });
}


//////////////////////////////////////////// levelDB ////////////////////////////////////////////////
import levelup from 'levelup';
import leveldown  from 'leveldown';

const deleteAllDataFromLevelDB = () => {
    var start = new Date();
    var db = levelup(leveldown('db/levelDB'))
    db.createReadStream()
      .on('data', function (data) {
            db.del(data.key, function (err) {
            if (err){console.log("Deleting error");}  
        });
      })
      .on('end', function () {
        var end = new Date() - start;
        console.info('[LevelDB] Czas usuwania danych: %dms', end); 
      })
}




deleteAllDataFromSqlite();
deleteAllDataFromNedb();
deleteAllDataFromLowDB();
deleteAllDataFromLevelDB();


