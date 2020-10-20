const express = require('express');
const bodyParser = require('body-parser');
const db = require('mongoose');

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const userRoutes = require('./routes/userroutes');

const app = express();

const {
    HOST,
    PORT,
    SESS_SECRET,
    NODE_ENV,
    IS_PROD,
    COOKIE_NAME
  } = require("./config/config");
  const { MongoURI } = require("./config/database");
  const MAX_AGE = 1000 * 60 * 60 * 3; // Three hours

//main connection to db

db.connect('mongodb+srv://thomson:thomson@cluster0.qmoir.mongodb.net/ShopFast?retryWrites=true&w=majority',{
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
})
.then(()=>{console.log('db connected')})

//for storing sessions

const mongoDBstore = new MongoDBStore({
    uri: MongoURI,
    collection: "mySessions"
});

app.use(
    session({
      name: COOKIE_NAME, //name to be put in "key" field in postman etc
      secret: SESS_SECRET,
      resave: true,
      saveUninitialized: false,
      store: mongoDBstore,
      cookie: {
        maxAge: MAX_AGE,
        sameSite: false,
        secure: IS_PROD
      }
    })
);

app.get('/',(req,res) => {
    res.send('Hello')
})

app.use(bodyParser.urlencoded({
    extended: true
}));
  
app.use(bodyParser.json());
app.use('/api',userRoutes)

app.listen(PORT, () => {
    console.log('Server is listening')
})