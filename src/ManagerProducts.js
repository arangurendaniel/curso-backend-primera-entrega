import fs from "fs";

class ManagerProducts {

    static id = 16;

    static increaseId() {
        ManagerProducts.id++;
    }

    async getProducts() {
        try {
            const data = await fs.promises.readFile("./Productos.json", "utf-8");
            const respData = JSON.parse(data);
            return respData
        } catch (error) {
            return []            
        }
    }

    async crearProducto(newProduct) {
        let productos = await this.getProducts();
        if (productos) {
            if (!newProduct.title || !newProduct.description || !newProduct.price || !newProduct.stock || !newProduct.code) {
                console.log("Please include all properties")
                return undefined
            } else {
                const existingProduct = productos.find((product) => product.code === newProduct.code);
                if (existingProduct) {
                    console.log("That code has already been included, please use a different product code")
                    return undefined
                } else {
                    ManagerProducts.increaseId()
                    const id = ManagerProducts.id;
                    const producto = {
                        id, 
                        code: newProduct.code, 
                        title: newProduct.title,
                        description: newProduct.description,
                        price: newProduct.price,
                        thumbnails: newProduct.thumbnails,
                        stock: newProduct.stock,
                        status: true
                    }
                    productos = [...productos, producto ]
                    await fs.promises.writeFile("./Productos.json", JSON.stringify(productos, null, 2));
                    return "The product was addedd successfully"
                }
            }
        } else {
            console.log("There is a problem with the list of products")
            return undefined
        }
    }

    async modificarProducto(productoOriginal, newProduct) {
        if (!newProduct.title || !newProduct.description || !newProduct.price || !newProduct.stock || !newProduct.code || !newProduct.status) {
            console.log("Please include all properties")
            return undefined
        } else {
            const productoModificado = {
                id: productoOriginal.id, 
                code: newProduct.code, 
                title: newProduct.title,
                description: newProduct.description,
                price: newProduct.price,
                thumbnails: newProduct.thumbnails || [],
                stock: newProduct.stock,
                status: newProduct.status
            }
            let productos = await this.getProducts();
            const nuevaLista = productos.map((producto) => {
                if (producto.id === productoModificado.id) {
                    producto = productoModificado
                    return producto
                } else {
                    return producto
                }
            })
            await fs.promises.writeFile("./Productos.json", JSON.stringify(nuevaLista, null, 2));
            return "The product was modified successfully"
        }
    }

    async deleteProduct(productId) {
        console.log(`Product ID Manager: ${productId}`)
        let productos = await this.getProducts();
        const exists = productos.some((producto) => producto.id === productId)
        if (exists) {
            const nuevaLista = productos.filter((producto) => producto.id !== productId)
            await fs.promises.writeFile("./Productos.json", JSON.stringify(nuevaLista, null, 2));
        } else {
            console.log("ID not found")
        }
    }
}

export default ManagerProducts