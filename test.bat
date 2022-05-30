@REM INSERT DATA, DELETE DATA, GET SIZE FILES
for /l %%x in (1, 1, 15) do (
node deleteAllData.js
node insertData.js 50
node getFileInfo.js
)