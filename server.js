const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const app = express();
const cors = require('cors');
const port = 3000;

// Configuración de la conexión a la base de datos
const pool = new Pool({
    user: 'postgres',                // Usuario de PostgreSQL
    host: 'localhost',               // Servidor local
    database: 'supermercado1',       // Nombre de la base de datos
    password: 'Charizard100',        // Contraseña del usuario
    port: 5432,                      // Puerto de PostgreSQL
});

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use('/images', express.static(path.join(__dirname, 'public/images')));


app.post('/consulta', async (req, res) => {
    const { query, params } = req.body; 
    try {
        const result = await pool.query(query, params || []);
        res.json(result.rows); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/producto', async (req, res) => {
    console.log('Datos recibidos:', req.body);
    
    const { codigo, nombre, descripcion, categoria_id, precio_venta, fecha_vencimiento, cantidad_stock, proveedor_id } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO producto (codigo, nombre, descripcion, categoria_id, precio_venta, fecha_vencimiento, cantidad_stock, proveedor_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [codigo, nombre, descripcion, categoria_id, precio_venta, fecha_vencimiento, cantidad_stock, proveedor_id]
        );
        console.log('Producto agregado:', result.rows[0]); 
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error en la base de datos:', error); 
        res.status(500).json({ error: error.message });
    }
});


app.post('/editar-producto', async (req, res) => {
    const {
        id,
        codigo,
        nombre,
        descripcion,
        categoria_id,
        precio_venta,
        fecha_vencimiento,
        cantidad_stock,
        proveedor_id,
    } = req.body;

    try {
        await pool.query(
            `UPDATE producto
             SET codigo = $1,
                 nombre = $2,
                 descripcion = $3,
                 categoria_id = $4,
                 precio_venta = $5,
                 fecha_vencimiento = $6,
                 cantidad_stock = $7,
                 proveedor_id = $8
             WHERE id = $9`,
            [
                codigo,
                nombre,
                descripcion,
                categoria_id || null,
                precio_venta,
                fecha_vencimiento || null,
                cantidad_stock || null,
                proveedor_id || null,
                id,
            ]
        );

        res.status(200).send({ message: 'Producto actualizado exitosamente' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Error al actualizar el producto' });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
