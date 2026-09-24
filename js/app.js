```javascript
// ========================================
// QUICKBITE APP.JS
// ========================================


// ========================================
// ADD ITEM TO CART
// ========================================

function addToCart(name, price) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = cart.find(
        item => item.name === name
    );

    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({
            name: name,
            price: Number(price),
            quantity: 1
        });

    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    alert(name + " added to cart!");

    updateCartCount();
}


// ========================================
// UPDATE CART COUNT
// ========================================

function updateCartCount() {

    const cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    const totalQuantity = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const cartCount =
        document.getElementById("cartCount");

    if (cartCount) {

        cartCount.textContent = totalQuantity;

    }
}


// ========================================
// LOAD CHECKOUT PAGE
// ========================================

function loadCheckout() {

    const checkoutItems =
        document.getElementById("checkoutItems");

    const checkoutTotal =
        document.getElementById("checkoutTotal");

    if (!checkoutItems || !checkoutTotal) {
        return;
    }


    const cart =
        JSON.parse(localStorage.getItem("cart")) || [];


    // Empty cart
    if (cart.length === 0) {

        checkoutItems.innerHTML = `
            <div class="empty-cart">
                <h3>🛒 Your cart is empty</h3>
                <p>Please add food items before checkout.</p>

                <a href="menu.html"
                   class="back-home-btn">
                    🍔 Go to Menu
                </a>
            </div>
        `;

        checkoutTotal.textContent = "₹0";

        return;
    }


    let total = 0;

    checkoutItems.innerHTML = "";


    cart.forEach(item => {

        const subtotal =
            Number(item.price) *
            Number(item.quantity);

        total += subtotal;


        const itemDiv =
            document.createElement("div");

        itemDiv.className = "order-item";


        itemDiv.innerHTML = `
            <div>
                <div class="item-name">
                    ${item.name}
                </div>

                <div class="item-info">
                    ₹${item.price} × ${item.quantity}
                </div>
            </div>

            <div class="item-total">
                ₹${subtotal}
            </div>
        `;


        checkoutItems.appendChild(itemDiv);

    });


    checkoutTotal.textContent =
        "₹" + total;

}


// ========================================
// GENERATE ORDER ID
// ========================================

function generateOrderId() {

    const now = new Date();

    const date =
        now.getFullYear().toString() +
        String(now.getMonth() + 1).padStart(2, "0") +
        String(now.getDate()).padStart(2, "0");


    const randomNumber =
        Math.floor(1000 + Math.random() * 9000);


    return `QB-${date}-${randomNumber}`;

}


// ========================================
// PLACE ORDER
// ========================================

function placeOrder(event) {

    event.preventDefault();


    const name =
        document.getElementById("customerName").value.trim();

    const phone =
        document.getElementById("customerPhone").value.trim();

    const address =
        document.getElementById("customerAddress").value.trim();


    const cart =
        JSON.parse(localStorage.getItem("cart")) || [];


    // Check cart
    if (cart.length === 0) {

        alert(
            "Your cart is empty. Please add food items first."
        );

        return;
    }


    // Check customer information
    if (!name || !phone || !address) {

        alert(
            "Please enter all delivery details."
        );

        return;
    }


    // Calculate total
    let total = 0;

    cart.forEach(item => {

        total +=
            Number(item.price) *
            Number(item.quantity);

    });


    // Generate order
    const orderId =
        generateOrderId();


    const orderDate =
        new Date();


    const order = {

        orderId: orderId,

        orderDate:
            orderDate.toLocaleString(),

        customer: {

            name: name,

            phone: phone,

            address: address

        },

        items: cart,

        total: total,

        status: "Preparing"

    };


    // Save complete order
    localStorage.setItem(
        "lastOrder",
        JSON.stringify(order)
    );


    // Display order
    showOrderSuccess(order);


    // Clear cart
    localStorage.removeItem("cart");


    // Update cart count
    updateCartCount();

}


// ========================================
// SHOW ORDER SUCCESS
// ========================================

function showOrderSuccess(order) {

    const checkoutForm =
        document.getElementById("checkoutForm");

    const successBox =
        document.getElementById("successBox");


    if (checkoutForm) {

        checkoutForm.style.display =
            "none";

    }


    if (successBox) {

        successBox.style.display =
            "block";

    }


    // Order ID
    document.getElementById(
        "successOrderId"
    ).textContent =
        order.orderId;


    // Date
    document.getElementById(
        "successOrderDate"
    ).textContent =
        order.orderDate;


    // Customer
    document.getElementById(
        "successCustomerName"
    ).textContent =
        order.customer.name;


    document.getElementById(
        "successCustomerPhone"
    ).textContent =
        order.customer.phone;


    document.getElementById(
        "successCustomerAddress"
    ).textContent =
        order.customer.address;


    // Items
    const itemsContainer =
        document.getElementById(
            "successOrderItems"
        );


    itemsContainer.innerHTML = "";


    order.items.forEach(item => {

        const subtotal =
            Number(item.price) *
            Number(item.quantity);


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${item.name}
            </td>

            <td>
                ₹${item.price}
            </td>

            <td>
                ${item.quantity}
            </td>

            <td>
                ₹${subtotal}
            </td>

        `;


        itemsContainer.appendChild(row);

    });


    // Total
    document.getElementById(
        "successTotal"
    ).textContent =
        "₹" + order.total;

}


// ========================================
// LOAD PREVIOUS ORDER
// ========================================

function loadLastOrder() {

    const successBox =
        document.getElementById("successBox");


    if (!successBox) {
        return;
    }


    const lastOrder =
        JSON.parse(
            localStorage.getItem("lastOrder")
        );


    if (lastOrder) {

        showOrderSuccess(lastOrder);

    }

}


// ========================================
// PAGE LOAD
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCartCount();

        loadCheckout();

        loadLastOrder();


        const orderForm =
            document.getElementById("orderForm");


        if (orderForm) {

            orderForm.addEventListener(
                "submit",
                placeOrder
            );

        }

    }
);
