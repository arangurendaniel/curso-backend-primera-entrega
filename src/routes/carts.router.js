import { Router } from "express";
import ManagerCarts from "../ManagerCarts.js";
import fs from 'fs';
import ManagerProducts from "../ManagerProducts.js";

const cartsRouter = Router();

const managerCarts = new ManagerCarts();
const managerProducts = new ManagerProducts()

cartsRouter.post("/", (req, resp) => {
    managerCarts.startCart()
    resp.status(200).send("The cart has been created")
})

cartsRouter.get("/:cid", (req, resp) => {
    let cartId = req.params.cid;
    let number = isNaN(cartId)
    if (!number) {
        cartId = parseInt(cartId);
        managerCarts.findCart(cartId)
        .then((data) => {
            if (data) {
                resp.status(200).send(data)
            } else {
                resp.status(400).send("ID not found")
            }
        })
    } else {
        resp.send("Error")
    }
})

cartsRouter.post("/:cid/product/:pid", async (req, resp) => {
    let cartId = req.params.cid;
    let productId = req.params.pid;

        let number = isNaN(cartId)
        let number2 = isNaN(productId)
    if (!number || !number2) {
        cartId = parseInt(cartId);
        productId = parseInt(productId);

        managerProducts.consultarProductos()
        .then((data) => {
            let product = data.find((data) => data.id === productId)
            if (!product) {
                console.log(product)
                resp.status(400).send(`There's no product with the ID ${productId}`)
                throw new Error(`There's no product with the ID ${productId}`)
            }
        })

        let cart = await managerCarts.findCart(cartId);

        const newProduct = {productId: productId, quantity: 1 }

        if (cart) {
            const exist = cart.products.some((product) => product.productId === productId)
            if (exist) {
                cart.products = cart.products.map((product) => {
                    if (product.productId === productId) {
                        product.quantity++
                        return product
                    } else {
                        return product
                    }
                })
            } else {
                cart.products.push(newProduct)
            }
            let allCarts = await managerCarts.getCarts()
            allCarts = allCarts.map((iteratedCart) => {
                if (iteratedCart.id === cart.id) {
                    iteratedCart = {...cart}
                    return iteratedCart
                } else {
                    return iteratedCart
                }
            })
            await fs.promises.writeFile("./Carts.json", JSON.stringify(allCarts, null, 2));
            return resp.status(200).send("The product was added successfully")
        } else {
            return resp.status(400).send("There's no cart with that ID")
        }
    } else {
        return resp.status(400).send("The product ID and the Cart ID must only have numbers")
    }
})

cartsRouter.delete("/:cid/product/:pid", async (req, resp) => {
    let cartId = req.params.cid;
    let productId = req.params.pid;

    let number = isNaN(cartId)
    let number2 = isNaN(productId)
    if (!number || !number2) {
        cartId = parseInt(cartId);
        productId = parseInt(productId);
        let cart = await managerCarts.findCart(cartId);

        if (cart) {
            const exist = cart.products.some((product) => product.productId === productId)

            if (exist) {
                cart.products = cart.products.filter((product) => product.productId !== productId)

                let allCarts = await managerCarts.getCarts()
                allCarts = allCarts.map((iteratedCart) => {
                    if (iteratedCart.id === cart.id) {
                        iteratedCart = {...cart}
                        return iteratedCart
                    } else {
                        return iteratedCart
                    }
                })
                await fs.promises.writeFile("./Carts.json", JSON.stringify(allCarts, null, 2));  
                return resp.status(200).send("The product was eliminated successfully")              
            } else {
                return resp.status(400).send(`There's no product with the ID: ${productId}`)
            }

        } else {
            return resp.status(400).send(`There's no product with the ID: ${productId}`)
        }

    } else {
        return resp.status(400).send("The ID of the product and the cart must only have numbers")
    }
})


export default cartsRouter;