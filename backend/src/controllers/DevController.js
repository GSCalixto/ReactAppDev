const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMassage } = require('../websocket');

//Nomes para controler index = mostrar uma lista, show = mostrar um único, 
//store = Criar, update = alterar, destroy = deletar
module.exports = {

    //Listando Devs
    async index(request, response) {
        const devs = await Dev.find();

        return response.json(devs);
    },

    //Cadastrando um Dev
    async store(request, response) {
        //Buscando o githu_username de dentro do request.body
        const { github_username, techs, latitude, longitude } = request.body;

        //Verificando se ha um outro Dev com o mesmo username do github
        let dev = await Dev.findOne({ github_username });
        if (!dev) {
            //Consumindo a API do github para buscar a info
            //Usando Crase para poder utilizar variáveis dentro do parametro
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);

            const { name = login, avatar_url, bio } = apiResponse.data;

            const techsArray = parseStringAsArray(techs);
            //split() separa uma estring sempre que encontrar o que estiver como parametro, no caso as virgulas (',')
            //trim() Tira os espaçoes de antes e depois da String 

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };

            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            });
            //Filtrar as conexões que estão há, no máximo, 10km de distancia e que o novo dev tenha pelo menos uma das techs filtradas
            const sendSocketMassageTo = findConnections(
                { latitude, longitude },
                techsArray,
            );
            sendMassage(sendSocketMassageTo, 'new-dev', dev);
        }
        return response.json(dev);
    },

    async update() {
        //Fazer
    },

    async destroy() {
        //Fazer
    },
};