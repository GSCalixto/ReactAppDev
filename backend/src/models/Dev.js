const mongoose = require ('mongoose');
const PointSchema = require ('./utils/PointSchema');

//Estrutura da "entidade" dentro do banco
const DevSchema = new mongoose.Schema ({
    name: String,
    github_username: String,
    bio: String,
    avatar_url: String,
    techs: [String],//vetor de Strings
    location: {
        type: PointSchema,
        index: '2dsphere'
    }
});
//^Indice/index obrigátório para ponto de latitude e longitude que facilita a busca,
// 2dsphere significa esfera 2D

module.exports = mongoose.model('Dev', DevSchema);//Maneira de importar um model com o mongoose