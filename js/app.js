// ========================================
// QUICKBITE APP.JS
// ========================================


// ========================================
// ADD ITEM TO CART
// ========================================

function addToCart(name, price) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = cart.find(function (item) {
        return item.name === name;
    });

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: Number(price),
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert(name + " added to cart!");

    updateCartCount();
}


// ========================================
// UPDATE CART COUNT
// ========================================

function updateCartCount() {

    const cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    let totalQuantity = 0;

    cart.forEach(function (item) {
        totalQuantity += Number(item.quantity);
    });

    const cartCount =
        document.getElementById("cartCount");

    if (cartCount) {
        cartCount.textContent = totalQuantity;
    }
}


// ========================================
// LOAD CHECKOUT
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

    if (cart.length === 0) {

        checkoutItems.innerHTML = `
            <div class="empty-cart">
                <h3>🛒 Your cart is empty</h3>
                <p>Please add food items before checkout.</p>

                <a href="menu.html" class="back-home-btn">
                    🍔 Go to Menu
                </a>
            </div>
        `;

        checkoutTotal.textContent = "₹0";

        return;
    }

    let total = 0;

    checkoutItems.innerHTML = "";

    cart.forEach(function (item) {

        const subtotal =
            Number(item.price) * Number(item.quantity);

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

    checkoutTotal.textContent = "₹" + total;
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

    return "QB-" + date + "-" + randomNumber;
}


// ========================================
// PLACE ORDER
// ========================================

function placeOrder(event) {

    event.preventDefault();

    const nameElement =
        document.getElementById("customerName");

    const phoneElement =
        document.getElementById("customerPhone");

    const addressElement =
        document.getElementById("customerAddress");

    if (!nameElement || !phoneElement || !addressElement) {

        alert("Customer details fields are missing.");

        return;
    }

    const name =
        nameElement.value.trim();

    const phone =
        phoneElement.value.trim();

    const address =
        addressElement.value.trim();

    const cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    // Check cart
    if (cart.length === 0) {

        alert("Your cart is empty. Please add food items first.");

        return;
    }

    // Check customer details
    if (!name || !phone || !address) {

        alert("Please enter all delivery details.");

        return;
    }

    // Calculate subtotal
    let subtotal = 0;

    cart.forEach(function (item) {

        subtotal +=
            Number(item.price) *
            Number(item.quantity);

    });

    // Delivery charge
    const deliveryCharge = 40;

    // Final total
    const total =
        subtotal + deliveryCharge;

    // Payment method
    const paymentElement =
        document.querySelector(
            'input[name="paymentMethod"]:checked'
        );

    const paymentMethod =
        paymentElement
            ? paymentElement.value
            : "Cash on Delivery";

    // UPI ID
    const upiElement =
        document.getElementById("upiId");

    const upiId =
        upiElement
            ? upiElement.value.trim()
            : "";

    // Validate UPI
    if (paymentMethod === "UPI" && !upiId) {

        alert("Please enter your UPI ID.");

        return;
    }

    // Create order
    const order = {

        orderId: generateOrderId(),

        orderDate:
            new Date().toLocaleString(),

        customer: {

            name: name,

            phone: phone,

            address: address

        },

        items: cart,

        subtotal: subtotal,

        deliveryCharge: deliveryCharge,

        total: total,

        paymentMethod: paymentMethod,

        upiId:
            paymentMethod === "UPI"
                ? upiId
                : "",

        status: "Preparing"

    };


    // ========================================
    // SAVE ORDER
    // ========================================

    localStorage.setItem(
        "latestOrder",
        JSON.stringify(order)
    );

    // Also keep order history
    const orders =
        JSON.parse(
            localStorage.getItem("orders")
        ) || [];

    orders.push(order);

    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );


    // Remove cart
    localStorage.removeItem("cart");

    updateCartCount();


    // ========================================
    // GO TO SUCCESS PAGE
    // ========================================

    window.location.href =
        "order-success.html";
}


// ========================================
// PAGE LOAD
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCartCount();

        loadCheckout();

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