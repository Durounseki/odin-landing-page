
// Product display logic
const tabs = document.querySelectorAll(".tab");
const productsContainer = document.querySelector("#products-container");
const products = document.querySelectorAll(".product-container");
const flavorsLists = document.querySelectorAll(".flavors");
tabs.forEach(tab => tab.addEventListener('click', switchActiveProduct));

function switchActiveProduct(event){
    clearContainer();
    const button=event.target;
    const product = document.querySelector(`.product-container[name=${button.getAttribute("name")}]`);
    const flavorsList = document.querySelector(`.flavors[name=${button.getAttribute("name")}]`);
    //Display active product and show selected tab
    button.classList.add("active");
    product.classList.add("active");
    flavorsList.classList.add("active");
    //Scroll back to top
    productsContainer.scrollTo({
        top:0,
        behavior: 'smooth'
    });
}

function clearContainer(){
    tabs.forEach(tab => {
        if(tab.classList.contains("active")){
            tab.classList.remove("active");
        }
    });
    products.forEach(product => {
        if(product.classList.contains("active")){
            product.classList.remove("active");
        }
    });
    flavorsLists.forEach(flavorsList => {
        if(flavorsList.classList.contains("active")){
            flavorsList.classList.remove("active");
        }
    });
}

// Shopping cart object
const shoppingCart = {
    //An array to keep track of the products added to the shoppingCart
    addedProducts: [],
    totalPrice: 0,
    calculateTotal: function() {
        let totalPrice = 0;
        totalPrice = this.addedProducts.reduce((total,product) => {
            return total + (product.price * product.quantity);
        },0);
        return totalPrice;
    }
}

// Product object constructor
function product(name,price,flavor){
    this.name = name;
    this.price = price;
    this.flavor = flavor;
    this.quantity = 1;
}

const addButtons = document.querySelectorAll('.add-button');
addButtons.forEach(button => button.addEventListener('click',addProduct));

function addProduct(event){
    const button = event.target;
    const details = getProductDetails(button);
    manageShoppingCart(details);
}

function getProductDetails(button){
    //Look for the flavor container
    const flavorContainer = button.closest('.flavor');
    //Look for the name of the product
    const name = flavorContainer.closest('.flavors').getAttribute('name');
    //Look for the price
    const priceText = flavorContainer.querySelector('.product-details p:first-child').textContent;
    //Extract the numbers and round to 2 decimal points
    const price = parseFloat(priceText.replace(/[^0-9.]/g, '')).toFixed(2); 
    //Look for the flavor
    const flavor = flavorContainer.querySelector('.product-details p:last-child').textContent;
    // //update quantity
    // const quantityInput = button.closest('input');
    // const quantity = quantityInput.value;

    return {name,price,flavor}
}

function manageShoppingCart(details){
    //Check if product already exist on the shopping cart
    //if it does, then increase quantity, otherwise add product
    const existingProduct = shoppingCart.addedProducts.find(product => 
        product.name === details.name && product.flavor === details.flavor
    );
    
    if(existingProduct){
        existingProduct.quantity++;
    }else{
        const newProduct = new product(details.name, details.price, details.flavor);
        shoppingCart.addedProducts.push(newProduct);
    }
    //Update the total price
    shoppingCart.totalPrice=shoppingCart.calculateTotal();
    console.log(shoppingCart);
}