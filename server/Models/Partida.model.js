const { DataTypes, Model } = require("sequelize");
const db = require("../config/database");

class Partida extends Model {

}
//definimos el modelo de Partida en sequelize
Partida.init({
    estado: {
        type: DataTypes.ENUM('esperando','activo', 'finalizado'),
        allowNull: false
    },
    ganador_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'usuarios',
            key: 'id'
        }
    },
    balotasLanzadas: {
        type: DataTypes.JSON,
        defaultValue: []
    }
},{
    sequelize: db,
    modelName: 'Partida',
    tableName: 'partidas',
    timestamps: false
});

module.exports = Partida;