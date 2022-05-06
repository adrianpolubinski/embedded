import fetch from "node-fetch";
import fs from "fs";

const usersCount = process.argv[2];

const response = await fetch(
  `https://randomuser.me/api/?results=${usersCount}&nat=US,ES,FR,NL,GB,FI,IE,AU,CH,DK,NO`
);
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

// documents data
const documentNames = [];
const documentValues = [];

// accounts data
const userNames = [];
const passwords = [];
const registredDates = [];
const registredYears = [];

// uuids
const uuids = [];

for (let i = 0; i < results.length; i++) {
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

  documentNames.push(results[i].id.name);
  documentValues.push(results[i].id.value);

  userNames.push(results[i].login.username);
  passwords.push(results[i].login.password);
  registredDates.push(results[i].registered.date);
  registredYears.push(results[i].registered.age);

  uuids[i] = results[i].login.uuid;
}

// SQLITE INSERT ROWS
import sqlite3 from "sqlite3";

var db4;
let globalStartSqlite;
let addressesId = [];
let personsId = [];

const addAccounts = () => {
  var stmt = db4.prepare(
    "INSERT INTO accounts(person_id, username, password, registreddate, registredyears) VALUES (?, ?, ?, ?, ?)"
  );
  for (let i = 0; i < results.length; i++) {
    stmt.run(
      personsId[i],
      userNames[i],
      passwords[i],
      registredDates[i],
      registredYears[i]
    );
  }
  stmt.finalize(() => {
    var globalEnd = new Date() - globalStartSqlite;
    // fs.writeFile(
    //   "./badania/insertSqlite.txt",
    //   globalEnd + "\n",
    //   { flag: "a+" },
    //   (err) => {
    //     if (err) {
    //       console.error(err);
    //     }
    //   }
    // );
    // console.info("[Sqlite] Łączny czas wstawiania danych: %dms", globalEnd);

    db4.close();
  });
};

const addDocuments = () => {
  var stmt = db4.prepare(
    "INSERT INTO documents(person_id, name, value) VALUES (?, ?, ?)"
  );
  for (let i = 0; i < results.length; i++) {
    stmt.run(personsId[i], documentNames[i], documentValues[i]);
  }
  stmt.finalize(() => {
    addAccounts();
  });
};

const getIdperson = () => {
  db4.each(
    `select id from persons order by id desc limit ${results.length}`,
    function (err, row) {
      personsId.push(row.id);
    },
    function () {
      personsId.reverse();
      addDocuments();
    }
  );
};

