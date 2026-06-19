import express from "express";
import productsRoutes from "./src/routes/products.js";
import branchesRoutes from "./src/routes/branches.js";
import employessRoutes from "./src/routes/employees.js";
import providerRoutes from "./src/routes/providers.js";
import customerRoutes from "./src/routes/customers.js";
import registerCustomer from "./src/routes/registerCustomer.js";
import cookieParser from "cookie-parser";
import loginCustomerRoutes from "./src/routes/loginCustomer.js";
import logoutRoutes from "./src/routes/logout.js";
import recovaeryPasswordRoutes from "./src/routes/recoveryPassword.js";
import cors from "cors";
import limiter from "./src/middlewares/limiter.js";
import bannerRoutes from "./src/routes/banners.js";
import cartRoutes from "./src/routes/cart.js";
import wompiRoutes from "./src/routes/wompi.js"
import DeliveryDriverRoutes from "./src/routes/deliveryDrivers.js"
import { validateAuthCookie } from "./src/middlewares/authMiddleware.js";

//Ejecutar express
const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    //Permitir el envío de cookies y credenciales
    credentials: true,
  }),
);

app.use(limiter);

app.use(cookieParser());

app.use(express.json());

//Creamos los endPoints
app.use("/api/products",  productsRoutes);
app.use("/api/branches", branchesRoutes);
app.use("/api/employees", validateAuthCookie(["admin"]), employessRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/registerCustomers", registerCustomer);
app.use("/api/loginCustomers", loginCustomerRoutes);
app.use("/api/logout", logoutRoutes);
app.use("/api/recoveryPassword", recovaeryPasswordRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wompi", wompiRoutes)
app.use("/api/deliveryDrivers", DeliveryDriverRoutes)

export default app;
