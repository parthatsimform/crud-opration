const selected = document.getElementsByClassName("navbar");
const content = document.getElementById("content");

let products = JSON.parse(localStorage.getItem("products")) || [];

window.addEventListener("load", async (e) => {
    const res = await fetch(routes[e.target.location.hash]);
    const data = await res.text();
    content.innerHTML = data;
    if (e.target.location.hash == "#allProducts" || e.target.location.hash == "") {
        showData();
    } else if (e.target.location.hash == "#addProduct") {
        addNewProduct();
    } else if (e.target.location.hash == "#editProduct") {
        editfunction(localStorage.getItem("editProductId"));
    }
});

window.addEventListener("popstate", async (e) => {
    const res = await fetch(routes[e.target.location.hash]);
    const data = await res.text();
    content.innerHTML = data;
    if (e.target.location.hash == "#allProducts" || e.target.location.hash == "") {
        showData();
    } else if (e.target.location.hash == "#addProduct") {
        addNewProduct();
    } else if (e.target.location.hash == "#editProduct") {
        editfunction(localStorage.getItem("editProductId"));
    }
})

const routes = {
    "": "./pages/allproducts.html",
    "#": "./pages/allproducts.html",
    "#allProducts": "./pages/allproducts.html",
    "#addProduct": "./pages/addproduct.html",
    "#editProduct": "./pages/editproduct.html"
}

Array.from(selected).forEach(element => {
    element.addEventListener("click", async (e) => {
        const res = await fetch(routes[e.target.attributes.href.nodeValue]);
        const data = await res.text();
        content.innerHTML = data;
        if (e.target.attributes.href.nodeValue == "#allProducts" || e.target.attributes.href.nodeValue == "#") {
            showData();
        } else if (e.target.attributes.href.nodeValue == "#addProduct") {
            addNewProduct();
        }
    })
})

const showimg = e => {
    const img = e.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = e => {
        document.getElementById("selectedimg").src = e.target.result;
    }
    document.getElementById("productImage").style.display = "none";
    document.getElementById("selectedimg").addEventListener("click", () => {
        document.getElementById("productImage").click();
    })
}

function addNewProduct() {
    document.getElementById("productForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        if (validateForm(e.target)) {
            let productID = e.target.productID.value;
            let productName = e.target.productName.value;
            let productImage = e.target.productImage.files[0];
            let productPrice = e.target.productPrice.value;
            let productDescription = e.target.productDescription.value;
            const available = await products.find(product => product.id == productID);
            if (available) {
                window.alert("Product with ID=" + productID + " already exists. Please enter a different product ID.");
                e.target.productID.focus();
            } else {
                if (confirm("Are you sure you want to add this product?")) {
                    imagehandler(productImage,productID);
                    let product = {
                        id: productID,
                        name: productName,
                        price: productPrice,
                        description: productDescription
                    }
                    products.push(product);
                    localStorage.setItem("products", JSON.stringify(products));
                    window.location.href = "/crud-operation/";
                }
            }
        }
    })
}

function validateForm(form) {
    if (window.location.hash=="#addProduct" && form.productID.value == "") {
        form.productID.style.border="1px solid red";
        form.productID.setAttribute("placeholder", "Enter Product ID");
        return false;
    } else if (form.productID.value < 1 || form.productID.value.includes(".")) {
        form.productID.style.border = "1px solid red";
        form.productID.value="";
        form.productID.setAttribute("placeholder", "Product ID must be a positive integer");
        return false;
    } else {
        form.productID.style.border = "1px solid green";
    }
    if (form.productName.value == "") {
        form.productName.style.border="1px solid red";
        form.productName.setAttribute("placeholder", "Enter Product Name");
        return false;
    } else {
        form.productName.style.border = "1px solid green";
    }
    if (window.location.hash=="#addProduct" && form.productImage.value == "") {
        form.productImage.style.border="1px solid red";
        return false;
    } else {
        form.productImage.style.border = "1px solid green";
    }
    if (form.productPrice.value == "") {
        form.productPrice.style.border = "1px solid red";
        form.productPrice.setAttribute("placeholder", "Enter Product Price");
        return false;
    } else if (form.productPrice.value < 1) {
        form.productPrice.style.border = "1px solid red";
        form.productPrice.value="";
        form.productPrice.setAttribute("placeholder", "Product price must be a positive value");
        return false;
    } else {
        form.productPrice.style.border = "1px solid green";
    }
    if (form.productDescription.value == "") {
        form.productDescription.style.border="1px solid red";
        form.productDescription.setAttribute("placeholder", "Enter Product Description");
        return false;
    } else {
        form.productDescription.style.border = "1px solid green";
    }
    return true;
}

