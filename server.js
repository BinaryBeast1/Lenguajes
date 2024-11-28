const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const app = express();
const port = 3000;

// Configuración de la conexión a la base de datos
const pool = new Pool({
    user: 'postgres',                // Usuario de PostgreSQL
    host: 'localhost',               // Servidor local
    database: 'supermercado1',       // Nombre de la base de datos
    password: 'Charizard100',        // Contraseña del usuario
    port: 5432,                      // Puerto de PostgreSQL
});

app.use(express.json());

// Ruta para servir el archivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para realizar consultas a la base de datos
app.post('/consulta', async (req, res) => {
    const { query, params } = req.body; // Consulta SQL y parámetros
    try {
        const result = await pool.query(query, params || []);
        res.json(result.rows); // Devolver los resultados en formato JSON
    } catch (error) {
        res.status(500).json({ error: error.message }); // Enviar errores si ocurren
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
