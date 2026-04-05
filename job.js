function submitApplication() {
  let name = document.querySelector('input[type="text"]').value;
  let email = document.querySelector('input[type="email"]').value;

  if (name === "" || email === "") {
    alert("⚠️ Please fill in all required fields!");
    return;
  }

  alert("✅ Application submitted! Good luck, " + name + "!");
}