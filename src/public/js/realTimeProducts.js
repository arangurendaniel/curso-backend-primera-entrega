const socketClient = io();

const showProducts = (productList) => {
    const containerItems = document.querySelector(".container-items");
    containerItems.innerHTML = "";

    productList.forEach(element => {
        const productCart = document.createElement("div");
        productCart.classList.add("item");
        productCart.innerHTML = `
        <figure>
        <img src=${element.thumbnails[0]} alt=${element.title}>
        </figure>
        <div class="info-product">
        <h2>${element.title}</h2>
        <p>$${element.price}</p>
        <button class="btn-add-cart">Añadir al carrito</button>
        </div>    
        `
        containerItems.append(productCart);            
    })
};

socketClient.on("sendingProductsFromServer", (productList) => {
    showProducts(productList)
});

let form = document.getElementById("formProducts-add");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    let title = form.elements.title.value
    let description = form.elements.description.value
    let stock = form.elements.stock.value
    let thumbnails = form.elements.thumbnails.value
    let category = form.elements.category.value
    let price = form.elements.price.value
    let code = form.elements.code.value

    const newProduct = {
    title,
    description,
    stock,
    thumbnails: [thumbnails],
    category,
    price,
    code,
    }

    console.log(newProduct)

    socketClient.emit("addProductToStore", newProduct)

    form.reset()
})

const deleteBtn = document.getElementById("delete-btn");
deleteBtn.addEventListener("click", () => {
    const deleteIdInput = document.getElementById("delete-id-input");
    const deleteId = parseInt(deleteIdInput.value)
    socketClient.emit("deleteProduct", deleteId);
    deleteIdInput.value = "";
})
