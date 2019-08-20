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
    adjustHighlight(e.target);
  });

  selectPrayerTime();
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
function recognizeReg(elem) {
  const regInput = document.getElementById("regInput");
  regInput.value = "";
  regInput.disabled = true;
  const icon = elem.parentElement.firstElementChild;
  const origClass = icon.className;
  icon.className = "fa fa-cog fa-spin";
  readFileContents(elem.files[0])
    .then(data =>
      fetch(
        "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBAQdSbOWJttXYeXCz4wJqniTje-QLRdjE",
        {
          method: "POST",
          body: JSON.stringify({
            requests: [
              {
                image: { content: data.split(",")[1] },
                features: [
                  {
                    type: "TEXT_DETECTION",
                    maxResults: 1
                  }
                ]
              }
            ]
          })
        }
      )
    )
    .then(res => res.json())
    .then(res => {
      const text = res.responses[0].fullTextAnnotation.text.trim();
      const match = text.match(/[A-Z]{2,3}[0-9]{1,2}\s{1}[A-Z0]{3}/g);
      const reg = match ? match[0] : text;
      console.log({ text, reg });
      regInput.value = reg;
      icon.className = origClass;
      regInput.disabled = false;
    })
    .catch(() => {
      regInput.disabled = false;
      icon.className = origClass;
    });
}

function readFileContents(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      resolve(reader.result);
    });
    reader.readAsDataURL(file);
  });
}

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

function adjustHighlight(selectedArea) {
  const [x, y, r] = selectedArea.coords.split(",").map(Number);
  const highlight = document.getElementsByClassName("highlight")[0];
  highlight.style.left = `${x - r}px`;
  highlight.style.top = `${y - r}px`;
  highlight.style.width = `${2 * r}px`;
  highlight.style.height = `${2 * r}px`;
  highlight.textContent = selectedArea.title;
  highlight.style.lineHeight = `${2 * r - 8}px`;
  showMap(false);
}

function selectLocation(elem) {
  const index = elem.selectedIndex;
  const selectedArea = document.querySelectorAll(".imagemap map area")[index - 1];
  console.log(elem.selectedIndex, selectedArea);
  adjustHighlight(selectedArea);
}
