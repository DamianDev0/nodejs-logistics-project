import { Router } from 'express';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routerWarehouse = Router();

const fileWareHousesPath = path.join(__dirname, '../../server/data.json');

// Función que lee el archivo de almacenes
const readWarehouse = async () => {
    try {
        const warehouses = await fs.readFile(fileWareHousesPath, 'utf-8');
        return JSON.parse(warehouses);
    } catch (err) {
        console.error(err);
        throw new Error('Error reading warehouses');
    }
};

// Función que escribe en el archivo de almacenes
const writeWarehouse = async (warehouses) => {
    try {
        await fs.writeFile(fileWareHousesPath, JSON.stringify(warehouses), 'utf-8');
    } catch (err) {
        console.error(err);
        throw new Error('Error writing warehouses');
    }
};

// Ruta para crear un nuevo warehouse
routerWarehouse.post('/', async (req, res) => {
    try {
        // Leer todos los datos desde el archivo JSON
        const data = await readWarehouse();
        const parkedVehicleId = req.body.parkedVehicleId        

        const findVehicleId = data.vehicles.find(v => v.id === parkedVehicleId)

        if(!findVehicleId){
            return res.status(404).json({ message: "Warehouse not found" });
        }

        // Crear el nuevo almacén
        const newWarehouse = {
            id: data.warehouses.length + 1,
            name: req.body.name,
            location: req.body.location,
            parkedVehicleId: parkedVehicleId,
            driversId: [],
            shipments: [] 
        };

        data.warehouses.push(newWarehouse);
      
        // Guardar los datos actualizados en el archivo JSON
        await writeWarehouse(data);

        res.status(201).json({ message: "Warehouse created successfully", warehouse: newWarehouse });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Ruta para obtener todos los warehouses
routerWarehouse.get('/', async (req, res) => {
    try {
        const data = await readWarehouse();
        res.json(data.warehouses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ruta para obtener un warehouse por ID
routerWarehouse.get('/:id', async (req, res) => {
    try {
        const data = await readWarehouse();
        const findWarehouse = data.warehouses.find(w => w.id === parseInt(req.params.id, 10));

        if (!findWarehouse) {
            return res.status(404).json({ message: "Warehouse not found" });
        }

        res.json(findWarehouse);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ruta para actualizar un warehouse por ID
routerWarehouse.put('/:id', async (req, res) => {
    try {
        const data = await readWarehouse();
        const indexWarehouse = data.warehouses.findIndex(w => w.id === parseInt(req.params.id, 10));

        if (indexWarehouse === -1) {
            return res.status(404).json({ message: "Warehouse not found" });
        }

        const updatedWarehouse = {
            ...data.warehouses[indexWarehouse],
            name: req.body.name || data.warehouses[indexWarehouse].name,
            location: req.body.location || data.warehouses[indexWarehouse].location,
            parkedVehicleId: req.body.parkedVehicleId || data.warehouses[indexWarehouse].parkedVehicleId,
            driverId: req.body.driverId || data.warehouses[indexWarehouse].driverId
        };

        data.warehouses[indexWarehouse] = updatedWarehouse;
        await writeWarehouse(data);

        res.json({ message: 'Warehouse updated successfully', warehouse: updatedWarehouse });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Ruta para eliminar un warehouse por ID
routerWarehouse.delete('/:id', async (req, res) => {
    try {
        const data = await readWarehouse();
        const indexWarehouseDelete = data.warehouses.findIndex(w => w.id === parseInt(req.params.id, 10));

        if (indexWarehouseDelete === -1) {
            return res.status(404).json({ message: "Warehouse not found" });
        }

        data.warehouses.splice(indexWarehouseDelete, 1);
        await writeWarehouse(data);

        res.json({ message: 'Warehouse deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default routerWarehouse;
