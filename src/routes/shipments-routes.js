import { Router } from 'express';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

//router

const routerShipments = Router()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//path
const fileShipmentsPath = path.join(__dirname, '../../server/data.json')

// leer archivo 

const readShipments = async () => {
    try {

        const shipments = await fs.readFile(fileShipmentsPath, 'utf-8');
        return JSON.parse(shipments)

    }
    catch (err){
        console.error(err)
        throw new Error('Error reading shipments');
    }
}
//escribir en el archivo

const writeShipments = async (shipment)  => {
    try {
        await fs.writeFile(fileShipmentsPath, JSON.stringify(shipment), 'utf-8')

    }
    catch{
        console.error(err)
        throw new Error('Error writing shipments');
    }
}


//crear un nuevo shipment

routerShipments.post('/', async (req, res) => {
    try {

        const data = await readShipments()
        const wareHouseId = req.body.warehouseId
        const findWareHouseId = data.warehouses.find(w => w.id === wareHouseId)

        if(!findWareHouseId){
            return res.status(404).send('Warehouse id not found')
        }

        const newShipment = {
            id: data.shipments.length + 1,
            item: req.body.item,
            quantity : req.body.quantity,
            warehouseId: wareHouseId
        }

        data.shipments.push(newShipment)
        await writeShipments(data)

        res.json({message: 'shipment created successfully', shipment: newShipment})

    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }

})



export default routerShipments