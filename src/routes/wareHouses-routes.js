import { Router } from 'express';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routerWarehouse = Router();

const fileWareHousesPath = path.join(__dirname, '../../server/data.json');

const readWarehouse = async () => {
    try {
        const warehouses = await fs.readFile(fileWareHousesPath, 'utf-8');
        return JSON.parse(warehouses);
    } catch (err) {
        console.error(err);
        throw new Error('Error reading warehouses');
    }
};

const writeWareHouse = async (warehouses) => {
    try {
        await fs.writeFile(fileWareHousesPath, JSON.stringify(warehouses), 'utf-8');
    } catch (err) {
        console.error(err);
        throw new Error('Error writing warehouses');
    }
};


// ruta para crear un nuevo warehouse

routerWarehouse.post('/', async (req, res) => {
    try {
        const data = await readWarehouse();

        const newWaterHouse = {
            id: data.warehouses.length + 1,
            name: req.body.name,
            location: req.body.location
        };

        data.warehouses.push(newWaterHouse);
        await writeWareHouse(data);

        res.status(201).json({message: "Warehouse created successfully", wareHouse: newWaterHouse});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ruta para obtener todos los warehouses

routerWarehouse.get('/', async (req,res) => {
    try {
        const data = await readWarehouse()
        res.json(data.warehouses);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }

})

//ruta para obtener por el id

routerWarehouse.get('/:id', async (req,res) => {
    try {

        const data = await readWarehouse()
        const findWareHouse = data.warehouses.find(w => w.id === parseInt(req.params.id, 10))

        if (!findWareHouse) {
            return res.status(404).json({ message: "Warehouse not found" });
        }

        res.json(findWareHouse);

    }

    catch (err) {
        res.status(500).json({ error: err.message });
    }
})

export default routerWarehouse;
