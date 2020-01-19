const socketio = require('socket.io');

const parseStringAsArray = require('./utils/parseStringAsArray');
const calculateDistance = require('./utils/calculateDistance');

let io;
const connections = [];

//Configurações para o servidor aceitar infos no formato Websocket
exports.setupWebsocket = (server) => {
    io = socketio(server);

    io.on('connection', socket => {
        const { latitude, longitude, techs } = socket.handshake.query

        connections.push({
            id: socket.id,
            coordinates: {
                latitude: Number(latitude),
                longitude: Number(longitude),
            },
            techs: parseStringAsArray(techs),
        });
    });
};

//Filtrando as conexões
exports.findConnections = (coordinates, techs) => {
    return connections.filter(connection => {
        //Comparando as coordenadas cadastradas do novo Dev com as das conexões
        return calculateDistance(coordinates, connection.coordinates) < 10
            && connection.techs.some(item => techs.includes(item));
    });
};

//Enviando a mensagem com as infos filtradas dos devs para o frot end
exports.sendMassage = (to, massage, data) => {
    to.forEach(connection => {
        io.to(connection.id).emit(massage, data);
    });
}