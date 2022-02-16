const express = require('express');
const controladorAsignacion = require('../controllers/asignaciones.controllers');
const md_authentication = require('../middlewares/autenticacion');

const api = express.Router();

api.post('/agregarAsignacion', md_authentication.Auth, controladorAsignacion.AgregarAsignaciones);
api.put('/editarAsignacion/:idAsignacion', md_authentication.Auth, controladorAsignacion.EditarAsignacion);
api.delete('/eliminarAsignacion/:idAsignacion', md_authentication.Auth, controladorAsignacion.EliminarAsignacion);
api.get('/obtenerAsignaciones', controladorAsignacion.ObtenerAsignaciones);



module.exports = api;