import { Router } from 'express';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routerVehicles = Router();

const filevehiclePath = path.join(__dirname, '../../server/data.json');

const readVehicles = async () => {
    try {
        const vehicle = await fs.readFile(filevehiclePath, 'utf-8');
        return JSON.parse(vehicle);
    } catch (err) {
        console.error(err);
        throw new Error('Error reading vehicles');
    }
}

const writeVehicles = async (vehicle) => {
    try {
        await fs.writeFile(filevehiclePath, JSON.stringify(vehicle), 'utf-8');
    } catch (err) {
        console.error(err);
        throw new Error('Error writing vehicles');
    }
}

routerVehicles.post('/', async (req, res) => {
    try {
        const data = await readVehicles();
        const driverId = req.body.driverId;
        const warehousesId = req.body.warehousesId

        const findDriver = data.drivers.find(d => d.id === driverId);
        const findWareHouse = data.warehouses.map(id => data.warehouses.find(w => w.id === warehousesId))


        if (!findDriver && !findWareHouse) {
            return res.status(404).send('Driver id not found');
        }

        const newVehicle = {
            id: data.vehicles.length + 1,
            model: req.body.model,
            year: req.body.year,
            warehousesId : [warehousesId],
            driverId: driverId,

        }

        findDriver.vehiclesId.push(newVehicle.id)
        data.vehicles.push(newVehicle);

        await writeVehicles(data);

        res.status(201).json({ message: "Vehicle created successfully", vehicle: newVehicle });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
})

routerVehicles.get('/', async (req, res) => {
    try {
        const data = await readVehicles();
        res.json(data.vehicles);
        
    } catch (err) {
        res.status(500).send('Internal server error');
    }

})

export default routerVehicles;
