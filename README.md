# Bingo

Este es un reto de Bingo creado utilizando Node.js, Espress, Sequelize, MySQL y Vue3.

## Requisitos previos

-Node.js y npm
-MySQL
-Sequelize

## Estructura del proyecto
- `/database`: Contiene el archivo SQL para la creacion de la base de datos y tablas necesarias en MySQL.
. `/server`: Contiene la API creada con Node.jj, Express y Sequelize para manejar la lógica y la interacción con la base de datos.
. `/client`: Contiene el código fuente del frontend desarrollado con Vue3 para interactuar con la API.

## Instalación

1. **Clonar el repositorio**
  git clone https://github.com/Valenzpt/Bingo

2. **Configurar la base de datos**
  Crea una base de datos en MySQL
  Importa el archivo SQL ubicado en /database/db.sql en tu base de datos MySQL.

3. **Instalar dependencias**
  cd server
  npm install

  cd ../client
  npm install

4. **Ejecutar el proyecto**
  cd ../server
  npm run dev

  cd ../client
  npm run serve
