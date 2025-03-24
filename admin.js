document.addEventListener("DOMContentLoaded", function () {
    const orderDetails = document.getElementById("order-details");
    const modalOverlay = document.querySelector(".modal-overlay");
    const closeDetails = document.getElementById("close-details");
    const viewButtons = document.querySelectorAll(".view-order");

    // Ẩn modal ngay khi tải trang
    orderDetails.classList.remove("active");
    modalOverlay.classList.remove("active");

    // Mở modal khi bấm nút "Xem"
    viewButtons.forEach(button => {
        button.addEventListener("click", function () {
            orderDetails.classList.add("active");
            modalOverlay.classList.add("active");
        });
    });

    // Đóng modal khi bấm nút "Đóng"
    closeDetails.addEventListener("click", function () {
        orderDetails.classList.remove("active");
        modalOverlay.classList.remove("active");
    });

    // Đóng modal khi bấm vào nền mờ
    modalOverlay.addEventListener("click", function () {
        orderDetails.classList.remove("active");
        modalOverlay.classList.remove("active");
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Fetch dữ liệu từ JSON Server
    fetch("http://localhost:3000/products")
        .then(response => response.json())
        .then(products => {
            const productTableBody = document.querySelector(".product-table tbody");
            products.forEach(product => {
                const row = document.createElement("tr");
                const imageSrc = product.image ? `/image/${product.id}.webp` : 'https://via.placeholder.com/100';  // Placeholder nếu không có hình ảnh
                row.innerHTML = `
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.price.toLocaleString()} VND</td>
                    <td><img src="${imageSrc}" alt="${product.name}" class="product-image"></td>
                    <td>
                        <button class="edit-product-btn" data-id="${product.id}">Sửa</button>
                        <button class="delete-product-btn" data-id="${product.id}">Xóa</button>
                    </td>
                `;
                productTableBody.appendChild(row);
            });

            // Xử lý sự kiện sửa sản phẩm
            document.querySelectorAll(".edit-product-btn").forEach(button => {
                button.addEventListener("click", function () {
                    const productId = this.getAttribute("data-id");
                    fetch(`http://localhost:3000/products/${productId}`)
                        .then(response => response.json())
                        .then(product => {
                            document.getElementById('editProductForm').style.display = 'block';
                            document.getElementById('editProductForm').setAttribute('data-id', product.id);
                            document.getElementById('editName').value = product.name;
                            document.getElementById('editPrice').value = product.price;
                            document.getElementById('editSale').value = product.sale;
                            document.getElementById('editImage').value = product.image;
                            document.getElementById('editDescription').value = product.description;
                            document.getElementById('editCategory').value = product.category;
                            document.getElementById('editStar').value = product.star;
                        })
                        .catch(error => console.error('Lỗi khi tải sản phẩm:', error.message));
                });
            });

            // Xử lý sự kiện lưu sản phẩm
            document.getElementById('saveProductBtn').addEventListener('click', function () {
                const productId = document.getElementById('editProductForm').getAttribute('data-id');
                const updatedProduct = {
                    name: document.getElementById('editName').value,
                    price: parseFloat(document.getElementById('editPrice').value),
                    sale: parseFloat(document.getElementById('editSale').value),
                    image: document.getElementById('editImage').value,
                    description: document.getElementById('editDescription').value,
                    category: document.getElementById('editCategory').value,
                    star: parseFloat(document.getElementById('editStar').value)
                };
                fetch(`http://localhost:3000/products/${productId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(updatedProduct)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Cập nhật sản phẩm thất bại.');
                    }
                    return response.json();
                })
                .then(() => {
                    document.getElementById('editProductForm').style.display = 'none';
                    location.reload();  // Cập nhật lại bảng sản phẩm
                })
                .catch(error => {
                    console.error('Lỗi khi lưu sản phẩm:', error.message);
                    alert('Có lỗi xảy ra khi lưu sản phẩm. Vui lòng kiểm tra lại.');
                });
            });

            // Xử lý hủy sửa sản phẩm
            document.getElementById('cancelProductBtn').addEventListener('click', function () {
                document.getElementById('editProductForm').style.display = 'none';
            });

            // Xử lý sự kiện xóa sản phẩm
            document.querySelectorAll(".delete-product-btn").forEach(button => {
                button.addEventListener("click", function () {
                    const productId = this.getAttribute("data-id");
                    fetch(`http://localhost:3000/products/${productId}`, {
                        method: "DELETE"
                    })
                    .then(response => response.json())
                    .then(() => {
                        const row = this.closest("tr");
                        row.remove();
                    })
                    .catch(error => console.error('Lỗi khi xóa sản phẩm:', error.message));
                });
            });
        })
        .catch(error => {
            console.error('Lỗi khi tải dữ liệu sản phẩm:', error.message);
            document.querySelector(".product-management").innerHTML = '<p class="error-message">Lỗi khi tải dữ liệu sản phẩm. Vui lòng thử lại sau.</p>';
        });

    // Fetch dữ liệu người dùng từ JSON Server
    fetch("http://localhost:3000/users")
        .then(response => response.json())
        .then(users => {
            const userTableBody = document.querySelector(".customer-table tbody");
            users.forEach(user => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.firstname} ${user.lastname}</td>
                    <td>${user.username}</td>
                    <td>
                        <button class="edit-user-btn" data-id="${user.id}">Sửa</button>
                        <button class="delete-user-btn" data-id="${user.id}">Xóa</button>
                    </td>
                `;
                userTableBody.appendChild(row);
            });

            // Xử lý sự kiện sửa người dùng
            document.querySelectorAll(".edit-user-btn").forEach(button => {
                button.addEventListener("click", function () {
                    const userId = this.getAttribute("data-id");
                    fetch(`http://localhost:3000/users/${userId}`)
                        .then(response => response.json())
                        .then(user => {
                            document.getElementById('editUserForm').style.display = 'block';
                            document.getElementById('editUserForm').setAttribute('data-id', user.id);
                            document.getElementById('editFirstname').value = user.firstname;
                            document.getElementById('editLastname').value = user.lastname;
                            document.getElementById('editUsername').value = user.username;
                            document.getElementById('editPassword').value = user.password;
                            document.getElementById('editRole').value = user.role;
                        })
                        .catch(error => console.error('Lỗi khi tải người dùng:', error.message));
                });
            });

            // Xử lý sự kiện lưu người dùng
            document.getElementById('saveUserBtn').addEventListener('click', function () {
                const userId = document.getElementById('editUserForm').getAttribute('data-id');
                const updatedUser = {
                    firstname: document.getElementById('editFirstname').value,
                    lastname: document.getElementById('editLastname').value,
                    username: document.getElementById('editUsername').value,
                    password: document.getElementById('editPassword').value,
                    role: document.getElementById('editRole').value
                };
                fetch(`http://localhost:3000/users/${userId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(updatedUser)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Cập nhật người dùng thất bại.');
                    }
                    return response.json();
                })
                .then(() => {
                    document.getElementById('editUserForm').style.display = 'none';
                    location.reload();  // Cập nhật lại bảng người dùng
                })
                .catch(error => {
                    console.error('Lỗi khi lưu người dùng:', error.message);
                    alert('Có lỗi xảy ra khi lưu người dùng. Vui lòng kiểm tra lại.');
                });
            });

            // Xử lý hủy sửa người dùng
            document.getElementById('cancelUserBtn').addEventListener('click', function () {
                document.getElementById('editUserForm').style.display = 'none';
            });

            // Xử lý sự kiện xóa người dùng
            document.querySelectorAll(".delete-user-btn").forEach(button => {
                button.addEventListener("click", function () {
                    const userId = this.getAttribute("data-id");
                    fetch(`http://localhost:3000/users/${userId}`, {
                        method: "DELETE"
                    })
                    .then(response => response.json())
                    .then(() => {
                        const row = this.closest("tr");
                        row.remove();
                    })
                    .catch(error => console.error('Lỗi khi xóa người dùng:', error.message));
                });
            });
        })
        .catch(error => {
            console.error('Lỗi khi tải dữ liệu người dùng:', error.message);
            document.querySelector(".admin-actions").innerHTML = '<p class="error-message">Lỗi khi tải dữ liệu người dùng. Vui lòng thử lại sau.</p>';
        });
});
document.addEventListener("DOMContentLoaded", function () {





});
document.addEventListener("DOMContentLoaded", function () {
    const orderTableBody = document.querySelector("#order-table tbody");
    const orderDetails = document.getElementById("order-details");
    const orderInfo = document.getElementById("order-info");
    const closeDetailsButton = document.getElementById("close-details");
    const modalOverlay = document.querySelector(".modal-overlay");

    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    function saveOrders() {
        localStorage.setItem("orders", JSON.stringify(orders));
    }

    function displayOrders() {
        orderTableBody.innerHTML = "";

        if (orders.length === 0) {
            orderTableBody.innerHTML = `<tr><td colspan="6">Chưa có đơn hàng nào.</td></tr>`;
            return;
        }

        orders.forEach((order, index) => {
            const row = `
                <tr>
                    <td>#${order.id}</td>
                    <td>${order.customer}</td>
                    <td>${order.date}</td>
                    <td>${order.total.toLocaleString()}₫</td>
                    <td>
                        <select class="order-status" data-index="${index}">
                            <option value="Đang xử lý" ${order.status === "Đang xử lý" ? "selected" : ""}>Đang xử lý</option>
                            <option value="Đã giao" ${order.status === "Đã giao" ? "selected" : ""}>Đã giao</option>
                            <option value="Đã hủy" ${order.status === "Đã hủy" ? "selected" : ""}>Đã hủy</option>
                        </select>
                    </td>
                    <td>
                        <button class="view-order" data-index="${index}">Xem</button>
                        <button class="delete-order" data-index="${index}">Xóa</button>
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

        document.querySelectorAll(".delete-order").forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                deleteOrder(index);
            });
        });

        document.querySelectorAll(".order-status").forEach(select => {
            select.addEventListener("change", function () {
                const index = this.getAttribute("data-index");
                orders[index].status = this.value;
                saveOrders();
                displayOrders();
            });
        });
    }

    function showOrderDetails(index) {
        const order = orders[index];
        if (!order || !order.items) return;

        let detailsHTML = `
            <p><strong>Mã đơn hàng:</strong> #${order.id}</p>
            <p><strong>Khách hàng:</strong> ${order.customer}</p>
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
        modalOverlay.classList.add("active");
    }

    function deleteOrder(index) {
        if (confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) {
            orders.splice(index, 1);
            saveOrders();
            displayOrders();
        }
    }

    closeDetailsButton.addEventListener("click", function () {
        orderDetails.classList.remove("active");
        modalOverlay.classList.remove("active");
    });

    displayOrders();
});
document.getElementById("back-to-home").addEventListener("click", function () {
    // Xóa thông tin đăng nhập cũ (giả sử được lưu trong localStorage)
    localStorage.removeItem("user");

    // Chuyển hướng về trang đăng nhập
    window.location.href = "login.html";
});
