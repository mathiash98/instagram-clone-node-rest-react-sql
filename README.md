# instagram-clone-node-rest-react-sql
Instagram clone using nodejs+mariadb backend for REST API and React front end


## Goal of project
Make a proper project with react and a sql database. I was also interested in differentiating sql and nosql databases.


## Technologies
#### Backend:
* NodeJs
* Express
* MariaDB, saving images inside the database
* REST API with JWT tokens for authentication

#### Front-end
* ReactJS
* Fetch for ajax calls


## What I learned
Building sql queries by hand is complicated, especially when you want to have dynamic queries and multiple data types.

React is growing good on me, starting to understand the concepts of data flows and getting comfortable with how I should structure my code. 

Building "classes"/APIs on frontend like on backend for accessing data makes accessing data easy and clean.

## What I would change next time
* Use a sql query builder - Hard to build advanced queries using just strings.
* Try out another backend framework like .net Core, but NodeJs is working good for me and I'm getting quite comfortable with the node+express combination.
* I would use another method of storing images, as far as I know the mysql client for nodejs does not have a method of streaming blobs to and from the database. This makes me having to store all the images in the ram before serving them to the user. This method will not scale in the long run. MongoDB has a method of streaming using the GridFS. I could store the images on the file system, but I don't see that as a scalable solution considering harder to backup etc. Using something like Azure Blob Storage og AWS S3 would be perfect.


# Setup
```
Install and run a sql server like MariaDB
Run db.sql script to setup database
configure config.js for your preferences
```

# Testing
```
#./backend:
npm install
node index

#./react-client
npm install
npm start
```
You can now login with username: 'mathias' password 't'