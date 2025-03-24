document.addEventListener("DOMContentLoaded", function () {
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
            // Kiểm tra role để xác định loại tài khoản (Admin hoặc User)
            if (user.role === "admin") {
              localStorage.setItem("loggedInAdmin", user.username);
              alert("Đăng Nhập Thành Công");
              window.location.href = "admin.html"; // Điều hướng đến trang Admin
            } else {
              localStorage.setItem("loggedInUsername", user.username);
              alert("Đăng Nhập Thành Công");
              window.location.href = "index.html"; // Điều hướng đến trang chính cho User
            }
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
});
