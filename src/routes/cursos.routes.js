const express = require('express');
const controladorCurso = require('../controllers/cursos.controllers');
const md_authentication = require('../middlewares/autenticacion');

const api = express.Router();

api.post('/agregarCursos', md_authentication.Auth, controladorCurso.AgregarCursos);
api.post('/agregarAsignaciones', md_authentication.Auth, controladorCurso.AgregarAsignaciones);
api.put('/editarCursos/:idCurso', md_authentication.Auth, controladorCurso.EditarCurso);
api.delete('/eliminarCurso/:idCurso', md_authentication.Auth, controladorCurso.EliminarCurso);
api.get('/ObtenerCursos', controladorCurso.ObtenerCursos);



module.exports = api;