fetch('products.json')
  .then(response => response.json())
  .then(data => {
    const productListContainer = document.getElementById('product-list');
    const pagination = document.getElementById('pagination');
    
    let currentProducts = data.products; // To lưu trữ sản phẩm hiện tại
    let currentPage = 1; // Trang hiện tại
    
    function displayProducts(productList, page = 1) {
      productListContainer.innerHTML = ''; // Xóa danh sách cũ nếu có
    
      const itemsPerPage = 8; // Số sản phẩm mỗi trang
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
    
      if (productList.length === 0) {
        displayNoProducts();
        return;
      }
    
      productList.slice(start, end).forEach(product => {
        const productHTML = `
          <div class="box-sanpham">
            <div class="boder-sanpham">
              <div class="sanpham">
                <span class="label-tragop">Trả góp 1%</span>
                <img src="image/${product.image}" alt="${product.name}" data-id="${product.id}" />
                <span class="label-sale"><i class="fa-regular fa-bell"></i> FLASH SALE GIÁ SỐC</span>
                <br />
                <span>${product.name}</span>
                <br />
                <p class="gia">${product.sale.toLocaleString()}đ <del>${product.price.toLocaleString()}đ</del></p>
                <p class="online-gia-re">Online giá rẻ</p>
                <p class="sao">${product.star} <i class="fa-solid fa-star"></i></p>
              </div>
            </div>
          </div>
        `;
        productListContainer.innerHTML += productHTML;
      });
    
      // Bắt sự kiện click vào các ảnh sản phẩm
      document.querySelectorAll('.sanpham img').forEach(img => {
        img.addEventListener('click', function() {
          const productId = this.getAttribute('data-id'); // Lấy id sản phẩm từ data-attribute
          if (productId) {
            window.location.href = `chitiet.html?id=${productId}`; // Điều hướng đến trang chi tiết sản phẩm với id
          }
        });
      });
    
      renderPagination(productList.length, page); // Gọi hàm phân trang với dữ liệu và trang hiện tại
    }
    
    
    // Hàm hiển thị thông báo "Không có sản phẩm"
    function displayNoProducts() {
      productListContainer.innerHTML = '<p>Không có sản phẩm trong danh mục này</p>';
    }

    // Hàm hiển thị các nút phân trang
    function renderPagination(totalItems, currentPage) {
      pagination.innerHTML = ''; // Xóa các nút phân trang hiện tại

      const itemsPerPage = 8;
      const totalPages = Math.ceil(totalItems / itemsPerPage);

      for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.add('page-button');
        if (i === currentPage) {
          pageButton.classList.add('active');
        }
        pageButton.onclick = () => {
          displayProducts(currentProducts, i); // Hiển thị sản phẩm cho trang đó
        };
        pagination.appendChild(pageButton);
      }
    }

    // Hiển thị tất cả sản phẩm ban đầu
    displayProducts(currentProducts, currentPage);
    

    // Lắng nghe click vào các menu li và a
    document.querySelectorAll('.menu-list li, .box-menu a').forEach(item => {
      item.addEventListener('click', function(e) {
        e.preventDefault();  // Ngăn chặn hành động mặc định của liên kết
        const selectedCategory = this.getAttribute('data-category') || this.textContent;  // Lấy danh mục từ data-attribute hoặc nội dung
        
        if (selectedCategory === "Tất cả danh mục") {
          currentProducts = data.products;
          currentPage = 1; // Đặt về trang đầu tiên khi chọn "Tất cả danh mục"
        } else {
          currentProducts = data.products.filter(product => product.category === selectedCategory);
          currentPage = 1; // Đặt về trang đầu tiên sau khi lọc theo danh mục
        }

        displayProducts(currentProducts, currentPage); // Hiển thị sản phẩm theo danh mục mới
      });
    });

  })
  .catch(error => console.error('Lỗi khi tải dữ liệu sản phẩm:', error));

