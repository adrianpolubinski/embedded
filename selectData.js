///////////////////////////////////////// Sqlite ////////////////////////////////////////
import sqlite3 from "sqlite3";
import fs from "fs";
const selectDataSqlite = (obj) => {
  var start = new Date();

  const isEmpty = Object.keys(obj).length === 0;

  let str = "";
  if (!isEmpty) {
    str = "where ";
    const columns = Object.keys(obj);
    for (let i = 0; i < columns.length; i++) {
      str +=
        i < columns.length - 1
          ? columns[i] + "='" + obj[columns[i]] + "' AND "
          : columns[i] + "='" + obj[columns[i]] + "'";
    }
  }
  var db4 = new sqlite3.Database("db/sqlite3.db");
  db4.each(
    `SELECT * FROM persons join addresses ON persons.id=addresses.id join documents ON persons.id=documents.person_id join accounts ON persons.id=accounts.person_id ${str}`,
    function (err, row) {
      // console.log(
      //   "id: " +
      //     row.id +
      //     ", titleName: " +
      //     row.titlename +
      //     ", firstName: " +
      //     row.firstname +
      //     ", lastName: " +
      //     row.lastname +
      //     ", gender: " +
      //     row.gender +
      //     ", streetName: " +
      //     row.streetname +
      //     ", streetNumber: " +
      //     row.streetnumber +
      //     ", city: " +
      //     row.city +
      //     ", state: " +
      //     row.state +
      //     ", country: " +
      //     row.country +
      //     ", postCode: " +
      //     row.postcode +
      //     ", coordLatitude: " +
      //     row.coordlatitude +
      //     ", coordLongitude: " +
      //     row.coordlongitude +
      //     ", offsetTimeZone: " +
      //     row.offsettimezone +
      //     ", descriptionTimeZone: " +
      //     row.descriptiontimezone +
      //     ", national: " +
      //     row.national +
      //     ", cell: " +
      //     row.cell +
      //     ", phone: " +
      //     row.phone +
      //     ", email: " +
      //     row.email +
      //     ", picture: " +
      //     row.picture +
      //     ", dateOfBirth: " +
      //     row.dateofbirth +
      //     ", age: " +
      //     row.age +
      //     ", documentName: " +
      //     row.name +
      //     ", value: " +
      //     row.value +
      //     ", userName: " +
      //     row.username +
      //     ", password: " +
      //     row.password +
      //     ", registredDate: " +
      //     row.registreddate +
      //     ", registredYears: " +
      //     row.registredyears
      // );
    },
    function () {
      var end = new Date() - start;
      fs.writeFile(
        "./badania/selectDataSqlite.txt",
        end + "\n",
        { flag: "a+" },
        (err) => {
          if (err) {
            console.error(err);
          }
        }
      );
    }
  );
};

//////////////////////////////////////////// Nedb ////////////////////////////////////////////

import Datastore from "nedb";

