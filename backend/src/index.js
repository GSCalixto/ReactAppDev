const express = require ('express');
const mongoose = require ('mongoose');
const cors = require ('cors');
const http = require ('http');
//importando a rota do arquivo de rotas
const routes = require ('./routes');
const { setupWebsocket } = require ('./websocket');

const app = express();
//Extraindo o servidor http de dentro do Express para usar o Web socket
const server = http.Server(app);

setupWebsocket(server);

//Conexão com o banco de dados MongoDB
mongoose.connect('mongodb+srv://gabriel:gabriel@cluster0-isrzg.mongodb.net/weel10?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });

app.use(cors());

//configurando o express para receber infos no formato JSON
app.use(express.json());

app.use(routes);

//Definido a porta da API
server.listen(3333);
