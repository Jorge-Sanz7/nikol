const express = require("express");
const mysql = require("mysql2");
var bodyParser = require('body-parser');
var app = express();

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'n0m3l0',
    database: 'crudnode'
});

con.connect((err) => {
    if (err) {
        console.error("Error conectando a la base de datos:", err);
        return;
    }
    console.log("Conectado a la base de datos crudnode");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/agregarUsuario', (req, res) => {
    const id = req.body.id_us;
    const nombre = req.body.nombre;

    con.query('INSERT INTO usuario (id_us, nombre) VALUES (?, ?)', [id, nombre], (err, respuesta) => {
        if (err) {
            console.error("Error al insertar usuario:", err);
            return res.status(500).send("Error al conectar");
        }
        return res.send(`<h1>Usuario agregado: ${nombre} con ID: ${id}</h1>`);
    });
});

app.get('/obtenerUsuario', (req, res) => {
    con.query('SELECT * FROM usuario', (err, respuesta) => {
        if (err) {
            console.error('ERROR: ', err);
            return res.status(500).send("Error al obtener usuarios");
        }

        let userHTML = '';
        respuesta.forEach(user => {
            userHTML += `<tr><td>${user.id_us}</td><td>${user.nombre}</td></tr>`;
        });

        return res.send(`
            <h1>Lista de Usuarios</h1>
            <table border="1" cellpadding="5" cellspacing="0">
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                </tr>
                ${userHTML}
            </table>
            <br><a href="/">Volver</a>
        `);
    });
});

app.post('/borrarUsuario', (req, res) => {
    const id = req.body.id;

    con.query('DELETE FROM usuario WHERE id_us = ?', [id], (err, resultado) => {
        if (err) {
            console.error('Error al borrar el usuario:', err);
            return res.status(500).send("Error al borrar el usuario");
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).send("Usuario no encontrado");
        }
        return res.send(`Usuario con ID ${id} borrado correctamente`);
    });
});

app.post('/editarUsuario', (req, res) => {
    const id = req.body.id;
    const nombre = req.body.nombre;

    con.query('UPDATE usuario SET nombre = ? WHERE id_us = ?', [nombre, id], (err, resultado) => {
        if (err) {
            console.error('Error al editar el usuario:', err);
            return res.status(500).send("Error al editar el usuario");
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).send("Usuario no encontrado");
        }
        return res.send(`Usuario con ID ${id} actualizado correctamente a: ${nombre}`);
    });
});

app.get('/consultarUsuario', (req, res) => {
    const id = req.query.id;

    con.query('SELECT * FROM usuario WHERE id_us = ?', [id], (err, resultado) => {
        if (err) {
            console.error('Error al consultar el usuario:', err);
            return res.status(500).send("Error al consultar el usuario");
        }
        if (resultado.length === 0) {
            return res.status(404).send("Usuario no encontrado");
        }
        const user = resultado[0];
        return res.send(`<h1>ID: ${user.id_us}</h1><h2>Nombre: ${user.nombre}</h2>`);
    });
});

app.listen(10000, () => {
    console.log('Servidor escuchando en el puerto 10000');
});