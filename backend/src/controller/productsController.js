//Creo un array de métodos
const productsController = {};
//import el Schema de la colección que
// voy a ocupar
import productsModel from "../models/products.js";

//SELECT
productsController.getProducts = async (req, res) => {
  const products = await productsModel.find();
  res.json(products);
};

//INSERT
productsController.insertProducts = async (req, res) => {
  const { name, description, price, stock } = req.body;
  const newProduct = new productsModel({ name, description, price, stock });
  await newProduct.save();
  res.json({ message: "Product save" });
};

//UPDATE
productsController.updateProducts = async (req, res) => {
  const { name, description, price, stock } = req.body;
  await productsModel.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      price,
      stock,
    },
    { new: true },
  );

  res.json({ message: "product updated" });
};

//ELIMINAR
productsController.deleteProducts = async (req, res) => {
  await productsModel.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
};

//SELECT solo 1 por id
productsController.getProductById = async (req, res) => {
  try {
    const product = await productsModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//BUSCAR por nombre
productsController.searchByName = async (req, res) => {
  try {
    //#1- Solicito los datos
    const { name } = req.body;

    const products = await productsModel.find({
      name: { $regex: name, $options: "i" },
    });

    if (!products) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(products);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Productos con stock bajo
productsController.getLowStock = async (req, res) => {
  try {
    const products = await productsModel.find({ stock: { $lt: 5 } });

    return res.status(200).json(products);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//FILTROS que el usuario coloque
productsController.getProductsByPriceRange = async (req, res) => {
  try {
    //#1- Solicito los datos
    const { min, max } = req.body;

    const products = await productsModel.find({
      price: { $gte: min, $lte: max },
    });

    if (!products) {
      return res.status(404).json({ message: "Products not found" });
    }

    return res.status(200).json(products);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Contar cuantos elementos hay en una colección
productsController.countProducts = async (req, res) => {
  try {
    const count = await productsModel.countDocuments();

    return res.status(200).json(count);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default productsController;