const selectDataNedb = (obj) => {
  var start = new Date();

  const columns = Object.keys(obj);

  const personsList = [
    "_id",
    "titleName",
    "firstName",
    "lastName",
    "gender",
    "national",
    "cell",
    "phone",
    "email",
    "picture",
    "dateOfBirth",
    "age",
  ];
  const accontsList = [
    "userName",
    "password",
    "registredDate",
    "registredYear",
  ];
  const addressesList = [
    "streetName",
    "streetNumber",
    "city",
    "state",
    "country",
    "postCode",
    "coordLatitude",
    "coordLongitude",
    "offsetTimeZone",
    "descriptionTimeZone",
  ];
  const documentsList = ["name", "value"];

  const personsObj = [];
  const accountsObj = [];
  const addressesObj = [];
  const documentsObj = [];

  for (let i = 0; i < columns.length; i++) {
    if (personsList.includes(columns[i])) {
      const temp = isNaN(obj[columns[i]])
        ? '"' + obj[columns[i]] + '"'
        : obj[columns[i]];
      personsObj.push(`"${columns[i]}": ${temp}`);
    }
    if (accontsList.includes(columns[i])) {
      const temp = isNaN(obj[columns[i]])
        ? '"' + obj[columns[i]] + '"'
        : obj[columns[i]];
      accountsObj.push(`"${columns[i]}": ${temp}`);
    }
    if (addressesList.includes(columns[i])) {
      const temp = isNaN(obj[columns[i]])
        ? '"' + obj[columns[i]] + '"'
        : obj[columns[i]];
      addressesObj.push(`"${columns[i]}": ${temp}`);
    }
    if (documentsList.includes(columns[i])) {
      const temp = isNaN(obj[columns[i]])
        ? '"' + obj[columns[i]] + '"'
        : obj[columns[i]];
      documentsObj.push(`"${columns[i]}": ${temp}`);
    }
  }

  let personStr = "";
  let addressStr = "";
  let accountStr = "";
  let documentStr = "";
  for (let i = 0; i < personsObj.length; i++) {
    i == personsObj.length - 1
      ? (personStr += personsObj[i])
      : (personStr += personsObj[i] + ",");
  }
  for (let i = 0; i < addressesObj.length; i++) {
    i == addressesObj.length - 1
      ? (addressStr += addressesObj[i])
      : (addressStr += addressesObj[i] + ",");
  }
  for (let i = 0; i < accountsObj.length; i++) {
    i == accountsObj.length - 1
      ? (accountStr += accountsObj[i])
      : (accountStr += accountsObj[i] + ",");
  }
  for (let i = 0; i < documentsObj.length; i++) {
    i == documentsObj.length - 1
      ? (documentStr += documentsObj[i])
      : (documentStr += documentsObj[i] + ",");
  }

  var db3 = {};

  db3.persons = new Datastore("db/nedb/persons.db");
  db3.accounts = new Datastore("db/nedb/accounts.db");
  db3.addresses = new Datastore("db/nedb/addresses.db");
  db3.documents = new Datastore("db/nedb/documents.db");

  db3.persons.loadDatabase();
  db3.accounts.loadDatabase();
  db3.addresses.loadDatabase();
  db3.documents.loadDatabase();

  const PersonObject = JSON.parse(`{${personStr}}`);
  db3.persons.find(PersonObject, function (err, docs) {
    let account = [];
    let address = [];
    let document = [];

    for (let i = 0; i < docs.length; i++) {
      const AddressObject =
        addressesObj.length != 0
          ? JSON.parse(`{"_id":"${docs[i].adress_id}", ${addressStr}}`)
          : JSON.parse(`{"_id":"${docs[i].adress_id}"}`);

      db3.addresses.findOne(AddressObject, function (err, doc) {
        if (doc != null) {
          address[i] = doc;

          const AccountObject =
            accountsObj.length != 0
              ? JSON.parse(`{"person_id":"${docs[i]._id}", ${accountStr}}`)
              : JSON.parse(`{"person_id":"${docs[i]._id}"}`);

          db3.accounts.findOne(AccountObject, function (err, doc) {
            if (doc != null) {
              account[i] = doc;

              const DocumentObject =
                documentsObj.length != 0
                  ? JSON.parse(`{"person_id":"${docs[i]._id}", ${documentStr}}`)
                  : JSON.parse(`{"person_id":"${docs[i]._id}"}`);

              db3.documents.findOne(DocumentObject, function (err, doc) {
                if (doc != null) {
                  document[i] = doc;

                  // console.log(
                  //   "id: " +
                  //     docs[i]._id +
                  //     ", titleName: " +
                  //     docs[i].titleName +
                  //     ", firstName: " +
                  //     docs[i].firstName +
                  //     ", lastName: " +
                  //     docs[i].lastName +
                  //     ", gender: " +
                  //     docs[i].gender +
                  //     ", streetName: " +
                  //     address[i].streetName +
                  //     ", streetNumber: " +
                  //     address[i].streetNumber +
                  //     ", city: " +
                  //     address[i].city +
                  //     ", state: " +
                  //     address[i].state +
                  //     ", country: " +
                  //     address[i].country +
                  //     ", postCode: " +
                  //     address[i].postCode +
                  //     ", coordLatitude: " +
                  //     address[i].coordLatitude +
                  //     ", coordLongitude: " +
                  //     address[i].coordLongitude +
                  //     ", offsetTimeZone: " +
                  //     address[i].offsetTimeZone +
                  //     ", descriptionTimeZone: " +
                  //     address[i].descriptionTimeZone +
                  //     ", national: " +
                  //     docs[i].national +
                  //     ", cell: " +
                  //     docs[i].cell +
                  //     ", phone: " +
                  //     docs[i].phone +
                  //     ", email: " +
                  //     docs[i].email +
                  //     ", picture: " +
                  //     docs[i].picture +
                  //     ", dateOfBirth: " +
                  //     docs[i].dateOfBirth +
                  //     ", age: " +
                  //     docs[i].age +
                  //     ", documentName: " +
                  //     document[i].name +
                  //     ", value: " +
                  //     document[i].value +
                  //     ", userName: " +
                  //     account[i].userName +
                  //     ", password: " +
                  //     account[i].password +
                  //     ", registredDate: " +
                  //     account[i].registredDate +
                  //     ", registredYears: " +
                  //     account[i].registredYear
                  // );
                }
                if (i == docs.length - 1) {
                  var end = new Date() - start;
                  fs.writeFile(
                    "./badania/selectDataNeDB.txt",
                    end + "\n",
                    { flag: "a+" },
                    (err) => {
                      if (err) {
                        console.error(err);
                      }
                    }
                  );
                }
              });
            }
          });
        }
      });
    }
  });
};

