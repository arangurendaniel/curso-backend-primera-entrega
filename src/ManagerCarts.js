import fs from "fs";

class ManagerCarts {
    static id = 0;

    static increaseId() {
        ManagerCarts.id++;
    }

    async getCarts() {
        try {
            const data = await fs.promises.readFile("./Carts.json", "utf-8");
            const respData = JSON.parse(data);
            return respData
        } catch (error) {
            return []            
        }
    }

    async startCart() {
        let carts = await this.getCarts()
        ManagerCarts.increaseId()
        const id = ManagerCarts.id;
        const newCart = {
            id,
            products: []
        }
        carts = [...carts, newCart]
        await fs.promises.writeFile("./Carts.json", JSON.stringify(carts, null, 2));
    }

    async findCart(cartId) {
        let carts = await this.getCarts()
        const myCart = carts.find((cart) => cart.id === cartId)
        return myCart
    }

    async addProductToCart(cartId, productId) {
        let cart = await this.findCart(cartId);
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
            let allCarts = await this.getCarts()
            allCarts = allCarts.map((iteratedCart) => {
                if (iteratedCart.id === cart.id) {
                    iteratedCart = {...cart}
                    return iteratedCart
                } else {
                    return iteratedCart
                }
            })
            await fs.promises.writeFile("./Carts.json", JSON.stringify(allCarts, null, 2));
            return 1
        } else {
            return undefined
        }
    }

}

export default ManagerCarts