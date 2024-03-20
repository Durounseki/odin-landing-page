
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
const shoppingCart = {}

// Product object constructor
function product(name,flavor){
    this.name = name;
    this.flavor = flavor;
}