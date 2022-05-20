// const { socket } = require('socket.io');
const app = require('express')();
const http = require('http').Server(app);
const bodyParser = require('body-parser');
const { assert } = require('console');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const io = require('socket.io')(http,{
    cors:{
        origin: true,
        credentials: true,
        methods:["GET", "POST"]
    }
});
const url = 'mongodb://localhost:27017';
const dbName = 'chatAngular';
let db;

io.on('connection',(socket)=> {
    console.log('New User connected');
    
    socket.on("sendMessage",(messageInfo)=> {
        console.log("Enviando un mensaje");
        socket.broadcast.emit("receiveMessage",messageInfo);

    });
 
});
app.use(bodyParser.text());
app.use(cors());

app.post('/api/message',(req,res)=> {
    console.log(req.body);
    db.collection('messages').insertOne({'msg': req.body});


    res.status(200).send();
})

 async function GetMessages(){
    const docs = await db.collection('messages').find({}).toArray();
    console.log(docs);
}


app.get('/',(req,res)=> {
    res.send('<h2>Hello World!</h2>')
});

MongoClient.connect(url, function(err,client) {
    
    if(err) return console.log('mongodb error', err);

    console.log("Connected successfully to server");

    db = client.db(dbName);

    GetMessages();

});

http.listen(3000,()=> {
    console.log('Listening on port 3000');
});