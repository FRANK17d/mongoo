import express from 'express'   //importando el paquete express
import dotenv from 'dotenv'  
import { connectDB } from './config/db.js' 
import router from './routes/routes.js' //importando las rutas  

// Configuración de variables de entorno
dotenv.config()  

// Inicialización de la aplicación Express
const app = express()           //creando una instancia de express

// Configuración de middleware esencial
app.use(express.json())       //para que el servidor pueda recibir datos en formato JSON

// Enrutamiento de la API
app.use("/api/tareas", router) //CORREGIDO: ruta ajustada a "/api/tareas"

// Ruta de diagnóstico principal
app.get("/", (req, res) => {     
    res.send("Servidor del Gestor de Tareas funcionando correctamente") 
})  

// Extracción de variables de configuración
const PORT = process.env.PORT || 8000
const MONGO_URI = process.env.MONGO_URI  //CORREGIDO: variable consistente con .env

// Proceso de inicialización secuencial
const inicio = async() => {     
    try {         
        // Paso 1: Establecer conexión con MongoDB
        await connectDB(MONGO_URI)
        console.log("¡¡¡ Conectado a la base de datos de MongoDB !!!")
        
        // Paso 2: Iniciar servidor HTTP (sólo tras conexión exitosa)
        app.listen(PORT, () => {
            console.log(`Servidor ejecutándose en http://localhost:${PORT}`)
            console.log(`API de tareas disponible en http://localhost:${PORT}/api/tareas`)
        })
    } catch(error) {         
        console.log(`Error de inicialización: ${error.message}`)
        process.exit(1)  // Terminación controlada ante errores críticos
    } 
}  

// Ejecución del proceso de inicialización
inicio()