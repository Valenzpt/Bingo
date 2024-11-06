const { DataTypes, Model } = require("sequelize");
const db = require("../config/database");

class Tarjeta extends Model {

}
//definimos el modelo de Tarjeta en Sequelize
Tarjeta.init({
    numeros: {
        type: DataTypes.JSON,
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('activo','descalificado', 'completado'),
        allowNull: false
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'usuarios',
            key: 'id' //relacion con tabla usuarios
        },
        allowNull: false
    },
    partida_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'partidas',
            key: 'id' //relacion con tabla partidas
        },
        allowNull: false
    }
},{
    sequelize: db,
    modelName: 'Tarjeta',
    tableName: 'tarjetas',
    timestamps: false
});

module.exports = Tarjeta;