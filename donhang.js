
document.addEventListener("DOMContentLoaded", function () {
    const orderTableBody = document.querySelector("#order-table tbody");
    const orderDetails = document.getElementById("order-details");
    const orderInfo = document.getElementById("order-info");
    const closeDetailsButton = document.getElementById("close-details");

    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    function displayOrders() {
        orderTableBody.innerHTML = "";

        if (orders.length === 0) {
            orderTableBody.innerHTML = `<tr><td colspan="5">Bạn chưa có đơn hàng nào.</td></tr>`;
            return;
        }

        orders.forEach((order, index) => {
            const row = `
                <tr>
                    <td>#${order.id}</td>
                    <td>${order.date}</td>
                    <td>${order.total.toLocaleString()}₫</td>
                    <td>${order.status}</td>
                    <td>
                        <button class="view-order" data-index="${index}">Xem</button>
                    </td>
                </tr>
            `;
            orderTableBody.innerHTML += row;
        });

        document.querySelectorAll(".view-order").forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                showOrderDetails(index);
            });
        });
    }

    function showOrderDetails(index) {
        const order = orders[index];
        if (!order || !order.items) return;
    
        let detailsHTML = `
            <p><strong>Mã đơn hàng:</strong> #${order.id}</p>
            <p><strong>Ngày mua:</strong> ${order.date}</p>
            <p><strong>Tổng tiền:</strong> ${order.total.toLocaleString()}₫</p>
            <p><strong>Trạng thái:</strong> ${order.status}</p>
            <h3>Danh sách sản phẩm:</h3>
            <table class="order-items">
                <thead>
                    <tr>
                        <th>Sản phẩm</th>
                        <th>Số lượng</th>
                        <th>Đơn giá</th>
                        <th>Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
        `;
    
        order.items.forEach(item => {
            const totalItemPrice = item.quantity * item.price;
            detailsHTML += `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price.toLocaleString()}₫</td>
                    <td>${totalItemPrice.toLocaleString()}₫</td>
                </tr>
            `;
        });
    
        detailsHTML += `</tbody></table>`;
    
        orderInfo.innerHTML = detailsHTML;
        orderDetails.classList.add("active"); 
        document.querySelector(".modal-overlay").classList.add("active");
    }
    
    closeDetailsButton.addEventListener("click", function () {
        orderDetails.classList.remove("active");
        document.querySelector(".modal-overlay").classList.remove("active");
    });
    
    
    

    closeDetailsButton.addEventListener("click", function () {
        orderDetails.classList.add("hidden");
    });
    document.getElementById("back-to-home").addEventListener("click", function () {
        window.location.href = "index.html"; // Đổi "index.html" thành trang chủ của bạn nếu khác
    });
    
    displayOrders();
});
