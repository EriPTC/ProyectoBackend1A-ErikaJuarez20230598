import bannerModel from "../models/banners.js";

import { v2 as cloudinary } from "cloudinary";

//Array de funciones
const bannerController = {};

//SELECT
bannerController.getAllBanners = async (req, res) => {
  try {
    const banners = await bannerModel.find();
    return res.status(200).json(banners);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//INSERT
bannerController.insertBanner = async (req, res) => {
  try {
    //#1- Solicitar los datos
    const { title, subtitle } = req.body;

    //#2- lleno el modelo con esos datos
    const newBanner = new bannerModel({
      title,
      subtitle,
      image: req.file.path,
      public_id: req.file.filename,
    });

    //#3- Guardamos en la base de datos
    await newBanner.save();

    return res.status(200).json({ message: "Banner saved" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//ELIMINAR
bannerController.deleteBanner = async (req, res) => {
  try {
    //Buscamos cual es el registro a eliminar
    const bannerFound = await bannerModel.findById(req.params.id);

    //Eliminamos la imagen de Cloudinary
    await cloudinary.uploader.destroy(bannerFound.public_id);

    //Eliminar de la base de datos
    await bannerModel.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Banner deleted" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//ACTUALIZAR
bannerController.updateBanners = async (req, res) => {
  try {
    //#1- Solicito los nuevos datos
    const { title, subtitle } = req.body;

    //Identifico a que usuario estoy actualizando
    const bannerFound = await bannerModel.findById(req.params.id);

    const updatedData = {
      title,
      subtitle,
    };

    //Si viene una imagen
    if (req.file) {
      //Eliminar la imagen anterior
      await cloudinary.uploader.destroy(bannerFound.public_id);

      //Guardo la imagen nueva
      updatedData.image = req.file.path;
      updatedData.public_id = req.file.filename;
    }

    //Guardo en la base de datos
    await bannerModel.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });

    return res.status(200).json({ message: "Banner updated" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server erro" });
  }
};

export default bannerController;
