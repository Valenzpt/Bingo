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
        type: DataTypes.ENUM('activo', 'completado'),
        allowNull: false
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'usuarios',
            key: 'id' //relacion con tabla usuarios
        }
    }
},{
    db,
    modelName: 'Tarjeta',
    tableName: 'tarjetas',
    timestamps: false
});

module.exports = Tarjeta;