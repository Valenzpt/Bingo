class generadorServicio {
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

        ['B', 'I', 'N', 'G', 'O'].forEach((letra, i)=>{
            const [min, max] = rangos[letra];
            const numerosCol = new Set; //Set para evitar duplicados

            while(numerosCol.size<5){
                const num = Math.floor(Math.random()*(max - min + 1)) + min;
                numerosCol.add(num); //se añade al set
            }

            const numerosArray = Array.from(numerosCol).sort((a, b)=> a -b);//convertimos el set a array y lo ordenamos

            for(let j=0; j<5; j++){
                tarjeta[j][i] = numerosArray[j];
            }
        });
        tarjeta[2][2] = 'FREE';
        const resultado = {
            B: tarjeta.map(row => row[0]),
            I: tarjeta.map(row => row[1]),
            N: tarjeta.map(row => row[2]),
            G: tarjeta.map(row => row[3]),
            O: tarjeta.map(row => row[4])
        }
        return resultado;
    }

    static lanzarBalota(balotasLanzadas){
        let num;
        do {
            num = Math.floor(Math.random()* 75 + 1);
        }while(balotasLanzadas.includes(num));
        balotasLanzadas.push(num);
        return num;
    }
    static verificarJuego(){
        
    }
}

module.exports = generadorServicio;