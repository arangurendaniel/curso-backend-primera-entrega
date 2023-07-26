import { Router } from "express";
import ManagerProducts from "../ManagerProducts.js";

const manager = new ManagerProducts();

const productsRouter = Router();

productsRouter.get("/", (req, resp) => {
    manager.getProducts()
    .then((data) => {
        let limit = req.query.limit

        if (limit) {
            limit = parseInt(limit)
            resp.send(data.slice(0, limit))
        } else {
            resp.send(data)
        }
    })
})

productsRouter.get("/:pid", (req, resp) => {
    manager.getProducts()
    .then((data) => {
        let productId = req.params.pid;
        let numero = isNaN(productId)
        if (!numero) {
            productId = parseInt(productId);
    
            let producto = data.find((data) => data.id === productId)
    
            if (producto) {
                resp.send(producto)
            } else {
                resp.send(`No existe ningún producto con el ID: ${productId}`)
            }
        } else {
            resp.send("Los id de productos solo contienen numeros")
        }
    })
})


productsRouter.post("/", async(req, resp) => {
    const newProduct = req.body;
    const result = await manager.crearProducto(newProduct);
    if (result) {
        resp.send("The product was addedd successfully")
    } else {
        resp.status(400).send("There was an error adding the prodcut")
    }
})

productsRouter.put("/:pid", (req, resp) => {
    let productId = req.params.pid;
    let newProduct = req.body
    manager.getProducts()
    .then((ProductsData) => {
        let numero = isNaN(productId)
        if (!numero) {
            productId = parseInt(productId);
    
            let productoOriginal = ProductsData.find((ProductData) => ProductData.id === productId)
    
            if (productoOriginal) {
                manager.modificarProducto(productoOriginal, newProduct)
                resp.status(200).send("Producto Modificado")
            } else {
                resp.send(`No existe ningún producto con el ID: ${productId}`)
            }
        } else {
            resp.send("Los id de productos solo contienen numeros")
        }
    })
})


productsRouter.delete("/:pid", (req, resp) => {
    let productId = req.params.pid;
    let numero = isNaN(productId)
    if (!numero) {
        productId = parseInt(productId);
        manager.deleteProduct(productId)
        resp.send("The product was deleted successfully")
    } else {
        resp.send("Los id de productos solo contienen numeros")
    }
})

export default productsRouter;