///////////////////////////////////////////////// LowDB //////////////////////////////////////////

class Name {
  constructor(titleName, firstName, lastName) {
    if (titleName != undefined) this.title = titleName;
    if (firstName != undefined) this.first = firstName;
    if (lastName != undefined) this.last = lastName;
  }
}

class Street {
  constructor(streetName, streetNumber) {
    if (streetname != undefined) this.name = streetName;
    if (streetNumber != undefined) this.number = streetNumber;
  }
}

class Coordiantes {
  constructor(coordLatitude, coordLongitude) {
    if (coordLatitude != undefined) this.latitude = coordLatitude;
    if (coordLongitude != undefined) this.longitude = coordLongitude;
  }
}

class Timezone {
  constructor(offsetTimeZone, descriptionTimeZone) {
    if (offsetTimeZone != undefined) this.offset = offsetTimeZone;
    if (descriptionTimeZone != undefined)
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
    if (streetName != undefined || streetNumber != undefined)
      this.street = new Street(streetName, streetNumber);
    if (city != undefined) this.city = city;
    if (state != undefined) this.state = state;
    if (country != undefined) this.country = country;
    if (postCode != undefined) this.postCode = postCode;
    if (coordLatitude != undefined || coordLongitude != undefined)
      this.coordinates = new Coordiantes(coordLatitude, coordLongitude);
    if (offsetTimeZone != undefined || descriptionTimeZone != undefined)
      this.timezone = new Timezone(offsetTimeZone, descriptionTimeZone);
  }
}

class Login {
  constructor(uuid, userName, password) {
    if (uuid != undefined) this.uuid = uuid;
    if (userName != undefined) this.userName = userName;
    if (password != undefined) this.password = password;
  }
}

class DateOfBirth {
  constructor(dateOfBirth, age) {
    if (dateOfBirth != undefined) this.date = dateOfBirth;
    if (age != undefined) this.age = age;
  }
}

class Registred {
  constructor(registredDate, registredYear) {
    if (registredDate != undefined) this.date = registredDate;
    if (registredYear != undefined) this.age = registredYear;
  }
}

class Id {
  constructor(documentName, documentValue) {
    if (documentName != undefined) this.name = documentName;
    if (documentValue != undefined) this.value = documentValue;
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
    if (gender != undefined) this.gender = gender;
    if (
      titleName != undefined ||
      firstName != undefined ||
      lastName != undefined
    )
      this.name = new Name(titleName, firstName, lastName);

    if (
      streetName != undefined ||
      streetNumber != undefined ||
      city != undefined ||
      state != undefined ||
      country != undefined ||
      postCode != undefined ||
      coordLatitude != undefined ||
      coordLongitude != undefined ||
      offsetTimeZone != undefined ||
      descriptionTimeZone != undefined
    )
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
    if (email != undefined) this.email = email;
    if (uuid != undefined || userName != undefined || password != undefined)
      this.login = new Login(uuid, userName, password);
    if (dateOfBirth != undefined || age != undefined)
      this.dateOfBirth = new DateOfBirth(dateOfBirth, age);
    if (registredDate != undefined || registredYear != undefined)
      this.registred = new Registred(registredDate, registredYear);
    if (phone != undefined) this.phone = phone;
    if (cell != undefined) this.cell = cell;
    if (documentName != undefined || documentValue != undefined)
      this.id = new Id(documentName, documentValue);
    if (picture != undefined) this.picture = picture;
    if (national != undefined) this.national = national;
  }
}

