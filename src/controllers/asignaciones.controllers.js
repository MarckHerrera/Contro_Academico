const Asignacion = require('../models/asignaciones.model');

function AgregarAsignaciones(req, res) {

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
    var idAsi = req.params.idAsignacion;
    var parametros = req.body;

    Asignacion.findByIdAndUpdate(idAsi, parametros, {new: true}, (err, asignacionEditada)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en  la peticion'});
        if(!asignacionEditada) return res.status(500).send({mensaje: 'Error al editar el Asignacion'});

        return res.status(200).send({ curso: asignacionEditada });
    })
}

module.exports = {
    AgregarAsignaciones,
    ObtenerAsignaciones,
    EliminarAsignacion,
    EditarAsignacion

}