// insert to persons table
const addPersons = () => {
  var stmt = db4.prepare(
    "INSERT INTO persons(titlename, firstName, lastName, gender, adress_id, national, cell, phone, email, picture, dateofbirth, age) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  );
  for (let i = 0; i < results.length; i++) {
    stmt.run(
      titleNames[i],
      firstNames[i],
      lastNames[i],
      genders[i],
      addressesId[i],
      nationals[i],
      cells[i],
      phones[i],
      emails[i],
      pictures[i],
      datesOfBirth[i],
      ages[i]
    );
  }
  stmt.finalize(() => {
    getIdperson();
  });
};

// get new id from adresses
const getIdAddress = () => {
  db4.each(
    `select id from addresses order by id desc limit ${results.length}`,
    function (err, row) {
      addressesId.push(row.id);
    },
    function () {
      addressesId.reverse();
      addPersons();
    }
  );
};

// insert to addresses table
const insertDataToSqlite = () => {
  globalStartSqlite = new Date();
  db4 = new sqlite3.Database("db/sqlite3.db");
  var stmt = db4.prepare(
    "INSERT INTO addresses(streetname, streetnumber, city, state, country, postcode, coordlatitude, coordlongitude, offsettimezone, descriptiontimezone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  );
  for (let i = 0; i < results.length; i++) {
    stmt.run(
      streetNames[i],
      streetNumbers[i],
      cities[i],
      states[i],
      countries[i],
      postCodes[i],
      coordLatitudes[i],
      coordLongitudes[i],
      offsetTimeZones[i],
      descriptionsTimeZone[i]
    );
  }
  stmt.finalize(() => {
    getIdAddress();
  });
};

// NEDB insert rows
class Address {
  constructor(
    streetName,
    streetNumber,
    city,
    state,
    country,
    postCode,
    coordLatitude,
    coordLongitude,
    offsetTimeZone,
    descriptionTimeZone
  ) {
    this.streetName = streetName;
    this.streetNumber = streetNumber;
    this.city = city;
    this.state = state;
    this.country = country;
    this.postCode = postCode;
    this.coordLatitude = coordLatitude;
    this.coordLongitude = coordLongitude;
    this.offsetTimeZone = offsetTimeZone;
    this.descriptionTimeZone = descriptionTimeZone;
  }
}

class Person {
  constructor(
    titleName,
    firstName,
    lastName,
    gender,
    adress_id,
    national,
    cell,
    phone,
    email,
    picture,
    dateOfBirth,
    age
  ) {
    this.titleName = titleName;
    this.firstName = firstName;
    this.lastName = lastName;
    this.gender = gender;
    this.adress_id = adress_id;
    this.national = national;
    this.cell = cell;
    this.phone = phone;
    this.email = email;
    this.picture = picture;
    this.dateOfBirth = dateOfBirth;
    this.age = age;
  }
}

class Document {
  constructor(person_id, name, value) {
    this.person_id = person_id;
    this.name = name;
    this.value = value;
  }
}

class Account {
  constructor(person_id, userName, password, registredDate, registredYear) {
    this.person_id = person_id;
    this.userName = userName;
    this.password = password;
    this.registredDate = registredDate;
    this.registredYear = registredYear;
  }
}

import Datastore from "nedb";

let globalStart;
let db3;
const addressesIdMongo = [];
const personsIdMongo = [];

const addAccountsMongo = () => {
  for (let i = 0; i < results.length; i++)
    db3.accounts.insert(
      new Account(
        personsIdMongo[i],
        userNames[i],
        passwords[i],
        registredDates[i],
        registredYears[i]
      ),
      function (err, newDocs) {
        if (i == results.length - 1) {
          var globalEnd = new Date() - globalStart;
          // fs.writeFile(
          //   "./badania/insertNeDB.txt",
          //   globalEnd + "\n",
          //   { flag: "a+" },
          //   (err) => {
          //     if (err) {
          //       console.error(err);
          //     }
          //   }
          // );
          // console.info("[Nedb] Łączny czas wstawiania danych: %dms", globalEnd);
        }
      }
    );
};

const addDocumentsMongo = () => {
  for (let i = 0; i < results.length; i++)
    db3.documents.insert(
      new Document(personsIdMongo[i], documentNames[i], documentValues[i]),
      function (err, newDocs) {
        if (i == results.length - 1) {
          addAccountsMongo();
        }
      }
    );
};

const addPersonsMongo = () => {
  for (let i = 0; i < results.length; i++)
    db3.persons.insert(
      new Person(
        titleNames[i],
        firstNames[i],
        lastNames[i],
        genders[i],
        addressesIdMongo[i],
        nationals[i],
        cells[i],
        phones[i],
        emails[i],
        pictures[i],
        datesOfBirth[i],
        ages[i]
      ),
      function (err, newDocs) {
        personsIdMongo.push(newDocs._id);
        if (i == results.length - 1) {
          addDocumentsMongo();
        }
      }
    );
};

const insertDataToNedb = () => {
  globalStart = new Date();

  db3 = {};

  db3.persons = new Datastore("db/nedb/persons.db");
  db3.accounts = new Datastore("db/nedb/accounts.db");
  db3.addresses = new Datastore("db/nedb/addresses.db");
  db3.documents = new Datastore("db/nedb/documents.db");

  db3.persons.loadDatabase();
  db3.accounts.loadDatabase();
  db3.addresses.loadDatabase();
  db3.documents.loadDatabase();

  for (let i = 0; i < results.length; i++)
    db3.addresses.insert(
      new Address(
        streetNames[i],
        streetNumbers[i],
        cities[i],
        states[i],
        countries[i],
        postCodes[i],
        coordLatitudes[i],
        coordLongitudes[i],
        offsetTimeZones[i],
        descriptionsTimeZone[i]
      ),
      function (err, newDocs) {
        addressesIdMongo.push(newDocs._id);
        if (i == results.length - 1) {
          addPersonsMongo();
        }
      }
    );
};

///////////////////////////////////////////////// LowDB //////////////////////////////////////////////////////////

class Name {
  constructor(titleName, firstName, lastName) {
    this.title = titleName;
    this.first = firstName;
    this.last = lastName;
  }
}

class Street {
  constructor(streetName, streetNumber) {
    this.name = streetName;
    this.number = streetNumber;
  }
}

class Coordiantes {
  constructor(coordLatitude, coordLongitude) {
    this.latitude = coordLatitude;
    this.longitude = coordLongitude;
  }
}

class Timezone {
  constructor(offsetTimeZone, descriptionTimeZone) {
    this.offset = offsetTimeZone;
    this.description = descriptionTimeZone;
  }
}

class Location {
  constructor(
    streetName,
    streetNumber,
    city,
    state,
    country,
    postCode,
    coordLatitude,
    coordLongitude,
    offsetTimeZone,
    descriptionTimeZone
  ) {
    this.street = new Street(streetName, streetNumber);
    this.city = city;
    this.state = state;
    this.country = country;
    this.postCode = postCode;
    this.coordinates = new Coordiantes(coordLatitude, coordLongitude);
    this.timezone = new Timezone(offsetTimeZone, descriptionTimeZone);
  }
}

class Login {
  constructor(uuid, userName, password) {
    this.uuid = uuid;
    this.userName = userName;
    this.password = password;
  }
}

class DateOfBirth {
  constructor(dateOfBirth, age) {
    this.date = dateOfBirth;
    this.age = age;
  }
}

class Registred {
  constructor(registredDate, registredYear) {
    this.date = registredDate;
    this.age = registredYear;
  }
}

class Id {
  constructor(documentName, documentValue) {
    this.name = documentName;
    this.value = documentValue;
  }
}

class User {
  constructor(
    gender,
    titleName,
    firstName,
    lastName,
    streetName,
    streetNumber,
    city,
    state,
    country,
    postCode,
    coordLatitude,
    coordLongitude,
    offsetTimeZone,
    descriptionTimeZone,
    email,
    uuid,
    userName,
    password,
    dateOfBirth,
    age,
    registredDate,
    registredYear,
    phone,
    cell,
    documentName,
    documentValue,
    picture,
    national
  ) {
    this.gender = gender;
    this.name = new Name(titleName, firstName, lastName);
    this.location = new Location(
      streetName,
      streetNumber,
      city,
      state,
      country,
      postCode,
      coordLatitude,
      coordLongitude,
      offsetTimeZone,
      descriptionTimeZone
    );
    this.email = email;
    this.login = new Login(uuid, userName, password);
    this.dateOfBirth = new DateOfBirth(dateOfBirth, age);
    this.registred = new Registred(registredDate, registredYear);
    this.phone = phone;
    this.cell = cell;
    this.id = new Id(documentName, documentValue);
    this.picture = picture;
    this.national = national;
  }
}

import { join, dirname } from "path";
import { Low, JSONFile } from "lowdb";
import { fileURLToPath } from "url";

async function insertDataToLowDB() {
  var start = new Date();

  const __dirname = dirname(fileURLToPath(import.meta.url));

  // Use JSON file for storage
  const file = join(__dirname, "db/lowdb.json");
  const adapter = new JSONFile(file);
  const db2 = new Low(adapter);

  await db2.read();

  db2.data ||= { users: [] };

  for (let i = 0; i < results.length; i++)
    db2.data.users.push(
      new User(
        genders[i],
        titleNames[i],
        firstNames[i],
        lastNames[i],
        streetNames[i],
        streetNumbers[i],
        cities[i],
        states[i],
        countries[i],
        postCodes[i],
        coordLatitudes[i],
        coordLongitudes[i],
        offsetTimeZones[i],
        descriptionsTimeZone[i],
        emails[i],
        uuids[i],
        userNames[i],
        passwords[i],
        datesOfBirth[i],
        ages[i],
        registredDates[i],
        registredYears[i],
        phones[i],
        cells[i],
        documentNames[i],
        documentValues[i],
        pictures[i],
        nationals[i]
      )
    );

  db2.write();

  var end = new Date() - start;
  // fs.writeFile(
  //   "./badania/insertLowDB.txt",
  //   end + "\n",
  //   { flag: "a+" },
  //   (err) => {
  //     if (err) {
  //       console.error(err);
  //     }
  //   }
  // );
  // console.info("[LowDB] Czas wstawiania danych: %dms", end);
}

/////////////////////////////////////// LevelDB ///////////////////////////////////////////////

import levelup from "levelup";
import leveldown from "leveldown";

const insertDataToLevelDB = () => {
  var start = new Date();

  var db = levelup(leveldown("db/levelDB"));
  for (let i = 0; i < results.length; i++) {
    const ops = [
      { type: "put", key: `id:${uuids[i]}`, value: uuids[i] },
      { type: "put", key: `titleName:${uuids[i]}`, value: titleNames[i] },
      { type: "put", key: `firstName:${uuids[i]}`, value: firstNames[i] },
      { type: "put", key: `lastName:${uuids[i]}`, value: lastNames[i] },
      { type: "put", key: `gender:${uuids[i]}`, value: genders[i] },
      { type: "put", key: `national:${uuids[i]}`, value: nationals[i] },
      { type: "put", key: `cell:${uuids[i]}`, value: cells[i] },
      { type: "put", key: `phone:${uuids[i]}`, value: phones[i] },
      { type: "put", key: `email:${uuids[i]}`, value: emails[i] },
      { type: "put", key: `picture:${uuids[i]}`, value: pictures[i] },
      { type: "put", key: `dateOfBirth:${uuids[i]}`, value: datesOfBirth[i] },
      { type: "put", key: `age:${uuids[i]}`, value: ages[i] },
      { type: "put", key: `streetName:${uuids[i]}`, value: streetNames[i] },
      { type: "put", key: `streetNumber:${uuids[i]}`, value: streetNumbers[i] },
      { type: "put", key: `city:${uuids[i]}`, value: cities[i] },
      { type: "put", key: `state:${uuids[i]}`, value: states[i] },
      { type: "put", key: `country:${uuids[i]}`, value: countries[i] },
      { type: "put", key: `postCode:${uuids[i]}`, value: postCodes[i] },
      {
        type: "put",
        key: `coordLatitude:${uuids[i]}`,
        value: coordLatitudes[i],
      },
      {
        type: "put",
        key: `coordLongitude:${uuids[i]}`,
        value: coordLongitudes[i],
      },
      {
        type: "put",
        key: `offsetTimeZone:${uuids[i]}`,
        value: offsetTimeZones[i],
      },
      {
        type: "put",
        key: `descriptionTimeZone:${uuids[i]}`,
        value: descriptionsTimeZone[i],
      },
      { type: "put", key: `documentName:${uuids[i]}`, value: documentNames[i] },
      {
        type: "put",
        key: `documentValue:${uuids[i]}`,
        value: documentValues[i],
      },
      { type: "put", key: `userName:${uuids[i]}`, value: userNames[i] },
      { type: "put", key: `password:${uuids[i]}`, value: passwords[i] },
      {
        type: "put",
        key: `registredDate:${uuids[i]}`,
        value: registredDates[i],
      },
      {
        type: "put",
        key: `registredYear:${uuids[i]}`,
        value: registredYears[i],
      },
    ];

    db.batch(ops, function (err) {
      if (err) return console.log("Ooops!", err);
    });
  }

  var end = new Date() - start;
  // fs.writeFile(
  //   "./badania/insertLevelDB.txt",
  //   end + "\n",
  //   { flag: "a+" },
  //   (err) => {
  //     if (err) {
  //       console.error(err);
  //     }
  //   }
  // );
  // console.info("[LevelDB] Czas wstawiania danych: %dms", end);
};

insertDataToSqlite();
insertDataToNedb();
insertDataToLowDB();
insertDataToLevelDB();
