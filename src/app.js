import express from 'express';
import dotenv from 'dotenv';
import routerWarehouse from './routes/wareHouses-routes.js'; 
import errorHandler from './middlewares/errHandler.js'; 
import routerShipments from './routes/shipments-routes.js';
import routerDrivers from './routes/drivers-routers.js';
import routerVehicles from './routes/vehiclues-routes.js'

dotenv.config();
const PORT = process.env.PORT || 4000;

const app = express(); 

app.use(express.json()); 

// Agregamos nuestro middleware
app.use(errorHandler);

// Añadimos las rutas
app.use('/warehouses', routerWarehouse);
app.use('/shipments', routerShipments)
app.use('/drivers', routerDrivers)
app.use('/vehicles', routerVehicles)

// Inicialización de la aplicación y le indicamos en qué puerto se va a escuchar
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
