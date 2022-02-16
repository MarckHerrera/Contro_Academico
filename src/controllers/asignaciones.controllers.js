const Asignacion = require('../models/asignaciones.model');

function AgregarAsignaciones(req, res) {
var parametros = req.body;
var modeloAsignacion = new Asignacion();

if (parametros) {

    modeloAsignacion.idCurso = req.params.idCurso;
    modeloAsignacion.idEstudiante = req.user.sub;

    modeloAsignacion.save((err, asignacionGurdada)=>{
        if (err) return res.status(500).send({mesaje: 'Error en la petición'});
        if (!asignacionGurdada) return res.status(500).send({mesaje: 'Error al agregar la asignacion'})
        
        return res.status(500).send({asignacion: asignacionGurdada});
    })
} else {
    return res.status(500).send({mesaje: 'Debe ingresar los parametros obligatorios'});
}

}

function ObtenerAsignaciones(req, res) {
    Asignacion.find({}, (err, asignacionesEncontradas)=>{
        if(err) return res.status(500).send({mesaje: 'Error en la peticion'});
        if(!asignacionesEncontradas) return res.status(500).send({mesaje: 'Error al obtener las asignaciones'});

        return res.status(200).send({asignacion: asignacionesEncontradas})
    }).populate('idMaestro', 'idCurso')
    
}

function EliminarAsignacion (req,res){
    var idAsi = req.params.idAsignacion;
    
    Asignacion.findByIdAndDelete(idAsi, (err, asignacionEliminada)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
    if(!asignacionEliminada) return res.status(500)
    .send({mensaje: 'Error al eliminar'});

    return res.status(200).send({ asignacion: asignacionEliminada})

    })
}

function EditarAsignacion(req, res) {
    
}

module.exports = {
    AgregarAsignaciones,
    ObtenerAsignaciones,
    EliminarAsignacion,
    EditarAsignacion

}