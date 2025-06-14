const express = require('express');
const fs = require('fs').promises; // Usamos la versión de promesas de fs
const path = require('path');
const cors = require('cors'); // Para permitir peticiones

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = "admin2024"; // La misma contraseña que en tu frontend

// --- Middlewares ---
app.use(cors()); // Habilita CORS para todas las rutas
app.use(express.json({ limit: '10mb' })); // Para poder leer JSON en el cuerpo de las peticiones
app.use(express.static(path.join(__dirname))); // Sirve los archivos estáticos (HTML, CSS, JS del cliente, imagen)

// --- Rutas de la API ---

// RUTA GET: Devuelve todos los datos de las estaciones
app.get('/api/estaciones', async (req, res) => {
    try {
        const data = await fs.readFile(path.join(__dirname, 'estaciones.json'), 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Error al leer el archivo de estaciones:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// RUTA POST: Recibe y guarda los datos actualizados
app.post('/api/estaciones', async (req, res) => {
    // Verificación de seguridad simple
    const password = req.body.password;
    if (password !== ADMIN_PASSWORD) {
        return res.status(401).send('Contraseña incorrecta.');
    }

    try {
        const nuevasEstaciones = req.body.data;
        // Valida que los datos recibidos sean un array
        if (!Array.isArray(nuevasEstaciones)) {
            return res.status(400).send('Formato de datos incorrecto.');
        }
        
        await fs.writeFile(path.join(__dirname, 'estaciones.json'), JSON.stringify(nuevasEstaciones, null, 2));
        res.status(200).send('Datos guardados correctamente.');
    } catch (error) {
        console.error('Error al escribir en el archivo de estaciones:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// --- Iniciar el servidor ---
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});