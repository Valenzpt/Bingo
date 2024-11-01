const { Sequelize } = require("sequelize");
//instancia de sequelize con detalles de conexion a MySQL
const sequelize = new Sequelize('db_bingo', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    logging: console.log,
});
//administrar conexion
try{
    sequelize.authenticate();
    console.log("Conexión establecida correctamente");
}catch(error){
    console.error("Error conectando a la base de datos", error);
}

//exportamos conexion
module.exports = sequelize;