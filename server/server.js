console.log("Inicializando");
//importamos app express
const app = require("./app");
const port = process.env.PORT || 3000; //configuramos puerto
//inicializamos el servidor con el puerto configurado
app.listen(port, ()=>{
    console.log(`Servidor en puerto ${port}`);
});