@REM INSERT DATA, DELETE DATA, GET SIZE FILES
for /l %%x in (1, 1, 15) do (
node deleteAllData.js
node insertData.js 5000
node deleteData.js
@REM node getFileInfo.js
)