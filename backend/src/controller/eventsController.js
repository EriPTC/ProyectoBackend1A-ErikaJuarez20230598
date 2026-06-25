import eventModel from "../models/events.js";

//Array de funciones
const eventController = {};

//SELECT
eventController.getEvents = async (req, res) => {
  try {
    //Solicitar en que página estamos
    //y cual es el limite de datos a mostrar
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 20;

    const skip = (page - 1) * limit;

    const total = await eventModel.countDocuments();

    const events = await eventModel.find().skip(skip).limit(limit);

    return res.status(200).json({ events });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//INSERT
eventController.insertEvent = async (req, res) => {
  try {
    //#1- Solicito los datos a guardar
    const { customerName, cantPieces, eventDate } = req.body;

    //#2- Llenar el modelo con estos datos
    const newEvent = new eventModel({ customerName, cantPieces, eventDate });

    //#3- Guardar todo en la base de datos
    await newEvent.save();
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//DELETE
eventController.deleteEvent = async (req, res) => {
  try {
    await eventModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Event deleted" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//UPDATE
eventController.updateEvent = async (req, res) => {
  try {
    //#1- Solicito los nuevos datos
    const { customerName, cantPieces, eventDate } = req.body;

    //#2- Actualizo
    await eventModel.findByIdAndUpdate(
      req.params.id,
      {
        customerName,
        cantPieces,
        eventDate,
      },
      { new: true },
    );
    return res.status(200).json({ message: "Event updated" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default eventController;
