document.addEventListener("DOMContentLoaded", () => {
  const userInfo = document.getElementById("userInfo");
  const userDropdown = document.getElementById("userDropdown");
  const logoutBtn = document.getElementById("logoutBtn");

  if (userInfo && userDropdown) {
    userInfo.addEventListener("click", () => {
      userDropdown.style.display =
        userDropdown.style.display === "block" ? "none" : "block";
    });

    window.addEventListener("click", (e) => {
      if (!userInfo.contains(e.target) && !userDropdown.contains(e.target)) {
        userDropdown.style.display = "none";
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      userDropdown.style.display = "none";
      localStorage.clear();
      sessionStorage.clear();
      alert("You have been logged out!");
      window.location.href = "index.html";
    });
  }
});
