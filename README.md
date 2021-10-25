[![Build Status](https://app.travis-ci.com/AreonL/me-api.svg?branch=master)](https://app.travis-ci.com/AreonL/me-api)

# Hello there!
This is Me-Api for Jsramverk course

## Usages

#### npm start
starts the localhost on port 4000

#### npm test
runs the tests in test/route_testing.js

#### npm run setup
resets the database

#### npm run search
returns all the data in documents database

### -test
Använd -test framför en npm run för att köra test miljö
example: *npm run start-test*

## Routes
*/*
Index som start sida för databasen, bara en landning zon

*/document*
En GET metod för att få all information i databasen

*/document/create*
Skapar en document ny med POST metod
body application/json
__- requires__
>text
>name
>comments

*/document/update*
**POST** - Uppdaterar en document i databasen
__- requires__
>text
>_id

*/document/allow*
**POST** - Lägger till email adress till allowed_user i dokumentet
__- requires__
>addemail
>docId

*/document/comment*
**POST** - skapar kommentar
__- requires__
>comment
>docId
>position

**DELETE** - ta bort kommentar
__- requires__
>_id
>commentID

*/document/pdf*
**POST** - Skapar en buffer av documnetet
__- requires__
>text

*/code*
**GET** - All kod i databasen
**POST** - skapar kod
__- requires__
>name
>code

**PUT** - uppdaterar kod
__- requires__
>id
>code

**Alla request ovan behöver JWT**

*/login*
**POST** - loggar in usern
__- requires__
>email
>password

*/register*
**POST** - registerar usern
__- requires__
>email
>password

*/invite*
**POST** - invitar en ny usern via mail
__- requires__
>fromEmail
>toEmail
>docName
-- JWT
