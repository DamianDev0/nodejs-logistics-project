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

        const data = await readDrivers()

        const newDriver = {
            id: data.drivers.length + 1,
            name: req.body.name
        }

        data.drivers.push(newDriver)
        await writeDrivers(data)

        res.json({message: 'shipment created successfully', driver: newDriver})

    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }

})

routerDrivers.get('/', async (req, res) => {
    const data = await readDrivers()
    res.json(data.drivers)
})


export default routerDrivers