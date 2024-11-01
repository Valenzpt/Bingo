const { DataTypes, Model } = require("sequelize");
const db = require("../config/database");

class Balota extends Model {

}
//definimos el modelo de Balota en Sequelize
Balota.init({
    numero: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    letra: {
        type: DataTypes.ENUM('B', 'I', 'N', 'G', 'O'),
        allowNull: false
    },
    partida_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'partidas',
            key: 'id' //relacion con la tabla partidas
        }
    }
},{
    db,
    modelName: 'Balota',
    tableName: 'balotas',
    timestamps: false
});

module.exports = Balota;