import { join, dirname } from "path";
import { Low, JSONFile } from "lowdb";
import { fileURLToPath } from "url";
import lodash from "lodash";

async function selectDataLowDB(obj) {
  var start = new Date();

  const SearchObj = new User(
    obj.gender,
    obj.titleName,
    obj.firstName,
    obj.lastName,
    obj.streetName,
    obj.streetNumber,
    obj.city,
    obj.state,
    obj.country,
    obj.postCode,
    obj.coordLatitude,
    obj.coordLongitude,
    obj.offsetTimeZone,
    obj.descriptionTimeZone,
    obj.email,
    obj.uuid,
    obj.userName,
    obj.password,
    obj.dateOfBirth,
    obj.age,
    obj.registredDate,
    obj.registredYear,
    obj.phone,
    obj.cell,
    obj.documentName,
    obj.documentValue,
    obj.picture,
    obj.national
  );

  const __dirname = dirname(fileURLToPath(import.meta.url));

  // Use JSON file for storage
  const file = join(__dirname, "db/lowdb.json");
  const adapter = new JSONFile(file);
  const db2 = new Low(adapter);

  await db2.read();
  db2.data ||= { users: [] };

  db2.chain = lodash.chain(db2.data);

  const users = db2.chain.get("users").filter(SearchObj).value();

  for (let i = 0; i < users.length; i++) {
    // console.log(
    //   "id: " +
    //     users[i].login.uuid +
    //     ", titleName: " +
    //     users[i].name.title +
    //     ", firstName: " +
    //     users[i].name.first +
    //     ", lastName: " +
    //     users[i].name.last +
    //     ", gender: " +
    //     users[i].gender +
    //     ", streetName: " +
    //     users[i].location.street.name +
    //     ", streetNumber: " +
    //     users[i].location.street.number +
    //     ", city: " +
    //     users[i].location.city +
    //     ", state: " +
    //     users[i].location.state +
    //     ", country: " +
    //     users[i].location.country +
    //     ", postCode: " +
    //     users[i].location.postCode +
    //     ", coordLatitude: " +
    //     users[i].location.coordinates.latitude +
    //     ", coordLongitude: " +
    //     users[i].location.coordinates.longitude +
    //     ", offsetTimeZone: " +
    //     users[i].location.timezone.offset +
    //     ", descriptionTimeZone: " +
    //     users[i].location.timezone.description +
    //     ", national: " +
    //     users[i].national +
    //     ", cell: " +
    //     users[i].cell +
    //     ", phone: " +
    //     users[i].phone +
    //     ", email: " +
    //     users[i].email +
    //     ", picture: " +
    //     users[i].picture +
    //     ", dateOfBirth: " +
    //     users[i].dateOfBirth.date +
    //     ", age: " +
    //     users[i].dateOfBirth.age +
    //     ", documentName: " +
    //     users[i].id.name +
    //     ", value: " +
    //     users[i].id.value +
    //     ", userName: " +
    //     users[i].login.userName +
    //     ", password: " +
    //     users[i].login.password +
    //     ", registredDate: " +
    //     users[i].registred.date +
    //     ", registredYears: " +
    //     users[i].registred.age
    // );
  }

  var end = new Date() - start;
  fs.writeFile(
    "./badania/selectDataLowDB.txt",
    end + "\n",
    { flag: "a+" },
    (err) => {
      if (err) {
        console.error(err);
      }
    }
  );
  // console.info("[LowDB] Czas wczytywania i wyswietlania danych: %dms", end);
}

////////////////////////////////////////////// LevelDB /////////////////////////////////////////////

import levelup from "levelup";
import leveldown from "leveldown";
import { copyFileSync } from "fs";

