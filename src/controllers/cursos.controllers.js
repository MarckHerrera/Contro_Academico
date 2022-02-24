const Curso = require('../models/cursos.model');

function AgregarCursos(req, res) {
var parametros = req.body;
var modeloCurso = new Curso();

if (req.user.rol == 'Maestro') {

    modeloCurso.nombre = parametros.nombre;
    modeloCurso.idMaestro = req.user.sub;

    modeloCurso.save((err, cursoGurdado)=>{
        if (err) return res.status(500).send({mesaje: 'Error en la petición'});
        if (!cursoGurdado) return res.status(500).send({mesaje: 'Error al agregar el Curso'})
        
        return res.status(500).send({curso: cursoGurdado});
    })
} else {
    return res.status(500).send({mesaje: 'Debe ingresar los parametros obligatorios'});
}

}

function AgregarAsignaciones(req, res) {
    var parametros = req.body;
    var usuarioLogeado = req.user.sub;

    if (parametros.nombreCurso) {

        Asignacion.find({idEstudiante: usuarioLogeado}).populate('idCurso').exec((err, asignacionesEncontradas)=>{
    
            if (asignacionesEncontradas.length >= 3) return res.status(400)
            .send({mesaje: 'No se pueden asignar mas de 3 cursos por alumno'});
            
            for (let i = 0; i < asignacionesEncontradas.length; i++){
                if (asignacionesEncontradas[i].idCurso.nombreCurso == parametros.nombreCurso) return res.status(400).send({mesaje: 'Ya se encuentra asignado'});    
                }
                 Curso.findOne ({ nombreCurso: parametros.nombreCurso}, (err, cursoEncontrado)=>{
                     if(err) return res.status(500).send({mesaje: 'Error en la peticion'});
                     if(!cursoEncontrado) return res.status(500).send({mensaje: 'Eror al obtener Curso'});
    
                     const modeloAsignacion = new Asignacion();
                     modeloAsignacion.idCurso = cursoEncontrado._id;
                     modeloAsignacion.idEstudiante = usuarioLogeado;

                     modeloAsignacion.save((err, asignacionCreada) => {
                        if(err) return res.status(400).send({ mensaje: 'Error en la peticion de agregar asignacion' });
                        if(!asignacionCreada) return res.status(400).send({ mensaje: 'Error al agregar asignacion'});
    
                        return res.status(200).send({ asignacion: asignacionCreada})
                    })
                })
            })
     
    }else{
        return res.status(400).send({message: 'Debe enviar los parametros obligatorios'})
    }
}

function ObtenerCursos(req, res) {
    Curso.find({}, (err, cursosEncontrados)=>{
        if(err) return res.status(500).send({mesaje: 'Error en la peticion'});
        if(!cursosEncontrados) return res.status(500).send({mesaje: 'Error al obtener las cursos'});

        return res.status(200).send({cursos: cursosEncontrados})
    }).populate('idMaestro', 'nombre')
    
}


function EliminarCurso(req, res) {
    var cursoId = req.params.idCurso;
   
    Curso.findOne({ _id: cursoId, idMaestro: req.user.sub }, (err, cursoMaestro)=>{
        if(!cursoMaestro){
            return res.status(400).send({ mensaje: 'No puede editar cursos que no fueron creados por su persona'});
        } else {
            Curso.findOne({ nombreCurso : 'Por Defecto' }, (err, cursoEncontrado) => {
                if(!cursoEncontrado){

                    const modeloCurso = new Curso();
                    modeloCurso.nombreCurso = 'Por Defecto';
                    modeloCurso.idMaestro = null;

                    modeloCurso.save((err, cursoGuardado)=>{
                        if(err) return res.status(400).send({ mensaje: 'Error en la peticion de Guardar Curso'});
                        if(!cursoGuardado) return res.status(400).send({ mensaje: 'Error al guardar el curso'});

                        Asignacion.updateMany({ idCurso: cursoId }, { idCurso: cursoGuardado._id }, 
                            (err, asignacionesEditadas) => {
                                if(err) return res.status(400)
                                    .send({ mensaje: 'Error en la peticion de actualizar asignaciones'});
                                
                                Curso.findByIdAndDelete(cursoId, (err, cursoEliminado)=>{
                                    if(err) return res.status(400).send({ mensaje: "Error en la peticion de eliminar curso"});
                                    if(!cursoEliminado) return res.status(400).send({ mensaje: 'Error al eliminar el curso'});

                                    return res.status(200).send({ 
                                        editado: asignacionesEditadas,
                                        eliminado: cursoEliminado
                                    })
                                })
                            })
                    })

                } else {

                    Asignacion.updateMany({ idCurso: cursoId }, { idCurso: cursoEncontrado._id }, 
                        (err, asignacionesActualizadas) => {
                            if(err) return res.status(400).send({ mensaje:"Error en la peticion de actualizar asignaciones"});

                            Curso.findByIdAndDelete(cursoId, (err, cursoEliminado)=>{
                                if(err) return res.status(400).send({ mensaje: "Error en la peticion de eliminar curso"});
                                if(!cursoEliminado) return res.status(400).send({ mensaje: "Error al eliminar el curso"});

                                return res.status(200).send({ 
                                    editado: asignacionesActualizadas,
                                    eliminado: cursoEliminado
                                })
                            })
                        })

                }
            })
        }
    })


}

function EditarCurso(req, res) {
    var idCu = req.params.idCursos;
    var parametros = req.body;

    if( req.user.rol !== 'Maestro') {
        return res.status(500).send({ mensaje: 'No tiene los permisos para editar este Curso.' });
    }
    Curso.findByIdAndUpdate(idCu, parametros, {new: true}, (err, cursoEditado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en  la peticion'});
        if(!cursoEditado) return res.status(500).send({mensaje: 'Error al editar el Curso'});

        return res.status(200).send({ curso: cursoEditado });
    })
}

module.exports = {
    AgregarCursos,
    ObtenerCursos,
    EliminarCurso,
    EditarCurso

}