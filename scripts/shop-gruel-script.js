
// Product display logic
const tabs = document.querySelectorAll(".tab");
const productsContainer = document.querySelector("#products-container");
const products = document.querySelectorAll(".product-container");
const flavorsLists = document.querySelectorAll(".flavors");
tabs.forEach(tab => tab.addEventListener('click', switchActiveProduct));
const indicators = document.querySelectorAll('.indicator');
const indicatorsArray = [...indicators];

function switchActiveProduct(event){
    
    clearContainer();

    const button=event.target;
    const product = document.querySelector(`.product-container[name=${button.getAttribute("name")}]`);
    const flavorsList = document.querySelector(`.flavors[name=${button.getAttribute("name")}]`);
    const indicator = document.querySelector(`.indicator[name=${button.getAttribute("name")}]`);
    
    //Display active product and show selected tab
    button.classList.add("active");
    product.classList.add("active");
    flavorsList.classList.add("active");
    indicator.classList.add("active");
    //Scroll back to top
    productsContainer.scrollTo({
        top:0,
        behavior: 'smooth'
    });
}

function clearContainer(indicator){
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
    indicatorsArray.forEach(indicator => {
        if(indicator.classList.contains('active')){
            indicator.classList.remove('active');
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
        return totalPrice.toFixed(2);
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
addButtons.forEach(button => button.addEventListener('click',addNewProduct));

function addNewProduct(event){
    //Ensure that the button variable we create refers to the svg element itself
    //and not the path element inside the svg.
    const button = event.target.tagName === 'svg' ? event.target : event.target.parentNode;
    const details = getProductDetails(button);
    manageShoppingCart(details);
    //Remove event listener and show input element
    button.removeEventListener('click',addNewProduct);
    showControls(button,details);
}

function getProductDetails(element){
    //Look for the flavor container
    const flavorContainer = element.closest('.flavor');
    //Look for the name of the product
    const name = flavorContainer.closest('.flavors').getAttribute('name');
    //Look for the price
    const priceText = flavorContainer.querySelector('.product-details p:first-child').textContent;
    //Extract the numbers and round to 2 decimal points
    const price = parseFloat(priceText.replace(/[^0-9.]/g, '')).toFixed(2); 
    //Look for the flavor
    const flavor = flavorContainer.querySelector('.product-details p:last-child').textContent;
    // //update quantity
    const quantityInput = flavorContainer.querySelector('input');
    let quantity;
    if(quantityInput){
        quantity = quantityInput.value;
    }else{
        quantity = 1;
    }
    return {name,price,flavor,quantity}
}

function manageShoppingCart(details){
    //Check if product already exist on the shopping cart
    //if it does, then increase quantity, otherwise add product

    const productIndex = shoppingCart.addedProducts.findIndex(product =>
        product.name === details.name && product.flavor === details.flavor
        );
    
    if(productIndex > -1){ //If the product is in the shopping cart
        //If quantity = 0, remove product, otherwise update quantity
        if(details.quantity > 0){
            shoppingCart.addedProducts[productIndex].quantity = details.quantity;
        }else{
            shoppingCart.addedProducts.splice(productIndex,1); // Remove item
        }
        updateAddedProduct(productIndex,details);
    }else{ //Add new product to shopping cart
        const newProduct = new product(details.name, details.price, details.flavor);
        shoppingCart.addedProducts.push(newProduct);
        //Display new product in shopping cart
        newProductInDisplay(details);
    }
    //Update the total price
    shoppingCart.totalPrice=shoppingCart.calculateTotal();
    displayTotal();
    showIndicators(details);
    // updateShoppingCartDisplay(details);
    // updateFooter();
    console.log(shoppingCart);
}

//Display input and remove-buttons
//Use input value to update product quantity
function showControls(button,details){
    //Create the div wrapper
    const wrapper = document.createElement('div');
    wrapper.classList.add('controls');
    wrapper.details = details;
    //Create an input to select the quantity of each product to add to the shopping cart
    const quantityInput = document.createElement('input');
    quantityInput.name = "quantity";
    quantityInput.classList.add('control');
    quantityInput.value = 1;
    //Use the dummy button to create a copy an insert on the corresponding flavor element
    const removeButton = document.querySelector('#dummy-minus').cloneNode(true); //true makes a deepcopy of the element.
    removeButton.removeAttribute('id');
    removeButton.classList.add('remove-button');
    //Add listeners to modify the number of items to add to the shopping cart
    button.addEventListener('click',modifyQuantity);
    removeButton.addEventListener('click',modifyQuantity);
    quantityInput.addEventListener('change',updateQuantity);
    //Select the element to insert the wrapper and populate it with the buttons and input
    const parentElement = button.parentNode;
    parentElement.insertBefore(wrapper,button);
    
    wrapper.appendChild(removeButton);
    wrapper.appendChild(quantityInput);
    wrapper.appendChild(button);
}

function modifyQuantity(event){
    const button = event.target.tagName === 'svg' ? event.target : event.target.parentNode;
    const parentElement = button.parentNode;
    const inputElement = parentElement.querySelector('input');
    if(button.classList.contains('add-button')){
        inputElement.value++;
    }else{
        inputElement.value--;
    }
    updateQuantity(event);
}

function updateQuantity(event){
    let element;
    if(event.value){
        element = event.target;
    }else{
        element = event.target.tagName === 'svg' ? event.target : event.target.parentNode;
    }
    const details = getProductDetails(element);
    manageShoppingCart(details);
    console.log(details);
    //If the quantity = 0 then hide the remove button and input
    if(details.quantity === '0'){
        hideControls(element);
    }
}

function hideControls(element){
    const parentElement = element.parentNode;
    const container = parentElement.parentNode;
    const removeButton = parentElement.querySelector('.remove-button');
    const inputElement = parentElement.querySelector('input');
    const addButton = parentElement.querySelector('.add-button');
    //Reset controls
    removeButton.removeEventListener('click',modifyQuantity);
    inputElement.removeEventListener('change',updateQuantity);
    addButton.removeEventListener('click',modifyQuantity);
    addButton.addEventListener('click',addNewProduct);
    //Hide controls
    parentElement.removeChild(addButton);
    container.removeChild(parentElement);
    container.appendChild(addButton);
}

// //display shopping cart
const shoppingCartDisplay = document.querySelector('#shopping-cart-display');
const addedProductDummy = document.querySelector('#product-placeholder')
const addedProducts = document.querySelector('#added-products');

function getNameString(name){
    const words = name.split('-');
    const capitalizedName = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    return capitalizedName.join(" ");
}

const productImageFiles = {
    "white-edition":"white", 
    "classic": "classic",
    "on-the-go": "drink",
    "bars": "bar"
}
const flavorColors = {
    "Vanilla": "#fdf5e6",
    "Chocolate": "#7b3f00",
    "Strawberry Cream": "#ffc0cb",
    "Banana": "#ffd700",
    "Salted Caramel": "#755139",
    "Natural": "#f8f8ff",
    "Matcha": "#8ca187",
    "Coconut": "#f5f5dc",
    "Chocolate Brownie": "#4f3c33",
    "Crunchy Peanut Butter": "#dac0a0"
}

function newProductInDisplay(details){

    //Clone product container
    const addedProduct = addedProductDummy.cloneNode(true);
    addedProduct.removeAttribute('id');
    addedProduct.name = `${details.name}`;
    addedProduct.flavor = `${details.flavor}`;
    addedProduct.quantity = `${details.quantity}`;
    addedProduct.price = `${details.price}`;

    //Remove dummy container
    if(addedProducts.contains(addedProductDummy)){
        addedProducts.removeChild(addedProductDummy);
    }

    //Replace image
    const imageContainer = addedProduct.querySelector('.added-product-image-container');
    productImage = document.createElement('img');
    productImage.classList.add('added-product-image');
    productImage.style.borderColor = `${flavorColors[details.flavor]}`;
    const filename = "../images/"+productImageFiles[details.name]+".jpeg";
    productImage.src = filename;
    productImage.alt = "Gruel"+productImageFiles[details.name];
    const dummyButton = imageContainer.querySelector('svg');
    imageContainer.removeChild(dummyButton);
    imageContainer.appendChild(productImage);

    //Replace product details
    const addedProductDetails = addedProduct.querySelectorAll('.name-and-flavor p');
    addedProductDetails[0].textContent = getNameString(details.name)+":";
    addedProductDetails[1].textContent = details.flavor;

    //Show quantity
    const quantityInput = addedProduct.querySelector('input');
    quantityInput.value = details.quantity;

    //Show price
    const priceTag = addedProduct.querySelectorAll('.display-price p');
    priceTag[0].textContent = "$"+details.price+" per item";
    priceTag[1].textContent = "$"+ ((details.price*details.quantity).toFixed(2));

    addedProducts.appendChild(addedProduct);

    //Add event listeners to update quantities
    const addButton = addedProduct.querySelector('.plus');
    const removeButton = addedProduct.querySelector('.minus');
    // addButton.addEventListener('click',modifyAddedProductQuantity);
    // removeButton.addEventListener('click',modifyAddedProductQuantity);
    // quantityInput.addEventListener('change',updateAddedProductQuantity);
    addButton.addEventListener('click',modifyTarget);
    removeButton.addEventListener('click',modifyTarget);
    quantityInput.addEventListener('change',modifyTarget);
}

function updateAddedProduct(productIndex,details){
    const addedProduct = addedProducts.children[productIndex];
    if(details.quantity > 0){
        //Update quantity
    const quantityInput=addedProduct.querySelector('input');
    quantityInput.value = details.quantity
    //Update subtotal
    const subtotal = addedProduct.querySelectorAll('.display-price p')[1];
    subtotal.textContent = "$"+ (details.price*details.quantity).toFixed(2);
    }else{
        addedProducts.removeChild(addedProduct);
        //If the cart is empty add the dummy container
        if(shoppingCart.addedProducts.length === 0){
            addedProducts.appendChild(addedProductDummy);
        }
    }
}

const footerInfo = document.querySelectorAll('#info p');

function displayTotal(){
    const continueButton = document.querySelector('#continue-button');
    const checkoutButton = document.querySelector('#checkout-button');
    const clearButton = document.querySelector('#clear-button');

    const totalPrice = (+shoppingCart.totalPrice).toFixed(2)
    // //Show total on shopping cart
    const totalPriceDisplay = shoppingCartDisplay.querySelectorAll('#total-price p')[1];
    totalPriceDisplay.textContent = "$"+totalPrice;

    // //Display total on footer
    footerInfo[0].textContent = "$"+ totalPrice;
    if(totalPrice < 1){
        continueButton.style.backgroundColor = "#85878b";
        checkoutButton.style.backgroundColor = "#85878b";
        clearButton.style.backgroundColor = "#85878b";
    }else if(totalPrice < 70){
        footerInfo[1].textContent = "SPEND $70 TO GET FREE SHIPPING";
        footerInfo[1].style.color = "#85878b";
        footerInfo[2].style.color = "#85878b";
        footerInfo[2].textContent = "";
        continueButton.style.backgroundColor = "#3882f6";
        checkoutButton.style.backgroundColor = "#3882f6";
        clearButton.style.backgroundColor = "#3882f6";
    }else if(totalPrice < 130){
        footerInfo[1].textContent = "FREE SHIPPING";
        footerInfo[1].style.color = "#e5e7eb";
        footerInfo[2].style.color = "#85878b";
        footerInfo[2].textContent = "SPEND $130 TO GET 10% OFF";
        continueButton.style.backgroundColor = "#3882f6"
        checkoutButton.style.backgroundColor = "#3882f6";
        clearButton.style.backgroundColor = "#3882f6";
    }else if(totalPrice > 130){
        const discountedPrice = (totalPrice * 0.9).toFixed(2);
        footerInfo[0].innerHTML = `<span class="strikethrough">$${totalPrice}</span> $${discountedPrice}`
        footerInfo[2].textContent = "YOU GOT 10% OFF"
        footerInfo[2].style.color = "#e5e7eb";
        continueButton.style.backgroundColor = "#3882f6"
        checkoutButton.style.backgroundColor = "#3882f6";
        clearButton.style.backgroundColor = "#3882f6";
        totalPriceDisplay.innerHTML = `<span class="strikethrough">$${totalPrice}</span> $${discountedPrice}`;
    }
}

const shoppingCartButton = document.querySelector('#shopping-cart');
shoppingCartButton.addEventListener('click',() => {
    shoppingCartDisplay.classList.toggle('visible');
});

//indicators
function showIndicators(details){
    const scIndicator = document.querySelector(`.indicator[name='shopping-cart']`);
    const totalNumItems = shoppingCart.addedProducts.reduce((total,product) => {
        return total + +product.quantity;
    },0);
    if(totalNumItems > 0){
        if(!scIndicator.classList.contains('visible')){
            scIndicator.classList.add('visible');
        }
        if(totalNumItems > 9){
            scIndicator.innerHTML = "<div>9<sup>+</sup></div>"
        }else{
            scIndicator.textContent = totalNumItems;
        }
    }else{
        scIndicator.classList.remove('visible');
    }

    const productIndicator = document.querySelector(`.indicator[name=${details.name}]`);
    const numItems = shoppingCart.addedProducts.reduce((total,product) => {
        if(product.name === details.name){
            return total + +product.quantity;
        }else{
            return total;
        }
    },0);
    if(numItems > 0){
        if(!productIndicator.classList.contains('visible')){
            productIndicator.classList.add('visible');
        }
        if(numItems > 9){
            productIndicator.innerHTML = "<div>9<sup>+</sup></div>";
        }else{
            productIndicator.textContent = numItems;
        }
    }else{
        productIndicator.classList.remove('visible');
    }
}

const clearButton = document.querySelector('#clear-button');
clearButton.addEventListener('click',clearShoppingCart);

function clearShoppingCart(){
    //Clear display
    shoppingCart.addedProducts = [];
    shoppingCart.totalPrice=shoppingCart.calculateTotal();
    addedProducts.innerHTML = '';
    addedProducts.appendChild(addedProductDummy);
    displayTotal();
    //Remove indicators
    indicators.forEach(indicator => {
        if(indicator.classList.contains('visible')){
            indicator.classList.remove('visible');
        }});
    //Hide all controls
    const controls = document.querySelectorAll('.controls');
    controls.forEach(control => {
        element = control.querySelector('.remove-button');
        hideControls(element);
    });
}

function getTargetElement(event){
    let element;
    if(event.value){
        element = event.target;
    }else{
        element = event.target.tagName === 'svg' ? event.target : event.target.parentNode;
    }
    const details = getAddedProductDetails(element);
    const controlElements = [...document.querySelectorAll('.controls')];
    const targetElement = controlElements.find(control =>
        control.details.name === details.name && control.details.flavor === details.flavor
        );
    return targetElement;
}

function modifyTarget(event){
    
    const targetElement = getTargetElement(event);
    const clickEvent = new Event('click');
    let element;
    if(event.value){
        element = event.target;
        targetElement.value = element.value;
    }else{
        element = event.target.tagName === 'svg' ? event.target : event.target.parentNode;
        let button;
        if(element.classList.contains('plus')){
            button = targetElement.querySelector('.add-button');
        }else{
            button = targetElement.querySelector('.remove-button');
        }
        button.dispatchEvent(clickEvent);
    }
}

function modifyAddedProductQuantity(event){
    const button = event.target.tagName === 'svg' ? event.target : event.target.parentNode;
    const parentElement = button.parentNode;
    const container = parentElement.parentNode;
    const inputElement = container.querySelector('input');
    if(button.classList.contains('plus')){
        inputElement.value++;
    }else{
        inputElement.value--;
    }
    updateAddedProductQuantity(event);
}

function updateAddedProductQuantity(event){
    let element;
    if(event.value){
        element = event.target;
    }else{
        element = event.target.tagName === 'svg' ? event.target : event.target.parentNode;
    }
    const details = getAddedProductDetails(element);
    manageShoppingCart(details);
    console.log(details);
    //If the quantity = 0 then hide the remove button and input
    if(details.quantity === '0'){
        hideControls(element);
    }
}

function getAddedProductDetails(element){
    const addedProduct = element.closest('.added-product');
    const name = addedProduct.name;
    const price = addedProduct.price;
    const flavor = addedProduct.flavor;
    let quantity;
    if(element.value){
        addedProduct.quantity = element.value;
        quantity = addedProduct.quantity;
    }else if(element.classList.contains('plus')){
        addedProduct.quantity++;
        quantity = addedProduct.quantity;
    }else{
        addedProduct.quantity--;
        quantity = addedProduct.quantity;
    }
    
    return {name: name,price: price,flavor: flavor,quantity: quantity}
}