
#  MateMegic

APIs using node.js, express.js, and MongoDB.

##  Software Specs

**Operating Environment:**
-  Windows, macOS  

**Technologies Used:**

>Node.js
```
v14.15.3
```

>Express.js
```
4.17.1
```

>Npm
```
8.0.0
```

##  Installation of dependency

###  mongoDB

####  Windows

Download mongoDB from [MongoDB Download Center](https://www.mongodb.com/try/download/community?tck=docs_server)

-  In the Version dropdown, select the version of MongoDB to download.

-  In the Platform dropdown, select Windows.

-  In the Package dropdown, select msi.

-  Click Download.

####  Mac

Download the official [Homebrew](https://github.com/mongodb/homebrew-brew) for MongoDB
```
brew tap mongodb/brew
```

run the following command in your macOS Terminal
```
brew install mongodb-community@5.0
```

>  Alternatively, you can specify a previous version of MongoDB if desired.

###  node.js

Download Node.js from [node and npm](https://nodejs.org/en/)

After installing node.js, this project will need yarn too, so just run the following command.

**Yarn installation**

```
$ npm install -g yarn
```

##  Installation of APIs

**Step 1:** clone the repo & cd into the [project](https://github.com/Nisarg-Katrodiya/node_boilerplate)

**Step 2:** install node modules

```
yarn install
```

Running the project

**Step 3:** Run with Node server

```
yarn start
```

**Step 4:** Run with Nodemon server

```
yarn prod
```

That's all