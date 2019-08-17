var submitted = false;

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").then(function() {
    console.log("Service Worker Registered");
  });
}

function doUppercase() {
  const reg = document.querySelector("#regInput");
  reg.value = reg.value
    .replace(" ", "")
    .toUpperCase()
    .replace(/^(\w{4}?)\s*(\w+$)/, "$1 $2");
}

function selectPrayerTime() {
  console.log("i am here");
  const elem = document.getElementById("prayer-time");
  if (elem.selectedIndex !== 0) return;
  const today = new Date();
  let now = today.getHours() + today.getMinutes() / 60.0;
  const d = today.getDate() + 1;

  fetch(
    `https://script.google.com/a/macros/bilalmasjid.co.uk/s/AKfycbx32N0Mu6rh15Jj_WULEwdxGY7NKpzm7PTg8NpYy8dW-Iz5VIr9/exec?name=formatted&range=F${d}:P${d}`
  )
    .then(res => res.json())
    .then(row => {
      const [fj, , zj, , aj, , mj, , ij, , un] = row[0].map(val => {
        try {
          const [h, m] = val.split(":").map(Number);
          return h + m / 60.0;
        } catch (e) {
          return 0;
        }
      });

      if (elem.selectedIndex !== 0) return;
      const fajar = fj || un;

      let selected = 0;
      if (Math.abs(now - fajar) < 0.5) selected = 1;
      if (Math.abs(now - zj) < 1.0) selected = 2;
      if (Math.abs(now - aj) < 0.5) selected = 3;
      if (Math.abs(now - mj) < 0.5) selected = 4;
      if (Math.abs(now - ij) < 0.5) selected = 5;
      elem.selectedIndex = selected;
    });
}
window.onload = function(e) {
  document.getElementsByName("image-map")[0].addEventListener("click", function(e) {
    const location = document.getElementsByName("Location")[0];
    location.selectedIndex = e.target.title;
    const [x, y, r] = e.target.coords.split(",").map(Number);
    const highlight = document.getElementsByClassName("highlight")[0];
    highlight.style.left = `${x - r}px`;
    highlight.style.top = `${y - r}px`;
    highlight.style.width = `${2 * r}px`;
    highlight.style.height = `${2 * r}px`;
    highlight.textContent = e.target.title;
    highlight.style.lineHeight = `${2 * r - 8}px`;
    showMap(false);
  });

  selectPrayerTime();
  document.getElementById("capture").addEventListener("change", e => {
    console.log(e);
  });
};

function adjustAreaMap(e) {
  const w = document.querySelector(".imagemap img").clientWidth;
  const map = document.querySelector(".imagemap map");
  const [W, H] = map
    .getAttribute("size")
    .split(",")
    .map(Number);
  const areas = document.querySelectorAll(".imagemap area");
  areas.forEach(a => {
    a.coords = a.coords
      .split(",")
      .map(c => Math.floor((w * Number(c)) / W))
      .join(",");
  });
}
function recognizeReg() {}

function formSubmit() {
  submitted = true;
  document.getElementsByTagName("form")[0].style.opacity = 0.2;
  document.getElementById("wait").style.display = "block";
}

function showMap(show) {
  const imagemap = document.getElementsByClassName("imagemap")[0];
  let height = imagemap.style.maxHeight;
  if (show === undefined || show === "toggle") {
    height = parseInt(height) !== 0 ? 0 : "1000px";
  } else {
    height = show ? "1000px" : 0;
  }

  imagemap.style.maxHeight = height;
}
