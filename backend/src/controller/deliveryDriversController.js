import deliveryDriverModel from "../models/deliveryDrivers.js";

import { v2 as cloudinary } from "cloudinary";

//Array de funciones
const deliveryDriverController = {};

//SELECT
deliveryDriverController.getAllDrivers = async (req, res) => {
  try {
    const drivers = await deliveryDriverModel.find();
    return res.status(200).json(drivers);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//SELECT by ID
deliveryDriverController.getDriverById = async (req, res) => {
  try {
    const driver = await deliveryDriverModel.findById(req.params.id);

    if (!driver) {
      return res.status(404).json({ message: "Not found" });
    }

    return res.status(200).json(driver);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//INSERT
deliveryDriverController.insertDrivers = async (req, res) => {
  try {
    //#1- Solicito los datos a guardar
    const { name, phone, cars, isActive } = req.body;

    //llenar el modelo con los datos que me mandan
    const newDriver = new deliveryDriverModel({
      name,
      phone,
      image: req.file.path,
      public_id: req.file.filename,
      cars,
      isActive,
    });

    //Guardo todo en la base de datos
    await newDriver.save();
    return res.status(200).json({ message: "Driver saved" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//ELIMINAR
deliveryDriverController.deleteDrivers = async (req, res) => {
  try {
    //Buscamos el Repartidor a eliminar
    const driverFound = await deliveryDriverModel.findById(req.params.id);

    //Eliminar la imagen de Cloudinary
    await cloudinary.uploader.destroy(driverFound.public_id);

    //Eliminar de la base de datos
    const driverDeleted = await deliveryDriverModel.findByIdAndDelete(
      req.params.id,
    );

    if (!driverDeleted) {
      return res.status(404).json({ message: "Driver not found" });
    }

    return res.status(204).json({ message: "Driver deleted" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//UPDATE
deliveryDriverController.updateDriver = async (req, res) => {
  try {
    //#1- SOlicito los nuevos datos
    const { name, phone, cars, isActive } = req.body;

    //Identicar que Repartidor vamos a actualizar
    const driverFound = await deliveryDriverModel.findById(req.params.id);

    const updatedData = {
      name,
      phone,
      cars,
      isActive,
    };

    //Si llega a venir una imagen la actualizo.
    if (req.file) {
      //Eliminar la imagen anterior
      await cloudinary.uploader.destroy(driverFound.public_id);

      updatedData.image = req.file.path;
      updatedData.public_id = req.file.filename;
    }

    //Guardo todo lo actualizado en la base de datos
    await deliveryDriverModel.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });

    return res.status(200).json({ message: "Driver updated" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "internal server error" });
  }
};

export default deliveryDriverController;
