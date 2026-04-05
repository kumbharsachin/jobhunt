window.onload = function() {
  console.log("JS file loaded!");

  let btn = document.getElementById('postJobBtn');
  console.log("Button found:", btn);

  if (btn) {
    btn.addEventListener('click', function() {
      alert("BUTTON WORKS!");
    });
  } else {
    alert("ERROR: Button not found!");
  }
}