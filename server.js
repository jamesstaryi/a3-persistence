const express = require('express'),
      { MongoClient, ObjectId } = require('mongodb'),
      cookie  = require( 'cookie-session' ),
      hbs     = require( 'express-handlebars' ).engine,
      app = express();

app.use( express.urlencoded({ extended:true }) )
app.use( express.static( 'public' ) )
app.use( express.static( 'views'  ) )
app.use( express.json() )

app.engine( 'handlebars',  hbs() )
app.set(    'view engine', 'handlebars' )
app.set(    'views',       './views' )

app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))

let userID = null;

app.post( '/login', async (req,res)=> {
  const { username, password } = req.body;
  
  try {
    const users = await collection.find({ username: { $exists: true } }).toArray();
    
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
      req.session.login = true;
      userID = user._id.toString();
      res.redirect('index.html');
    } else {
      req.session.login = false;
      res.render('login', { msg: 'Incorrect username or password', layout: false });
    }
  } catch (error) {
    console.error('Error checking user credentials:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get( '/', (req,res) => {
  res.render( 'login', { msg:'', layout:false })
})

// add some middleware that always sends unauthenicaetd users to the login page
app.use( function( req,res,next) {
  if( req.session.login === true )
    next()
  else
    res.render('login', { msg:'Login failed, please try again', layout:false })
})

app.get( '/index.html', ( req, res) => {
    res.render( 'index', { msg:'Success you have logged in', layout:false })
})

const url = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.ghnb50r.mongodb.net/?retryWrites=true&w=majority`

const client = new MongoClient( url )

let collection = null

async function run() {
  await client.connect()
  collection = await client.db("todos").collection("todos")
}

run()

app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

// route to get all docs
app.get("/docs", async (req, res) => {
  const docs = await collection.find({ userID: userID }).toArray()
  res.json( docs )
})

app.get("/username", async (req, res) => {
  const docs = await collection.find({ _id: new ObjectId(userID) }).toArray()
  res.json( docs )
})

app.post( '/submit', async (req,res) => {
  if(req.body.date === ""){
          req.body.date = "TBD";
  }
  req.body.userID = userID;
  const result = await collection.insertOne( req.body )
  res.json( result )
})

app.post( '/delete', async (req,res) => {
  const result = await collection.deleteOne({ 
    _id:new ObjectId( req.body._id )
  })
  res.json( result )
})

app.post( '/edit', async (req,res) => {
  const result = await collection.updateOne(
        { _id: new ObjectId( req.body._id ) },
        { $set:{ todo: req.body.todoNew } }
      )
  res.json( result )
})

app.post( '/update', async (req,res) => {
  let boolValue = (req.body.done.toLowerCase() === "true"); 
      const result = await collection.updateOne(
        { _id: new ObjectId( req.body._id ) },
        { $set:{ done:!boolValue } }
      )
      if(!boolValue){
        const result = await collection.updateOne(
          { _id: new ObjectId( req.body._id ) },
          { $set:{ urgency:"Done" } }
        )
      }
      else{
        let urgency = "Not Urgent";
        if(req.body.date !== "TBD"){
          const currentDate = new Date();
          const targetDate = new Date(req.body.date);
           targetDate.setHours(targetDate.getHours() + 4)
          const timeDifference = targetDate.getTime() - currentDate.getTime();
          const daysDifference = timeDifference / (1000 * 3600 * 24);

          if(daysDifference < 0){
            urgency = "Late"
          }
          else if(daysDifference <= 7){
            urgency = "Urgent"
          }
        }
        const result = await collection.updateOne(
          { _id: new ObjectId( req.body._id ) },
          { $set:{ urgency:urgency } }
        )
      }

  res.json( result )
})

app.listen( 3000 ) //process.env.PORT )