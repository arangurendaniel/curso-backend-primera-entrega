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
}

export default ManagerCarts