// const { socket } = require('socket.io');

const app = require('express')();
const http = require('http').Server(app);
const bodyParser = require('body-parser');
const cors = require('cors');
const io = require('socket.io')(http,{
    cors:{
        origin: true,
        credentials: true,
        methods:["GET", "POST"]
    }
});

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
    res.status(200).send();
})

app.get('/',(req,res)=> {
    res.send('<h2>Hello World!</h2>')
});

http.listen(3000,()=> {
    console.log('Listening on port 3000');
})