async function selectDataLevelDB(obj) {
  var start = new Date();

  var db = levelup(leveldown("db/levelDB"));

  const id = [];
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
    str = key + "";
    if (str.split(":")[0] == "age") {
      if (obj.age == value + "" || obj.age == undefined) ages.push(value + "");
      else ages.push(undefined);
    }
    if (str.split(":")[0] == "cell") {
      if (obj.cell == value + "" || obj.cell == undefined)
        cells.push(value + "");
      else cells.push(undefined);
    }
    if (str.split(":")[0] == "city") {
      if (obj.city == value + "" || obj.city == undefined)
        cities.push(value + "");
      else cities.push(undefined);
    }
    if (str.split(":")[0] == "coordLatitude") {
      if (obj.coordLatitude == value + "" || obj.coordLatitude == undefined)
        coordLatitudes.push(value + "");
      else coordLatitudes.push(undefined);
    }
    if (str.split(":")[0] == "coordLongitude") {
      if (obj.coordLongitude == value + "" || obj.coordLongitude == undefined)
        coordLongitudes.push(value + "");
      else coordLongitudes.push(undefined);
    }
    if (str.split(":")[0] == "country") {
      if (obj.country == value + "" || obj.country == undefined)
        countries.push(value + "");
      else countries.push(undefined);
    }
    if (str.split(":")[0] == "dateOfBirth") {
      if (obj.dateOfBirth == value + "" || obj.dateOfBirth == undefined)
        datesOfBirth.push(value + "");
      else datesOfBirth.push(undefined);
    }
    if (str.split(":")[0] == "descriptionTimeZone") {
      if (
        obj.descriptionTimeZone == value + "" ||
        obj.descriptionsTimeZone == undefined
      )
        descriptionsTimeZone.push(value + "");
      else descriptionsTimeZone.push(undefined);
    }
    if (str.split(":")[0] == "documentName") {
      if (obj.documentName == value + "" || obj.documentNames == undefined)
        documentNames.push(value + "");
      else documentNames.push(undefined);
    }
    if (str.split(":")[0] == "documentValue") {
      if (obj.documentValue == value + "" || obj.documentValue == undefined)
        documentValues.push(value + "");
      else documentValues.push(undefined);
    }
    if (str.split(":")[0] == "email") {
      if (obj.email == value + "" || obj.email == undefined)
        emails.push(value + "");
      else emails.push(undefined);
    }
    if (str.split(":")[0] == "firstName") {
      if (obj.firstName == value + "" || obj.firstName == undefined)
        firstNames.push(value + "");
      else firstNames.push(undefined);
    }
    if (str.split(":")[0] == "gender") {
      if (obj.gender == value + "" || obj.gender == undefined)
        genders.push(value + "");
      else genders.push(undefined);
    }
    if (str.split(":")[0] == "id") {
      if (obj.id == value + "" || obj.id == undefined) id.push(value + "");
      else id.push(undefined);
    }
    if (str.split(":")[0] == "lastName") {
      if (obj.lastName == value + "" || obj.lastName == undefined)
        lastNames.push(value + "");
      else lastNames.push(undefined);
    }
    if (str.split(":")[0] == "national") {
      if (obj.national == value + "" || obj.national == undefined)
        nationals.push(value + "");
      else nationals.push(undefined);
    }
    if (str.split(":")[0] == "offsetTimeZone") {
      if (obj.offsetTimeZone == value + "" || obj.offsetTimeZone == undefined)
        offsetTimeZones.push(value + "");
      else offsetTimeZones.push(undefined);
    }
    if (str.split(":")[0] == "password") {
      if (obj.password == value + "" || obj.password == undefined)
        passwords.push(value + "");
      else passwords.push(undefined);
    }
    if (str.split(":")[0] == "phone") {
      if (obj.phone == value + "" || obj.phone == undefined)
        phones.push(value + "");
      else phones.push(undefined);
    }
    if (str.split(":")[0] == "picture") {
      if (obj.picture == value + "" || obj.picture == undefined)
        pictures.push(value + "");
      else pictures.push(undefined);
    }
    if (str.split(":")[0] == "postCode") {
      if (obj.postCode == value + "" || obj.postCode == undefined)
        postCodes.push(value + "");
      else postCodes.push(undefined);
    }
    if (str.split(":")[0] == "registredDate") {
      if (obj.registredDate == value + "" || obj.registredDate == undefined)
        registredDates.push(value + "");
      else registredDates.push(undefined);
    }
    if (str.split(":")[0] == "registredYear") {
      if (obj.registredYear == value + "" || obj.registredYear == undefined)
        registredYears.push(value + "");
      else registredYears.push(undefined);
    }
    if (str.split(":")[0] == "state") {
      if (obj.state == value + "" || obj.state == undefined)
        states.push(value + "");
      else states.push(undefined);
    }
    if (str.split(":")[0] == "streetName") {
      if (obj.streetName == value + "" || obj.streetName == undefined)
        streetNames.push(value + "");
      else streetNames.push(undefined);
    }
    if (str.split(":")[0] == "streetNumber") {
      if (obj.streetNumber == value + "" || obj.streetNumber == undefined)
        streetNumbers.push(value + "");
      else streetNumbers.push(undefined);
    }
    if (str.split(":")[0] == "titleName") {
      if (obj.titleName == value + "" || obj.titleName == undefined)
        titleNames.push(value + "");
      else titleNames.push(undefined);
    }
    if (str.split(":")[0] == "userName") {
      if (obj.userName == value + "" || obj.userName == undefined)
        userNames.push(value + "");
      else userNames.push(undefined);
    }
  }
  for (let i = 0; i < id.length; i++) {
    if (
      id[i] != undefined &&
      titleNames[i] != undefined &&
      firstNames[i] != undefined &&
      lastNames[i] != undefined &&
      genders[i] != undefined &&
      streetNames[i] != undefined &&
      streetNumbers[i] != undefined &&
      cities[i] != undefined &&
      states[i] != undefined &&
      countries[i] != undefined &&
      postCodes[i] != undefined &&
      coordLatitudes[i] != undefined &&
      coordLongitudes[i] != undefined &&
      offsetTimeZones[i] != undefined &&
      descriptionsTimeZone[i] != undefined &&
      nationals[i] != undefined &&
      cells[i] != undefined &&
      phones[i] != undefined &&
      emails[i] != undefined &&
      pictures[i] != undefined &&
      datesOfBirth[i] != undefined &&
      ages[i] != undefined &&
      documentNames[i] != undefined &&
      documentValues[i] != undefined &&
      userNames[i] != undefined &&
      passwords[i] != undefined &&
      registredDates[i] != undefined &&
      registredYears[i] != undefined
    ) {
      // console.log(
      //   "id: " +
      //     id[i] +
      //     ", titleName: " +
      //     titleNames[i] +
      //     ", firstName: " +
      //     firstNames[i] +
      //     ", lastName: " +
      //     lastNames[i] +
      //     ", gender: " +
      //     genders[i] +
      //     ", streetName: " +
      //     streetNames[i] +
      //     ", streetNumber: " +
      //     streetNumbers[i] +
      //     ", city: " +
      //     cities[i] +
      //     ", state: " +
      //     states[i] +
      //     ", country: " +
      //     countries[i] +
      //     ", postCode: " +
      //     postCodes[i] +
      //     ", coordLatitude: " +
      //     coordLatitudes[i] +
      //     ", coordLongitude: " +
      //     coordLongitudes[i] +
      //     ", offsetTimeZone: " +
      //     offsetTimeZones[i] +
      //     ", descriptionTimeZone: " +
      //     descriptionsTimeZone[i] +
      //     ", national: " +
      //     nationals[i] +
      //     ", cell: " +
      //     cells[i] +
      //     ", phone: " +
      //     phones[i] +
      //     ", email: " +
      //     emails[i] +
      //     ", picture: " +
      //     pictures[i] +
      //     ", dateOfBirth: " +
      //     datesOfBirth[i] +
      //     ", age: " +
      //     ages[i] +
      //     ", documentName: " +
      //     documentNames[i] +
      //     ", value: " +
      //     documentValues[i] +
      //     ", userName: " +
      //     userNames[i] +
      //     ", password: " +
      //     passwords[i] +
      //     ", registredDate: " +
      //     registredDates[i] +
      //     ", registredYears: " +
      //     registredYears[i]
      // );
    }
  }
  var end = new Date() - start;
  fs.writeFile(
    "./badania/selectDataLevelDB.txt",
    end + "\n",
    { flag: "a+" },
    (err) => {
      if (err) {
        console.error(err);
      }
    }
  );
  // console.info("[LevelDB] Czas wczytywania i wyswietlania danych: %dms", end);
}

const obj = { gender: "female" };

selectDataSqlite(obj);
selectDataNedb(obj);
selectDataLowDB(obj);
selectDataLevelDB(obj);
