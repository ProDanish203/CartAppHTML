window.addEventListener("scroll", () => {
    const header = document.querySelector("header");
    header.classList.toggle("sticky", window.scrollY > 0);
});

const menu = document.getElementById("menu");
const nav = document.getElementById("nav");

menu.addEventListener("click", () => {
    nav.classList.toggle("active");
    menu.classList.toggle("fa-bars");
    menu.classList.toggle("fa-times");
});

window.addEventListener("click", (e) => {

    if(e.target.id != "nav" && e.target.id != "menu"){
        nav.classList.remove("active");
        menu.classList.add("fa-bars");
        menu.classList.remove("fa-times");
    }

});

const cart = document.getElementById("cartBtn");
const cartContainer = document.getElementById("cartContainer");

cart.addEventListener("click", () => {
    cartContainer.classList.toggle("active");
});


const productCards = document.querySelector(".product-cards");

window.addEventListener("DOMContentLoaded", () => {
    loadJSON();
    loadCart();
});

// Update Cart Info
function updateCartInfo(){
    let cartInfo = findCartInfo();
    cartCountInfo.textContent = cartInfo.productCount;
    cartTotalValue.textContent = `$${cartInfo.total}`;
    // console.log(cartInfo);
}



// Load product items content from JSON File

function loadJSON(){
    fetch('products.json')
    .then(response => response.json())
    .then(data => {
        let productCard = '';
        data.forEach(product => {
            productCard += `
        <div class="product-card">
            <img class="product-image" src="${product.imgSrc}" alt="shoe2">
            <div class="product-info">

            <h3 class="product-title">${product.name}</h3>
            <span class="product-category">${product.category}</span>
            <span class="product-price">$${product.price}</span>

            </div>

            <div class="product-card-overlay">
                <button class="btn add-to-cart-btn">
                    <i class="fas fa-shopping-cart"></i> Add To Cart</button>
            </div>
        </div>
            `;
        });
        productCards.innerHTML = productCard;
    })
    .catch(error => {
        alert("Use Live Server or Local Server");
    })
}

const cartCards = document.querySelector(".cart-list");
const cartTotalValue = document.getElementById("cart-total-value");
const cartCountInfo = document.getElementById("cart-count-info");

let cartItemId = 1;

// Deleting Products From Cart
cartCards.addEventListener("click", deleteProduct);

// Adding Products To Cart
productCards.addEventListener("click", purchaseProduct);

function purchaseProduct(e){
    if(e.target.classList.contains("add-to-cart-btn")){
        let product = e.target.parentElement.parentElement
        getProductInfo(product);
    }
}

function getProductInfo(product){
    let productInfo = {
        id: cartItemId,
        imgSrc: product.querySelector(".product-image").src,
        name: product.querySelector(".product-title").textContent,
        category: product.querySelector(".product-category").textContent,
        price: product.querySelector(".product-price").textContent
    }
    cartItemId++;
    // console.log(productInfo);
    addToCartList(productInfo);
    saveProductToStorage(productInfo);
}

function addToCartList(productInfo){
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.setAttribute("data-id", `${productInfo.id}`);
    cartItem.innerHTML = `
        <img src="${productInfo.imgSrc}" alt="headphones">

        <div class="cart-item-info">
            <h3 class="cart-item-name">${productInfo.name}</h3>
            <span class="cart-item-category">${productInfo.category}</span>
            <span class="cart-item-price">${productInfo.price}</span>
        </div>

        <button class="cart-item-del-btn">
            <i class="fas fa-times cart-del-btn"></i>
        </button>
    `;   
    cartCards.appendChild(cartItem);
}

function saveProductToStorage(item){
    let products = getProductsFromStorage();
    products.push(item);
    localStorage.setItem("products", JSON.stringify(products));
    updateCartInfo();
}

function getProductsFromStorage(){
    return localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [];

    // Returns empty array if there isn't any product info
}

function loadCart(){
    let products = getProductsFromStorage();
    if(products.length < 1){
        cartItemId = 1;
    }
    else{
        cartItemId = products[products.length - 1].id;
        cartItemId++;
    }
    // console.log(cartItemId);
    products.forEach(product => addToCartList(product));

    updateCartInfo();
}

// Calculate total price of the cart and other info 
function findCartInfo(){
    let products = getProductsFromStorage();
    let total = products.reduce((acc, product) => {
        let price = parseFloat(product.price.substr(1));
        // removing Dollar Symbol
        return acc += price;
    }, 0);

    // console.log(total);
    return{
        total: total.toFixed(2),
        productCount: products.length       
    }
}

function deleteProduct(e){
    let cartItem;
    if(e.target.tagName === "BUTTON"){
        cartItem = e.target.parentElement;
        cartItem.remove();
    }else if(e.target.tagName === "I"){
        cartItem = e.target.parentElement.parentElement;
        cartItem.remove();
    }

    let products = getProductsFromStorage();
    let updateProducts = products.filter(product => {
        return product.id !== parseInt(cartItem.dataset.id)
    });

    localStorage.setItem('products', JSON.stringify(updateProducts));
    
    updateCartInfo();

}

