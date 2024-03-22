
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
    showControls(button);
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
    }else{ //Add new product to shopping cart
        const newProduct = new product(details.name, details.price, details.flavor);
        shoppingCart.addedProducts.push(newProduct);
    }
    //Update the total price
    shoppingCart.totalPrice=shoppingCart.calculateTotal();
    updateShoppingCartDisplay(details);
    // updateFooter();
    console.log(shoppingCart);
}

//Display input and remove-buttons
//Use input value to update product quantity
function showControls(button){
    //Create the div wrapper
    const wrapper = document.createElement('div');
    wrapper.classList.add('controls');
    //Create an input to select the quantity of each product to add to the shopping cart
    const quantityInput = document.createElement('input');
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
function getNameString(name){
    const words = name.split('-');
    const capitalizedName = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    return capitalizedName.join(" ");
}

function updateShoppingCartDisplay(details){
    
}

function SCaddNewProduct(){
    const imageContainer = document.querySelector(
        `.product-container[name=${details.name}]`
        );
    //Copy image and remove style
    const productImage = imageContainer.querySelector('img').cloneNode(true);
    productImage.classList.remove('product-picture');
    productImage.style.height = '100%';
    productImage.style.borderRadius = '10px';
    //Create container and controls
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.height = '50px';
    container.style.gap = "5px";
    container.style.alignItems = 'center';
    //Details
    const detailsContainer = document.createElement('div');
    detailsContainer.style.display = 'flex';
    detailsContainer.style.flexDirection = 'column';
    detailsContainer.style.justifyContent = 'flex-start';
    detailsContainer.style.gap = '5px';
    const flavorP = document.createElement('p');
    flavorP.style.margin = '0';
    flavorP.style.fontSize = '10px';
    flavorP.style.color = '#1f2937';
    flavorP.textContent = getNameString(details.name)+": "+details.flavor;
    const controls = document.createElement('div');
    controls.classList.add('controls');
    controls.style.height = '40px';
    const addButton = document.querySelector("#dummy-plus").cloneNode(true);
    addButton.removeAttribute('id');
    addButton.classList.add('add-button');
    addButton.addEventListener('click',modifyQuantity);
    addButton.style.margin = '0';
    const removeButton = document.querySelector("#dummy-minus").cloneNode(true);
    removeButton.removeAttribute('id');
    removeButton.classList.add('remove-button');
    removeButton.style.margin = '0';
    removeButton.addEventListener('click',modifyQuantity);
    const inputElement = document.createElement('input');
    inputElement.classList.add('control');
    inputElement.value = details.quantity;
    inputElement.style.margin = '0';
    inputElement.addEventListener('change',updateQuantity);
    const priceP = document.createElement('p');
    priceP.style.margin = '0';
    priceP.style.fontSize = '14px';
    priceP.style.color = '#1f2937';
    priceP.textContent = '$'+details.price;
    controls.appendChild(removeButton);
    controls.appendChild(inputElement);
    controls.appendChild(addButton);
    detailsContainer.appendChild(flavorP);
    detailsContainer.appendChild(controls);
    container.appendChild(productImage);
    container.appendChild(detailsContainer);
    container.appendChild(priceP);
    shoppingCartDisplay.appendChild(container);
}