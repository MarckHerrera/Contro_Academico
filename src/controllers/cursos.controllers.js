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

function ObtenerCursos(req, res) {
    Curso.find({}, (err, cursosEncontrados)=>{
        if(err) return res.status(500).send({mesaje: 'Error en la peticion'});
        if(!cursosEncontrados) return res.status(500).send({mesaje: 'Error al obtener las cursos'});

        return res.status(200).send({cursos: cursosEncontrados})
    }).populate('idMaestro', 'nombre')
    
}


function EliminarCurso(req, res) {
    var idCur = req.params.idCursos;
    if(req.user.rol !== 'Maestro' ) {
        return res.status(500).send({ mensaje: 'No tiene los permisos para eliminar este Curso.' });
    }else{
    Curso.findByIdAndDelete(idCur, (err, cursoEliminado) => {
      if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
      if (!cursoEliminado)
        return res.status(500).send({ mensaje: "Error al eliminar el usuario" });
        return res.status(200).send({ curso: cursoEliminado });
    });
}
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