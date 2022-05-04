@REM INSERT DATA, DELETE DATA, GET SIZE FILES
for /l %%x in (1, 1, 3) do (
node deleteAllData.js
node insertData.js 2000
node getFileInfo.js
)