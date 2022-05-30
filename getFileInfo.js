import fs from "fs";
fs.stat("db/sqlite3.db", (err, stats) => {
  if (err) {
    console.log(`File doesn't exist.`);
  } else {
    fs.writeFile(
      "./badania/fileSizeSqlite.txt",
      stats.size + "\n",
      { flag: "a+" },
      (err) => {
        if (err) {
          console.error(err);
        }
      }
    );
  }
});

// const files = fs.readdirSync("./db/nedb");
// let suma = 0;
// let licznik = 0;

// files.forEach(function (file) {
//   fs.stat("./db/nedb/" + file, (err, stats) => {
//     suma += stats.size;

//     if (licznik == files.length - 1) {
//       fs.writeFile(
//         "./badania/fileSizeNeDB.txt",
//         suma + "\n",
//         { flag: "a+" },
//         (err) => {
//           if (err) {
//             console.error(err);
//           }
//         }
//       );
//     }
//     licznik++;
//   });
// });

// fs.stat("db/lowdb.json", (err, stats) => {
//   if (err) {
//     console.log(`File doesn't exist.`);
//   } else {
//     fs.writeFile(
//       "./badania/fileSizeLowDB.txt",
//       stats.size + "\n",
//       { flag: "a+" },
//       (err) => {
//         if (err) {
//           console.error(err);
//         }
//       }
//     );
//   }
// });

// const files2 = fs.readdirSync("./db/levelDB");
// let suma2 = 0;
// let licznik2 = 0;
// files2.forEach(function (file) {
//   fs.stat("./db/levelDB/" + file, (err, stats) => {
//     suma2 += stats.size;
//     if (licznik2 == files2.length - 1) {
//       fs.writeFile(
//         "./badania/fileSizeLevelDB.txt",
//         suma2 + "\n",
//         { flag: "a+" },
//         (err) => {
//           if (err) {
//             console.error(err);
//           }
//         }
//       );
//     }
//     licznik2++;
//   });
// });
