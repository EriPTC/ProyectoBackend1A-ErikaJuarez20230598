import deliveryDriverModel from "../models/deliveryDrivers.js";

import {v2 as cloudinary} from "cloudinary"

//Array de funciones
const deliveryDriverController = {}

//SELECT
deliveryDriverController.getAllDrivers = async (req, res) => {
    try {
        const drivers = await deliveryDriverModel.find()
        return res.status(200).json(drivers)
    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
}

//SELECT by ID
deliveryDriverController.getDriverById = async (req, res) => {
    try {
        const driver = await deliveryDriverModel.findById(req.params.id)

        if(!driver){
            return res.status(404).json({message: "Not found"})
        }

        return res.status(200).json(driver)
    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
}

//INSERT
deliveryDriverController.insertDrivers = async (req, res) => {
    try {
        
        //#1- Solicito los datos a guardar
        const{ name, phone, cars, isActive } = req.body

        //llenar el modelo con los datos que me mandan
        const newDriver = new deliveryDriverModel({
            name,
            phone,
            image:  req.file.path,
            public_id: req.file.filename,
            cars,
            isActive
        })

        //Guardo todo en la base de datos
        await newDriver.save()
    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
}


//ELIMINAR
deliveryDriverController.deleteDrivers = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
    
}

