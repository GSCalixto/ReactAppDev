//Arquivo de rotas
const { Router } = require ('express');
const DevController = require ('./controllers/DevController')
const SeachController = require ('./controllers/SeachController')

const routes = Router();

//Metodos HTTP: GET= listar/buscar, POST= enviar/criar, PUT= alterar , DELETE= deletar
//Tipos de parametros:
//Query Params: request.query (Filtros, ordenação, paginação, ...)
//Route Params: request.params (Identificar um recurso na alteração ou remoção)
//Body: request.body (Dados para criação ou alteração de um registro)

//Rotas com paramatros de Requisição(os parametros estão em DevController) e resposta em JSON
routes.get('/devs', DevController.index );
routes.post('/devs', DevController.store );
routes.get('/seach', SeachController.index );

module.exports = routes;
