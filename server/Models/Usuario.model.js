const {Sequelize, DataTypes, Model} = require("sequelize");
const db = require("../config/database");
const bcrypt = require("bcryptjs");

/**
 * Modelo de usuario que representa base de datos
 * incluye metodos de autenticacion y validacion de contraseña
 */
class Usuario extends Model {
    /**
     * Metodo estatico para encontrar un usaurio por su nombre de usuario
     * @param {*} username nombre de usuario para la busqueda
     * @returns {Usuario|null} usuario encontrado o null si no existe
     */
    static async findByUsername(username){
        return await Usuario.findOne({where: {username: username}});
    }
    /**
     * metodo para hashear contraseña antes de guardar el usuario
     */
    async hashPassword(){
        this.password = await bcrypt.hash(this.password, 10);
    }
    /**
     * metodo para validar la contraseña comparando el hash guardado con la contraseña ingresada
     * @param {*} password contraseña ingresada por el usuario
     * @returns true si la contraseña es valida
     */
    
    async validatePassword(password){
        return await bcrypt.compare(password, this.password);
    }
    /**
     * metodo estatico de autenticacion para validar usuario y contraseña
     * @param {*} username nombre de usuario
     * @param {*} password contraseña
     * @returns usuario autenticado o null si no coinciden las credenciales
     */
    static async authenticate(username, password){
        const usuario = await this.findByUsername(username);
        if(!usuario) return null;
        const validPass = await usuario.validatePassword(password);
        return validPass?usuario:null;
    }
} 
//Definicion del modelo con campos y configuraciones
Usuario.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: DataTypes.STRING,
    nombre: DataTypes.STRING,
    password: DataTypes.STRING,
},{
    sequelize: db,
    tableName: 'usuarios',
    timestamps: false
});
//hash de la contraseña antes de crear el usuario
Usuario.beforeCreate(async (Usuario)=>{
    await Usuario.hashPassword();
});

module.exports = Usuario;