// Chờ DOM sẵn sàng trước khi thực hiện
  document.addEventListener("DOMContentLoaded", function () {
    const tenTaiKhoan = document.getElementById("tenTaiKhoan");
    const tenNguoiDungHienThi = document.getElementById("tenNguoiDungHienThi");
    const menuChuaDangNhap = document.getElementById("menuChuaDangNhap");
    const menuDaDangNhap = document.getElementById("menuDaDangNhap");

    // Kiểm tra trạng thái đăng nhập
    const nguoiDungDangNhap = localStorage.getItem("loggedInUsername");

    if (nguoiDungDangNhap) {
      // Nếu đã đăng nhập
      tenTaiKhoan.textContent = nguoiDungDangNhap; // Hiển thị tên người dùng
      tenNguoiDungHienThi.textContent = nguoiDungDangNhap;
      // menuDaDangNhap.style.display = "flex"; // Hiển thị menu sau khi đăng nhập
      menuChuaDangNhap.style.display = "none"; // Ẩn menu chưa đăng nhập
    } else {
      // Nếu chưa đăng nhập
      menuDaDangNhap.style.display = "none";
      // menuChuaDangNhap.style.display = "flex"; // Hiển thị menu chưa đăng nhập
    }

    // Xử lý đăng xuất
    const nutDangXuat = document.getElementById("nutDangXuat");
    if (nutDangXuat) {
      nutDangXuat.addEventListener("click", function () {
        localStorage.removeItem("loggedInUsername");
        location.reload(); // Tải lại trang sau khi đăng xuất
      });
    }

    // Xử lý đăng nhập
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const inputUsername = document.querySelector(".input-login-username");
        const inputPassword = document.querySelector(".input-login-password");
        const errorMessage = document.querySelector(".error-message");

        // Xóa thông báo lỗi trước đó
        errorMessage.textContent = "";

        // Kiểm tra các trường không để trống
        if (!inputUsername.value || !inputPassword.value) {
          errorMessage.textContent = "Vui lòng không để trống các trường.";
          return;
        }

        // Gọi fetch để lấy dữ liệu từ JSON Server
        fetch("http://localhost:3000/users")
          .then((response) => response.json())
          .then((users) => {
            const user = users.find(
              (user) =>
                user.username === inputUsername.value &&
                user.password === inputPassword.value
            );

            if (user) {
              // Lưu tên đăng nhập vào localStorage để ghi nhớ
              localStorage.setItem("loggedInUsername", user.username);

              // Chuyển hướng sau khi đăng nhập thành công
              alert("Đăng Nhập Thành Công");
              window.location.href = "index.html"; // Chuyển hướng đến trang chủ
            } else {
              errorMessage.textContent = "Tên đăng nhập hoặc mật khẩu không đúng.";
            }
          })
          .catch(error => {
            console.error('Lỗi khi tải dữ liệu sản phẩm:', error.message);
            productListContainer.innerHTML = '<p>Lỗi khi tải dữ liệu sản phẩm. Vui lòng thử lại sau.</p>';
          });
          
      });
    }

    // Hiển thị hoặc ẩn mật khẩu
    const togglePassword = document.getElementById("toggle-password");
    if (togglePassword) {
      togglePassword.addEventListener("change", (e) => {
        const passwordField = document.querySelector(".input-login-password");
        if (passwordField) {
          passwordField.type = e.target.checked ? "text" : "password";
        }
      });
    }
  });
