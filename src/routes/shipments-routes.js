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
        const vehicleId = req.body.vehicleId
        const wareHouseId = req.body.warehouseId
        
        const findWareHouseId = data.warehouses.find(w => w.id === wareHouseId)
        const findVehicleId = data.vehicles.find(v => v.id === findWareHouseId)

        if(!findWareHouseId, findVehicleId){
            return res.status(404).send('Warehouse id not found')
        }

        const newShipment = {
            id: data.shipments.length + 1,
            item: req.body.item,
            quantity : req.body.quantity,
            warehouseId: wareHouseId,
            vehicleId: vehicleId
        }

        data.shipments.push(newShipment)
        findWareHouseId.shipments.push(newShipment.id)

        await writeShipments(data)

        res.json({message: 'shipment created successfully', shipment: newShipment})

    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }

})

//obtener los shipments 
routerShipments.get('/', async (req, res) => {
    const data = await readShipments()
    res.json(data.shipments)
    
})

//obtner los shipments por id

routerShipments.get('/:id', async (req, res) => {
    try {
        
        const data = await readShipments()
        const findShipment = data.shipments.find(s => s.id === parseInt(req.params.id, 10))

        if(!findShipment){
            return res.status(404).json({ message: 'Shipment not found'})
        }

        res.json({message: 'shipments found', shipment: findShipment})

    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
})

//actualizar un shipment
routerShipments.put('/:id', async (req, res) => {
    const data = await readShipments()
    const indexShipment = data.shipments.findIndex(s => s.id === parseInt(req.params.id, 10))

    if(indexShipment === -1){
        return res.status(404).json({message: 'Shipment not found'})
    }

    const updatedShipment = {
        ...data.shipments[indexShipment],
        item: req.body.item || data.shipments[indexShipment].item,
        quantity: req.body.quantity || data.shipments[indexShipment].quantity,
        warehouseId: req.body.warehouseId || data.shipments[indexShipment].warehouseId

    }

    data.shipments[indexShipment] = updatedShipment
    await writeShipments(data)

    res.json({message: 'Shipment updated successfully', shipment: updatedShipment})
})


// eliminar un shipment

routerShipments.delete('/:id', async (req,res) => {
    try {

        const data = await readShipments()
        const indexShipmentDelete = data.shipments.findIndex(s => s.id === parseInt(req.params.id, 10))

        if(indexShipmentDelete === -1){
            return res.status(404).json({message: 'Shipment not found'})
        }

        data.shipments.splice(indexShipmentDelete, 1)
        await writeShipments(data)
        res.json({message: 'Shipment deleted successfully'})
    }
    catch (err){
        res.status(500).json({ error: err.message });
    }
})

export default routerShipments