import { Router } from "express";
import ManagerProducts from "../ManagerProducts.js";

const managerProducts = new ManagerProducts();



const viewRouter = Router();

viewRouter.get("/realtimeproducts", (req, resp) => {
    resp.render("realtimeproducts")
})

viewRouter.get("/home", async (req, resp) => {
    const productList = await managerProducts.getProducts();
    console.log(productList)
    
    resp.render("home", {productList})
})

export default viewRouter