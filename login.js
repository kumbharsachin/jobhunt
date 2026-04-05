// Switch between Login and Signup tabs
function showTab(tab) {
  document.getElementById('login').style.display = 'none';
  document.getElementById('signup').style.display = 'none';
  document.getElementById(tab).style.display = 'block';

  let tabs = document.querySelectorAll('.tab');
  tabs.forEach(t => t.classList.remove('active'));

  if (tab === 'login') tabs[0].classList.add('active');
  if (tab === 'signup') tabs[1].classList.add('active');
}

// Login Function
function loginUser() {
  let email = document.getElementById('loginEmail').value;
  let password = document.getElementById('loginPassword').value;

  if (email === "" || password === "") {
    alert("⚠️ Please fill in all fields!");
    return;
  }

  // Check if user exists in localStorage
  let users = JSON.parse(localStorage.getItem('users')) || [];
  let user = users.find(u => u.email === email && u.password === password);

  if (user) {
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    alert("✅ Welcome back, " + user.name + "!");
    window.location.href = 'index.html';
  } else {
    alert("❌ Invalid email or password!");
  }
}

// Signup Function
function signupUser() {
  let name = document.getElementById('signupName').value;
  let email = document.getElementById('signupEmail').value;
  let password = document.getElementById('signupPassword').value;
  let userType = document.getElementById('userType').value;

  if (name === "" || email === "" || password === "") {
    alert("⚠️ Please fill in all fields!");
    return;
  }

  // Save user to localStorage
  let users = JSON.parse(localStorage.getItem('users')) || [];
  let exists = users.find(u => u.email === email);

  if (exists) {
    alert("❌ Email already registered! Please login.");
    return;
  }

  users.push({ name, email, password, userType });
  localStorage.setItem('users', JSON.stringify(users));

  alert("✅ Account created successfully! Please login.");
  showTab('login');
}