document.addEventListener("DOMContentLoaded", function () {
  const productDetailContainer = document.getElementById('product-detail');
  const relatedProductList = document.querySelector('.related-product-list');
  const otherProductList = document.querySelector('.other-products-list');
  const cartCounter = document.getElementById('cart-counter'); // Selector cho hiển thị số lượng sản phẩm
  let cartCount = parseInt(localStorage.getItem('cartCount')) || 0; // Lấy dữ liệu từ localStorage

  // Cập nhật giao diện từ localStorage
  cartCounter.textContent = cartCount;

  // Lấy id từ URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id'); 

  fetch('products.json')
    .then(response => response.json())
    .then(data => {
      const product = data.products.find(product => product.id == productId);

      if (product) {
        // Hiển thị chi tiết sản phẩm
        const productDetailHTML = `
          <div class="product-detail">
            <h1>${product.name}</h1>
            <img src="image/${product.image}" alt="${product.name}" />
            <p>${product.description}</p>
            <p class="price">Giá: ${product.sale.toLocaleString()}đ</p>
            <p class="rating">Đánh giá: ${product.star} <i class="fa-solid fa-star"></i></p>
            <p class="category">Category: ${product.category}</p>
            <button id="add-to-cart">Thêm vào giỏ hàng</button>
          </div>
        `;
        productDetailContainer.innerHTML = productDetailHTML;

        // Xử lý sự kiện bấm vào nút "Thêm vào giỏ hàng"
        const addToCartButton = document.getElementById("add-to-cart");
        if (addToCartButton) {
          addToCartButton.addEventListener("click", function() {
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            let productInCart = cart.find(item => item.id === product.id);
            if (productInCart) {
              productInCart.quantity++;
            } else {
              cart.push({
                id: product.id,
                name: product.name,
                image: `image/${product.image}`,
                price: product.sale,
                quantity: 1
              });
            }
            localStorage.setItem("cart", JSON.stringify(cart));
            alert("Sản phẩm đã được thêm vào giỏ hàng!");
            window.location.reload();
          });
        }
        


        // Hiển thị sản phẩm liên quan
        const relatedProducts = data.products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
        relatedProducts.forEach(p => {
          const relatedHTML = `
            <div class="related-product-item">
              <img src="image/${p.image}" alt="${p.name}" />
              <h3>${p.name}</h3>
              <p class="price">${p.sale.toLocaleString()}đ</p>
              <a href="chitiet.html?id=${p.id}" class="view-details">Xem chi tiết</a>
            </div>
          `;
          relatedProductList.innerHTML += relatedHTML;
        });

        // Hiển thị các sản phẩm ngẫu nhiên
        const otherProducts = data.products
          .filter(p => p.id !== product.id) // Loại bỏ sản phẩm đang xem
          .sort(() => Math.random() - 0.5) // Trộn ngẫu nhiên
          .slice(0, 4); // Lấy tối đa 4 sản phẩm

        otherProducts.forEach(p => {
          const otherHTML = `
            <div class="other-product-item">
              <img src="image/${p.image}" alt="${p.name}" />
              <h3>${p.name}</h3>
              <p class="price">${p.sale.toLocaleString()}đ</p>
              <a href="chitiet.html?id=${p.id}" class="view-details">Xem chi tiết</a>
            </div>
          `;
          otherProductList.innerHTML += otherHTML;
        });
      
        // Hiển thị sản phẩm
    } else {
        productDetailContainer.innerHTML = '<p>Sản phẩm không tìm thấy.</p>';
    }
    
      
    })
    .catch(error => {
      console.error("Lỗi khi tải sản phẩm:", error);
      productDetailContainer.innerHTML = "<p>Không thể tải sản phẩm. Vui lòng thử lại sau.</p>";
    });
    
});
document.addEventListener("DOMContentLoaded", function () {
  const changeInfoForm = document.getElementById("change-info-form");

  if (changeInfoForm) {
      changeInfoForm.addEventListener("submit", function (event) {
          event.preventDefault();

          const currentUsername = document.getElementById("current-username").value;
          const newUsername = document.getElementById("new-username").value;
          const newPassword = document.getElementById("new-password").value;
          const confirmPassword = document.getElementById("confirm-password").value;

          const errorMessage = document.createElement("p");
          errorMessage.classList.add("error-message");

          // Xóa thông báo lỗi trước đó
          const existingErrorMessage = document.querySelector(".error-message");
          if (existingErrorMessage) {
              existingErrorMessage.remove();
          }

          // Kiểm tra các trường không để trống
          if (!currentUsername || (!newUsername && !newPassword) || (newPassword !== confirmPassword)) {
              errorMessage.textContent = "Vui lòng nhập đầy đủ và chính xác thông tin.";
              document.getElementById("change-info-form-container").prepend(errorMessage);
              return;
          }

          // Gọi fetch để cập nhật dữ liệu
          fetch("http://localhost:3000/users")
              .then((response) => response.json())
              .then((users) => {
                  const userIndex = users.findIndex(
                      (user) => user.username === currentUsername
                  );

                  if (userIndex !== -1) {
                      const updatedUser = users[userIndex];
                      if (newUsername) updatedUser.username = newUsername;
                      if (newPassword) updatedUser.password = newPassword;

                      // Gọi fetch để cập nhật thông tin
                      fetch(`http://localhost:3000/users/${updatedUser.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(updatedUser),
                      })
                      .then(response => response.json())
                      .then(() => {
                        alert("Cập nhật thông tin thành công!");
                        localStorage.setItem("loggedInUsername", updatedUser.username); 
                        window.location.reload();
                      })
                      .catch(error => console.error("Lỗi khi cập nhật thông tin:", error));
                      
                  } else {
                      errorMessage.textContent = "Tên đăng nhập hiện tại không đúng.";
                      document.getElementById("change-info-form-container").prepend(errorMessage);
                  }
              })
              .catch(error => {
                  console.error('Lỗi khi tải dữ liệu người dùng:', error);
                  errorMessage.textContent = "Lỗi xảy ra khi tải dữ liệu người dùng. Vui lòng thử lại sau.";
                  document.getElementById("change-info-form-container").prepend(errorMessage);
              });
      });
  }
});

