const express = require('express')
const path = require('path')

const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)


app.use(express.static(path.join(__dirname, '../public')));
app.set('views', path.join(__dirname, '../public'));
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')



app.use('/', (req, res) => {
    res.render('index.html')
})

let messagem = [];

const users = {};

let userOnline = []

io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`);
    socket.emit('previusMessages', messagem)
   socket.on('sendMessage', data => {
      messagem.push(data)
      socket.broadcast.emit('receivedMessage', data)
    });
    socket.on('login', function(data){
      console.log('a user ' + data.userId + ' connected');

      // console.log(`users connected ${userOnline++ }`)
      userOnline.push(data.userId)
      console.log(JSON.stringify(userOnline))
      // saving userId to object with socket ID
      users[socket.id] = data.userId;
    });
  
    socket.on('disconnect', function(){
      console.log('user ' + users[socket.id] + ' disconnected');
      // remove saved socket from users object
      console.log(`users connected ${userOnline - 1}`)

      delete users[socket.id];
    });
  });

server.listen(4000)