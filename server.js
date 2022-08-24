const express = require('express')
const path = require('path')
const { fileURLToPath } = require('url')



const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')



app.get('/', (req, res) => {
    res.renderFile(__dirname+'/public/index.html')
})

let messagem = [];

const users = {};


io.on('connection', socket => {

    console.log(`Socket conectado: ${socket.id}`);
    socket.emit('previusMessages', messagem)
    
    socket.on('sendMessage', data => {
        messagem.push(data)
        socket.broadcast.emit('receivedMessage', data)
      });

    socket.on('login', function(data){
      console.log('a user ' + data.userId + ' connected');

      // saving userId to object with socket ID
      users[socket.id] = data.userId;
    });
  
    socket.on('disconnect', function(){
      console.log('user ' + users[socket.id] + ' disconnected');
      // remove saved socket from users object

      delete users[socket.id];
    });
  });

server.listen(PORT)