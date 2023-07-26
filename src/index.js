import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(express.text());

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);



app.listen(PORT, () => console.log(`Server on port: ${PORT}`));