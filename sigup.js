document
  .getElementById("registrationForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const firstname = document.getElementById("firstname").value;
    const lastname = document.getElementById("lastname").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const errorMessage = document.querySelector(".error-message");

    // Xóa thông báo lỗi trước đó
    errorMessage.textContent = "";

    // Kiểm tra các trường không để trống
    if (!firstname || !lastname || !username || !password || !confirmPassword) {
      errorMessage.textContent = "Vui lòng không để trống các trường.";
      return;
    }

    // Kiểm tra độ dài mật khẩu (tối thiểu 6 ký tự)
    if (password.length < 6) {
      errorMessage.textContent = "Mật khẩu phải có ít nhất 6 ký tự.";
      return;
    }

    // Kiểm tra mật khẩu và xác nhận mật khẩu có khớp không
    if (password !== confirmPassword) {
      errorMessage.textContent = "Mật khẩu không khớp.";
      return;
    }

    // Kiểm tra tên đăng nhập đã tồn tại chưa
    fetch("http://localhost:3000/users")
      .then((response) => response.json())
      .then((users) => {
        const existingUser = users.find(user => user.username === username);
        if (existingUser) {
          errorMessage.textContent = "Tên đăng nhập đã tồn tại, vui lòng chọn tên khác.";
          return;
        }

        // Tạo đối tượng người dùng mới
        const user = {
          firstname: firstname,
          lastname: lastname,
          username: username,
          password: password,
        };

        // Gửi dữ liệu tới JSON server (POST request)
        fetch("http://localhost:3000/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        })
          .then((response) => response.json())
          .then((data) => {
            // Thông báo thành công và chuyển hướng đến trang đăng nhập
            alert("Đăng ký thành công!");
            window.location.replace("login.html");

          })
          .catch((error) => {
            errorMessage.textContent = "Lỗi đăng ký! Vui lòng thử lại.";
            console.error("Error:", error);
          });
      });
  });

document.getElementById("toggle-password").addEventListener("change", (e) => {
  const passwordFields = [document.getElementById("password"), document.getElementById("confirmPassword")];
  const passwordType = e.target.checked ? "text" : "password";
  passwordFields.forEach((field) => {
    field.type = passwordType;
  });
});
