[![Build Status](https://app.travis-ci.com/AreonL/me-api.svg?branch=master)](https://app.travis-ci.com/AreonL/me-api)

# Hello there!
This is Me-Api for Jsramverk course

## Usages

### npm start
starts the localhost on port 4000

### npm run setup
resets the database

### npm run search
returns all the data in documents database

## Routes
"/" är index som start sida för databasen, bara en landning zon

"/document" är en GET metod för att få all information i databasen

"/create" skapar en document ny med POST metod
body application/json
text och name måste vara med

"/update" updaterar en document i databasen med POST metoden
body application/json
text och _id måste vara med
