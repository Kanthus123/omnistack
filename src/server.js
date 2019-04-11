const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
const server = require('http').Server(app); //permite escutar requisições do tipo http
const io = require('socket.io')(server); //permite escutar requisições do tipo socket

io.on('connection', socket => { //representação de conexão real time -> toda vez que o usuario abrir uma requisição de web socket chamado connectRoom faz um Join com a Sala BOX, assim isolando o usuario em uma sala especifica.
    socket.on('connectRoom', box => {
        socket.join(box);
    })
});

mongoose.connect('mongodb+srv://Kanthus:deidara10@estudonodejs-mevxq.mongodb.net/test?retryWrites=true',
    {
        useNewUrlParser: true
    }
);

app.use((req, res, next) => {
    req.io = io; //toda rota que for chamada tera acesso ao IO

    return next(); //retornar next permite que o programa consiga prosseguir em suas requisições
});

app.use(cors()); //permite que todos os dominios acessem a aplicação
app.use(express.json()); //ajuda o servidor a entender as requisições JSON
app.use(express.urlencoded({extended: true }));
app.use('/files', express.static(path.resolve(__dirname, "..", 'tmp')))

app.use(require('./routes'));

server.listen(process.env.PORT || 3333); //escuta a porta X ou variavel ambiente
