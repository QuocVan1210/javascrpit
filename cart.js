document.addEventListener("DOMContentLoaded", function () {
    const cartTableBody = document.querySelector("#cart-table tbody");
    const cartTotalContainer = document.getElementById("cart-total");
    const clearCartButton = document.getElementById("clear-cart");
    const checkoutButton = document.getElementById("checkout-button");
    const modal = document.getElementById("checkout-modal");
    const closeModal = document.querySelector(".close");
    const checkoutForm = document.getElementById("checkout-form");
    const paymentMethod = document.getElementById("payment-method");
    const bankInfo = document.getElementById("bank-info");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function displayCartItems() {
        cartTableBody.innerHTML = "";

        if (cart.length === 0) {
            cartTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center;">Giỏ hàng trống</td></tr>`;
            cartTotalContainer.textContent = "0₫";
            return;
        }

        let total = 0;

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const cartRowHTML = `
                <tr>
                    <td><img src="${item.image}" alt="${item.name}" width="80"></td>
                    <td>${item.name}</td>
                    <td>${item.price.toLocaleString()}₫</td>
                    <td>
                        <button class="decrease-quantity" data-index="${index}">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase-quantity" data-index="${index}">+</button>
                    </td>
                    <td>${itemTotal.toLocaleString()}₫</td>
                    <td>
                        <button class="remove-item" data-index="${index}">Xóa</button>
                    </td>
                </tr>
            `;

            cartTableBody.innerHTML += cartRowHTML;
        });

        cartTotalContainer.textContent = `${total.toLocaleString()}₫`;

        addCartEventListeners();
    }
document.addEventListener("DOMContentLoaded", function () {
    const couponInput = document.getElementById("coupon-code");
    const applyCouponButton = document.getElementById("apply-coupon");
    const discountMessage = document.getElementById("discount-message");
    let discount = 0;

    applyCouponButton.addEventListener("click", function () {
        const coupon = couponInput.value.trim().toUpperCase();
        
        if (coupon === "BANHTRANG20") {
            discount = 0.2; // Giảm 20%
            discountMessage.textContent = "🎉 Mã giảm giá hợp lệ! Bạn được giảm 20%.";
        } else {
            discount = 0;
            discountMessage.textContent = "❌ Mã giảm giá không hợp lệ.";
        }

        updateCart();
    });

    function updateCart() {
        let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        let discountedTotal = total - (total * discount);
        cartTotalContainer.textContent = `${discountedTotal.toLocaleString()}₫`;
    }
});

    function addCartEventListeners() {
        document.querySelectorAll(".decrease-quantity").forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                } else {
                    alert("Số lượng phải lớn hơn 0.");
                }
                updateCart();
            });
        });

        document.querySelectorAll(".increase-quantity").forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                cart[index].quantity++;
                updateCart();
            });
        });

        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                cart.splice(index, 1);
                updateCart();
            });
        });
    }

    function updateCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCartItems();
    }

    clearCartButton.addEventListener("click", function () {
        if (confirm("Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?")) {
            cart = [];
            updateCart();
        }
    });

    checkoutButton.addEventListener("click", function () {
        if (cart.length === 0) {
            alert("Giỏ hàng của bạn đang trống!");
            return;
        }
        modal.style.display = "flex";
    });

    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });

    checkoutForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const fullName = document.getElementById("full-name").value;
        const phone = document.getElementById("phone").value;
        const address = document.getElementById("address").value;

        if (!fullName || !phone || !address) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        const newOrder = {
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
            status: "Chờ xác nhận",
            items: cart,
        };

        let orders = JSON.parse(localStorage.getItem("orders")) || [];
        orders.push(newOrder);
        localStorage.setItem("orders", JSON.stringify(orders));

        alert(`Cảm ơn ${fullName}, đơn hàng của bạn đã được xác nhận!`);
        localStorage.setItem("cart", JSON.stringify([]));

        modal.style.display = "none";
        displayCartItems();
        window.location.href = "donhangdamua.html";
    });

    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Xử lý hiển thị STK và QR Code khi chọn phương thức thanh toán
    if (paymentMethod) {
        paymentMethod.addEventListener("change", function () {
            if (paymentMethod.value === "bank") {
                bankInfo.style.display = "block"; // Hiện STK và QR Code
            } else {
                bankInfo.style.display = "none"; // Ẩn STK và QR Code nếu không chọn chuyển khoản
            }
        });
    }

    displayCartItems();
});