function imagehandler(image, id) {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.addEventListener("load", () => {
        localStorage.setItem(id, reader.result);
        document.getElementById("selectedimg").src = reader.result;
    })
}

function showData() {
    displaydata(products);
    filterbyid();
    sortmethods();
}

function filterbyid() {
    const searchinput = document.getElementById("searchinput");
    searchinput.addEventListener("keyup", (e) => {
        let searchproduct = [...products]
        searchproduct = searchproduct.filter(product => product.id == e.target.value);
        if (e.target.value == "") {
            searchproduct = products;
        }
        displaydata(searchproduct);
    })
}

function sortmethods() {
    let sortdropdown = document.getElementById("sortdropdown");
    let options = document.getElementsByClassName("dropdown-item");
    let increasing = document.getElementById("increasing");
    let decreasing = document.getElementById("decreasing");

    Array.from(options).forEach(option => {
        option.addEventListener("click", (e) => {
            sortdropdown.innerHTML = e.target.innerHTML;
            decreasing.classList.remove("activesortarrow");
            increasing.classList.add("activesortarrow");
            let sortproduct = [...products];
            let newsort=[...products];
            switch (e.target.id) {
                case "sortbyid":
                    sortproduct.sort((a, b) => a.id - b.id);
                    break;
                case "sortbyname":
                    sortproduct.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case "sortbyprice":
                    sortproduct.sort((a, b) => a.price - b.price);
                    break;
            }
            displaydata(sortproduct);
            
            decreasing.addEventListener("click", (event) => {
                decreasing.classList.add("activesortarrow");
                increasing.classList.remove("activesortarrow");
                sortproduct=sortproduct.reverse();
                displaydata(sortproduct);
            })
            
            increasing.addEventListener("click", (e) => {
                decreasing.classList.remove("activesortarrow");
                increasing.classList.add("activesortarrow");
                sortproduct=sortproduct.reverse();
                displaydata(sortproduct);
            })
        })
    })
}

function displaydata(products) {
    const productlist = document.getElementById("product-list");
    let data = "";
    products.length == 0 ? data = `<tr><td colspan="6" class="producterror">No Products Available!</td></tr>` : (
    products.map((product) => {
        data += `<tr>
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td><img src=${localStorage.getItem(product.id)} class="imgdisplay"></td>
        <td>${product.price}</td>
        <td>${product.description}</td>
        <td><button type="button" class="editbtn" onclick="editproduct(${product.id})">Edit</button></td>
        <td><button type="button" class="deletebtn" onclick="deleteproduct(${product.id})">Delete</button></td>
        </tr>`;
    }))
    productlist.innerHTML = data;
}

function deleteproduct(id) {
    if (confirm("Are you sure you want to delete this product?")) {
        let copyproducts = [...products];
        copyproducts = copyproducts.filter(cp => cp.id != id);
        products = copyproducts;
        localStorage.setItem("products", JSON.stringify(products));
        localStorage.removeItem(id);
        showData();
    }
}

function editproduct(id) {
    window.location.hash = "#editProduct";
    let p_id = products.findIndex(product => product.id == id);
    localStorage.setItem("editProductId", p_id);                //store edit-product-id in local storage to be able retrieve when reload
    if (p_id) {
        editfunction(p_id);
    }
}

const editfunction = (pid) => {
    let editproduct = document.getElementById("editproductForm");
    if (editproduct) {
        editproduct.elements.productID.value = products[pid].id;
        editproduct.elements.productName.value = products[pid].name;
        editproduct.elements.productPrice.value = products[pid].price;
        editproduct.elements.productDescription.value = products[pid].description;
        editproduct.selectedimg.src = localStorage.getItem(products[pid].id);
        editproduct.selectedimg.addEventListener("click", () => {
            editproduct.productImage.click();
        });
     
        editproduct.addEventListener("submit", (e) => {             
            e.preventDefault();
            if (validateForm(e.target) && confirm("Are you sure you want to update this product?")) {
                products[pid].id = editproduct.productID.value;
                products[pid].name = editproduct.productName.value;
                products[pid].price = editproduct.productPrice.value;
                products[pid].description = editproduct.productDescription.value;
                if (editproduct.elements.productImage.files[0]) {
                    imagehandler(editproduct.elements.productImage.files[0],editproduct.productID.value);
                }
                localStorage.setItem("products", JSON.stringify(products));
                window.location.href = "/crud-operation/";
            }
        })
    }
}