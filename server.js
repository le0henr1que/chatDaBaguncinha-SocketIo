const express = require('express')
const path = require('path')
const { fileURLToPath } = require('url')



const app = express()
const server = require('http').createServer(app)
const io = socketIO(server)

const PORT = process.env.PORT || 3000;



app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')



app.get('/', (req, res) => {
    res.render('index.html')
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

  app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });