const jwt = require('jsonwebtoken');
const JWT_SECRET = 'secretCat'; 
/**
 * Middleware para autenticar el token jwt
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
function authenticateToken(req, res, next) {
    //encadenamiento opcional en caso que no exista encabezado 'authorization'
    const token = req.headers['authorization']?.split(' ')[1];
    if(!token) return res.status(401).json({message: 'Token requerido'});

    jwt.verify(token, JWT_SECRET, (err, usuario)=>{
        if(err) return res.status(403).json({message: 'Token no valido'});
        req.usuario = usuario;
        next();
    });
}

module.exports = authenticateToken;