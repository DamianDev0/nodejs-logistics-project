import { Router } from 'express';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

//router

const routerDrivers = Router()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//path
const fileDriversPath = path.join(__dirname, '../../server/data.json')

// leer archivo 

const readDrivers = async () => {
    try {

        const drivers = await fs.readFile(fileDriversPath, 'utf-8');
        return JSON.parse(drivers)

    }
    catch (err){
        console.error(err)
        throw new Error('Error reading shipments');
    }
}
//escribir en el archivo

const writeDrivers = async (drivers)  => {
    try {
        await fs.writeFile(fileDriversPath, JSON.stringify(drivers), 'utf-8')
    }
    catch{
        console.error(err)
        throw new Error('Error writing driver');
    }
}


//crear un nuevo shipment

routerDrivers.post('/', async (req, res) => {
    try {
        // Leer todos los datos desde el archivo JSON
        const data = await readDrivers();
        const warehouseId = req.body.warehouseId;

        // Buscar el almacén
        const findWarehouse = data.warehouses.find(w => w.id === warehouseId);
        
        // Verificar si el almacén existe
        if (!findWarehouse) {
            return res.status(404).json({ message: 'Warehouse not found' });
        }

        // Validar datos de entrada
        const name = req.body.name;
        if (!name) {
            return res.status(400).json({ message: 'Driver name is required' });
        }

        // Crear el nuevo conductor
        const newDriver = {
            id: data.drivers.length + 1,
            name: name,
            warehouseId: warehouseId,
            vehiclesId: []
        };

        data.drivers.push(newDriver);

        findWarehouse.driversId.push(newDriver.id);

        await writeDrivers(data);


        res.status(201).json({ message: 'Driver created successfully', driver: newDriver });
    } catch (err) {
        console.error(err); // Agregar esta línea para registrar el error
        res.status(500).json({ error: err.message });
    }
});


routerDrivers.get('/', async (req, res) => {
    const data = await readDrivers()
    res.json(data.drivers)
})


export default routerDrivers