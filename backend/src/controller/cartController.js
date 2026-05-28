import cartModel from "../models/cart.js";
import productsModel from "../models/products.js";

//Array de funciones
const cartController = {};

//SELECT
cartController.getAllCarts = async (req, res) => {
  try {
    const carts = await cartModel
      .find()
      .populate("customerId", "name email")
      .populate("products.productId", "name price");

    return res.status(200).json(carts);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//SELECT BY ID
cartController.getCartById = async (req, res) => {
  try {
    const cart = await cartModel
      .findById(req.params.id)
      .populate("customerId", "name email")
      .populate("products.productId", "name");

    return res.status(200).json(cart);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//INSERT
cartController.insertCart = async (req, res) => {
  try {
    //#1- Solicito los datos a guardar
    const { customerId, products, status } = req.body;

    ////////// Calculo de subotal y total ////////

    //Variable para guardar el total del carrito
    let total = 0;

    //Arreglo de productos
    let newProducts = [];

    //De todos los productos que me envíe el frontend
    //los voy a recorrer uno por uno para
    //calcularles el subtotal y el total
    for (let i = 0; i < products.length; i++) {
      //Buscar el producto en la base de datos
      const productsFound = await productsModel.findById(products[i].productId);

      //Calcular el subtotal
      const subtotal = productsFound.price * products[i].quantity;

      //Calcular cuanto de total llevamos
      total += subtotal;

      //Guardamos el producto junto con el subtotal calculado
      newProducts.push({
        productId: products[i].productId,
        quantity: products[i].quantity,
        subtotal: subtotal,
      });
    }

    //Guardar en la base de datos
    const newCart = new cartModel({
      customerId,
      products: newProducts,
      total,
      status,
    });

    await newCart.save();

    return res.status(200).json({ message: "Cart saved" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//UPDATE
cartController.updateCart = async (req, res) => {
  try {
    //#1- Solicitamos los nuevos datos
    const { customerId, products, status } = req.body;

    ///////Calculo de subtotal y total
    let total = 0;

    let newProducts = [];

    //Recorrer todos los productos para calcularles el subtotal a cada uno
    for (let i = 0; i < products.length; i++) {
      //Buscar el producto
      const productFound = await productsModel.findById(products[i].productId);

      //Calcular el subtotal
      const subtotal = productFound.price * products[i].quantity;

      //Calculamos el total
      total += subtotal;

      //Guardamos el producto junto con su subtotal
      newProducts.push({
        productId: products[i].productId,
        quantity: products[i].quantity,
        subtotal: subtotal,
      });
    }

    //Actualizo todo en la base de datos
    const updateCart = await cartModel.findByIdAndUpdate(
      req.params.id,
      {
        customerId,
        products: newProducts,
        total,
        status,
      },
      { new: true },
    );

    return res.status(200).json({ message: "Cart updated" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//ELIMINAR
cartController.deleteCart = async (req, res) => {
  try {
    const cart = await cartModel.findByIdAndDelete(req.params.id);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    return res.status(200).json({ message: "Cart deleted" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default cartController;
