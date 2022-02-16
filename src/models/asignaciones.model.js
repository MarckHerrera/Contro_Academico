const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AsignacionSchema = Schema({
    idCurso: {type: Schema.Types.ObjectId, ref: 'Cursos'},
    idEstudiante: {type: Schema.Types.ObjectId, ref: 'Usuarios'}
    
});

module.exports = mongoose.model('Asignaciones', AsignacionSchema);