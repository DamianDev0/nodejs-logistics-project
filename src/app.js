import express from 'express';
import dotenv from 'dotenv';
import routerWarehouse from './routes/wareHouses-routes.js'; 
import errorHandler from './middlewares/errHandler.js'; 
import routerShipments from './routes/shipments-routes.js';

dotenv.config();
const PORT = process.env.PORT || 4000;

const app = express(); 

app.use(express.json()); 

// Agregamos nuestro middleware
app.use(errorHandler);

// Añadimos las rutas
app.use('/warehouses', routerWarehouse);
app.use('/shipments', routerShipments)

// Inicialización de la aplicación y le indicamos en qué puerto se va a escuchar
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
