import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import __dirname from "./utils.js";
import handlebars  from 'express-handlebars';
import viewRouter from "./routes/view.router.js";
import { Server } from "socket.io";
import ManagerProducts from "./ManagerProducts.js";

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(express.text());

//Static Files
app.use(express.static(__dirname + "/public"))    

//Handlebars Config
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars")
app.set("views",__dirname + "/views" )

//Routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewRouter);

const managerProducts = new ManagerProducts();

const httpServer = app.listen(PORT, () => console.log(`Server on port: ${PORT}`));

const socketServer = new Server(httpServer)

socketServer.on("connection", async (socket) => {
    console.log("New Client - CLient's ID:", socket.id)

    const productList = await managerProducts.getProducts();
    socketServer.emit("sendingProductsFromServer", productList);

    socket.on("addProductToStore", async (product) => {
        if (product) {
            await managerProducts.crearProducto(product);
            console.log(product)
            const productList = await managerProducts.getProducts();
            socketServer.emit("sendingProductsFromServer", productList);
        } else {
            console.log("No recibo nada")
        }
    });

    socket.on("deleteProduct", async (id) => {
        await managerProducts.deleteProduct(id);
        const productList = await managerProducts.getProducts();
        socketServer.emit("sendingProductsFromServer", productList);
    })
})