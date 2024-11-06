const Tarjeta = require("../Models/Tarjeta.model");

class generadorServicio {
    /**
     * Genera un tarjton de bingo de 5x5
     * @returns un objeto con los numeros de la tarjeta
     */
    static generarTarjeton() {
        //inicializo la tarjeta 5*5 con datos null
        const tarjeta = Array(5).fill(null).map(()=> Array(5).fill(null));
        //defino los rangos por columna
        const rangos = { 
            B: [1, 15], 
            I: [16, 30], 
            N: [31, 45], 
            G: [46, 60], 
            O: [61, 75]
        };

        //Genera los numeros para cada columna
        ['B', 'I', 'N', 'G', 'O'].forEach((letra, i)=>{
            const [min, max] = rangos[letra];
            const numerosCol = new Set; //Set para evitar duplicados

            //llena la columna hasta tener 5 numeros unicos
            while(numerosCol.size<5){
                const num = Math.floor(Math.random()*(max - min + 1)) + min;
                numerosCol.add(num); //se añade al set
            }

            //convierte el set a array y lo ordena
            const numerosArray = Array.from(numerosCol).sort((a, b)=> a -b);//convertimos el set a array y lo ordenamos
            //Asigna los numeros a la tarjeta
            for(let j=0; j<5; j++){
                tarjeta[j][i] = numerosArray[j];
            }
        });
        tarjeta[2][2] = 'FREE'; //espacio libre en el centro
        const resultado = { //objeto de array de numeros por letra
            B: tarjeta.map(row => row[0]),
            I: tarjeta.map(row => row[1]),
            N: tarjeta.map(row => row[2]),
            G: tarjeta.map(row => row[3]),
            O: tarjeta.map(row => row[4])
        }
        return resultado;
    }

    /**
     * Lanza una balota que no ha sido lanzada previamente
     * @param {*} balotasLanzadas array con balotas que ya han sido lanzadas
     * @returns numero de balota lanzada
     */
    static lanzarBalota(balotasLanzadas){
        let num;
        do {
            num = Math.floor(Math.random()* 75 + 1); //genera un numero aletario entre 1 y 75
        }while(balotasLanzadas.includes(num)); //asegura que no se ha lanzado antes
        balotasLanzadas.push(num); //añade la balota a la lista de lanzadas
        return num; //devuelve el numero
    }
    /**
     * Verifica si la tarjeta y los numeros seleccionados cumplen con una condición de victoria
     * @param {*} tarjeta 
     * @param {*} seleccionados 
     * @returns devuelve el tipo de victoria
     */
    static verificarJuego(tarjeta, seleccionados){
        if(this.verificarCompleto(tarjeta, seleccionados)){
            return 'Carton completo';
        }
        if(this.verificarDiagonal(tarjeta, seleccionados)){
            return 'Diagonal'
        }
        if(this.verificarVertical(tarjeta, seleccionados)){
            return 'Vertical'
        }
        if(this.verificarHorizontal(tarjeta, seleccionados)){
            return 'Horizontal'
        }
        if(this.verificarEsquinas(tarjeta, seleccionados)){
            return 'Esquinas'
        }
        return 'sin victoria';
    }
    /**
     * Verifica si toda la tarjeta esta completa
     * @param {*} tarjeta 
     * @param {*} seleccionados 
     * @returns 
     */
    static verificarCompleto(tarjeta, seleccionados) {
        for(const letra in tarjeta){
            for(let i=0; i<tarjeta[letra].length; i++){
                if(tarjeta[letra][i] !== 'FREE' && !seleccionados[letra][i]){ //no e free y no esta seleccionada
                    return false;
                }
            }
        }
        return true;
    }
    /**
     * Verifica si hay una diagonal completa
     * @param {*} tarjeta 
     * @param {*} seleccionados 
     * @returns 
     */
    static verificarDiagonal(tarjeta, seleccionados){
        let diagonal1 = true;
        let diagonal2 = true;

            //diagonal de arriba a abajo 
        for(let i=0; i<5; i++){
            //no es free y no ha sido seleccionada
            if(tarjeta[Object.keys(tarjeta)[i]][i] !== 'FREE' && !seleccionados[Object.keys(tarjeta)[i]][i]){
                diagonal1 = false;
                break; //sale del bucle si no ha encontrado numero seleccionado
            }
        }
        //diagonal de abajo hacia arriba
        for(let i=0; i<5; i++){
            if(tarjeta[Object.keys(tarjeta)[4-i]][i] !== 'FREE' && !seleccionados[Object.keys(tarjeta)[4-i]][i]){
                diagonal2 = false;
                break;//sale del bucle si no ha encontrado numero seleccionado
            }
        }
        return diagonal1 || diagonal2;
    }

    /**
     * verifica si una columna vertical esta completa
     * @param {*} tarjeta 
     * @param {*} seleccionados 
     * @returns 
     */
    static verificarVertical(tarjeta, seleccionados){
        for(let i=0; i<5; i++){
            let vertical = true;
            for(let j=0; j<5; j++){
                if(tarjeta[Object.keys(tarjeta)[i]][j] !== 'FREE' && !seleccionados[Object.keys(tarjeta)[i]][j]){
                    vertical = false;
                    break; //sale del bucle si no ha encontrado numero seleccionado
                }
            }
            if(vertical) return true;
        }
        return false;
    }

    /**
     * verifica si hay una fila completa
     * @param {*} tarjeta 
     * @param {*} seleccionados 
     * @returns 
     */
    static verificarHorizontal(tarjeta, seleccionados){
        for(let i=0; i<5; i++){
            let horizontal = true;
            for(let j=0; j<5; j++){
                if(tarjeta[Object.keys(tarjeta)[j]][i] !== 'FREE' && !seleccionados[Object.keys(tarjeta)[j]][i]){
                    horizontal = false;
                    break;
                }
            }
            if(horizontal) return true;
        }
        return false;
    }
    /**
     * verifica las 4 esquinas
     * @param {*} tarjeta 
     * @param {*} seleccionados 
     * @returns 
     */
    static verificarEsquinas(tarjeta, seleccionados) {
        const esquinas = [
            {col: 0, row:0},
            {col: 0, row:4},
            {col: 4, row:0},
            {col: 4, row:4},
        ];
        for(const esquina of esquinas){
            const letra = Object.keys(tarjeta)[esquina.col];
            const index = esquina.row;
            if(!seleccionados[letra][index]){
                return false;
            }
        }
        return true;
    }
}

module.exports = generadorServicio;