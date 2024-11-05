const Usuario = require("./Usuario.model");
const Partida = require("./Partida.model");
const Tarjeta = require("./Tarjeta.model");
const PartidaUSuario = require("./PartidaUsuario.model");

//relaciones entre modelos

//Relación entre partida y usuario
Partida.belongsTo(Usuario, {as: 'ganador', foreignKey: 'ganador_id'});
Usuario.hasMany(Partida, {foreignKey: 'ganador_id'});

//relacion muchos a muchos partida y usuarios
Partida.belongsToMany(Usuario, {through: PartidaUSuario, foreignKey: 'partida_id', as: 'usuarios'});
Usuario.belongsToMany(Usuario, {through: PartidaUSuario, foreignKey: 'usuario_id', as: 'partidas'});

//Relación entre Tarjeta y usaurio
Usuario.hasMany(Tarjeta, {foreignKey: 'usuario_id'});
Tarjeta.belongsTo(Usuario, {foreignKey: 'usuario_id'});

//Relación entre partida y tarjeta
Partida.belongsTo(Tarjeta, {as: 'tarjeta', foreignKey: 'partida_id'});
Tarjeta.hasMany(Partida, {foreignKey: 'partida_id'});

module.exports = {Usuario, Partida, Tarjeta, PartidaUSuario};