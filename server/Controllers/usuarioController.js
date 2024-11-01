const Usuario = require("../Models/Usuario.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const JWT_SECRET = 'secretCat'; //Clave "secreta"xD

/**
 * controlador para las operaciones relacionadas con el usuario
 */
class UsuarioController {
    /**
     * Crea un nuevo usuario si no existe
     * @param {*} req objeto de solicitud que contiene los datos del usuario.
     * @param {*} res  objeto de respuesta
     * @returns usuario creado o error de acuerdo al caso
     */
    static async create (req, res){
        try {
            const {username, nombre, password} = req.body;
            const encontrar = await Usuario.findByUsername(username);
            if(encontrar){
                return res.status(409).json({error: 'Usuario ya existe'});
            }
            const nuevoUsuario = await Usuario.create({username, nombre, password});
            return res.status(200).json({message: 'Usuario creado correctamente', usuario: nuevoUsuario})
        } catch (error) {
            return res.status(500).json({error: 'Error al crear usuairo'});
        }
    }
    /**
     * Inicia sesion para el usuario y genera un token JWT
     * @param {*} req objeto de solicitud que contiene los datos del usuario.
     * @param {*} res  objeto de respuesta
     * @returns token 
     */
    static async login (req, res){
        try {
            const {username, password} = req.body;
            const usuario = await Usuario.authenticate(username, password);
            if(!usuario){
                return res.status(401).json({error: 'Credenciales incorrectas'});
            }
            const token = jwt.sign({id: usuario.id, username: usuario.username}, JWT_SECRET, {expiresIn: '2h'});
            return res.status(200).json({message: 'Sesion iniciada', token})
        } catch (error) {
            return res.status(500).json({error: 'Error al iniciar sesión'});
        }
    }
}

module.exports = UsuarioController;