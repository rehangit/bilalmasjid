import "@babel/polyfill";
import "whatwg-fetch";
// import { polyfill } from "es6-promise";
// polyfill();

const dateToday = new Date();
window.onload = () => {
  const index = dateToday.getDate() + 1;
  const range = `A${index}:P${index + 1}`;

  const timeOptions = {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit"
  };

  function formatTime(time, incH = 0, incM = 0) {
    var split = time.replace(/[^ -~]/g, "").split(/[\:\s]/);
    var t = new Date(dateToday);
    t.setHours(Number(split[0]) + incH);
    t.setMinutes(Number(split[1]) + incM);
    return t.toLocaleTimeString("en-GB", timeOptions).replace(/[^ -~]/g, "");
  }

  var getRowData = row => {
    var [
      date,
      islamicDate,
      day,
      fajarBegins,
      sunrise,
      fajarJamaat,
      dhurBegins,
      dhurJamaat,
      asarBegins,
      asarJamaat,
      maghribBegins,
      maghribJamaat,
      ishaBegins,
      ishaJamaat,
      islamicMonthNumber,
      unofficial
    ] = row.map((val, i) => {
      var [hh, mm] = val.split(":");
      if (mm) {
        const t = new Date(dateToday);
        const h = Number(hh);
        //t.setHours(i > 5 && i < row.length - 1 && h < 12 ? h + 12 : hh);
        t.setHours(hh);
        t.setMinutes(mm);
        val = t.toLocaleTimeString("en-GB", timeOptions);
      }
      return val;
    });
    const islamicMonthNames = [
      "Muharram",
      "Safar",
      "Rabi al-Awwal",
      "Rabi ath-Thānī",
      "Jumadi ul-Ula",
      "Jumadi ul-Akhirah",
      "Rajab",
      "Sha‘ban",
      "Ramadhan",
      "Shawwal",
      "Dhul-Qa‘dah",
      "Dhul-Hijjah"
    ];
    const islamicMonth = islamicMonthNames[islamicMonthNumber - 1];

    return {
      date,
      islamicDate,
      day,
      fajarBegins,
      sunrise,
      fajarJamaat,
      dhurBegins,
      dhurJamaat,
      asarBegins,
      asarJamaat,
      maghribBegins,
      maghribJamaat,
      ishaBegins,
      ishaJamaat,
      islamicMonth,
      unofficial,
      firstJumah: "13:00",
      secondJumah: "13:30"
    };
  };

  function drawData(data, dateString, cached) {
    var today = getRowData(data[0]);
    var tomorrow = getRowData(data[1] || data[0]);
    var ishraq = formatTime(today.sunrise, 0, 15);
    var todaysDateStr = `${new Date(dateString ? dateString : dateToday).toLocaleDateString(
      "en-GB",
      {
        day: "numeric",
        year: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit"
      }
    )}`;

    var islamicDateStr = `${today.islamicDate} ${today.islamicMonth} 1440 Hj`;
    var timeToMins = t => {
      const [h, m] = t
        .replace(/[^ -~]/g, "")
        .split(":")
        .map(Number);
      return h * 60 + m;
    };

    var calcStyles = (begins, jamaat, before = 0, after = 0, next) => {
      const style = [];
      var now = timeToMins(dateToday.toLocaleTimeString("en-GB", timeOptions).slice(0, 5));
      var from = timeToMins(begins) - before;
      var jamaatTime = timeToMins(jamaat);
      var to = jamaatTime + after;
      style.push(from <= now && now < to ? "highlight" : "");
      if (next && jamaatTime !== timeToMins(next)) style.push("changing");
      return style.join(" ");
    };

    // highlight which jamaat time it is now
    var [sehriClass, dhuhurClass, asarClass, maghribClass, ishaClass] = [
      calcStyles(today.fajarBegins, today.fajarJamaat, 30, 0),
      calcStyles(today.dhurBegins, today.dhurJamaat, 0, 10),
      calcStyles(today.asarBegins, today.asarJamaat, 0, 10, tomorrow.asarJamaat),
      calcStyles(today.maghribBegins, today.maghribBegins, 10, 10),
      calcStyles(today.ishaBegins, today.ishaJamaat, 0, 10, tomorrow.ishaJamaat)
    ];
    var legendClass =
      asarClass.includes("changing") || ishaClass.includes("changing") ? "visible" : "";

    var table = `
<div class="date english">${todaysDateStr}</div>
<div class="date islamic">${islamicDateStr}</div>
<table class="table">
  <thead>
    <tr><th>Salah</th><th>Begins</th><th>Jamaat</th></tr>
  </thead>
  <tbody>
    <tr>
      <td>Fajar</td>
      <td class="${sehriClass}">${today.fajarBegins}</td>
      <td>
        <span class="fajarJamaat">${today.fajarJamaat}</span>
        <span class="unofficial">${today.unofficial}</span>
      </td>
    </tr>
    <tr>
      <td>Sunrise</td>
      <td colspan=2
          data-text="${ishraq}"
          class="ishraq"
      >
        ${today.sunrise}
      </td>
    </tr>
    <tr>
      <td>${today.day === "Fri" ? "Jumah" : "Zuhr"}</td>
      <td>${today.dhurBegins}</td>
      <td class="${dhuhurClass}">${
      today.day === "Fri" ? today.firstJumah + " / " + today.secondJumah : today.dhurJamaat
    }</td>
    </tr>
    <tr>
      <td>Asar</td>
      <td>${today.asarBegins}</td>
      <td class="${asarClass}">${today.asarJamaat}</td>
    </tr>
    <tr>
      <td>Maghrib</td>
      <td colspan=2 class="${maghribClass}">${today.maghribBegins}</td>
    </tr>
    <tr>
      <td>Isha</td>
      <td>${today.ishaBegins}</td>
      <td class="${ishaClass}">${today.ishaJamaat}</td></tr>
    <tr>
      <td>1st Jumah</td><td colspan=2>${today.firstJumah}</td>
    </tr>
    <tr>
      <td>2nd Jumah</td><td colspan=2>${today.secondJumah}</td>
    </tr>
  </tbody>
</table>
<div class="legend shine ${legendClass}">• <span>Changing tomorrow</span></div>
          `;
    const table_div = document.getElementById("table_div");
    console.log("table html calculated:", table);
    table_div.innerHTML = table;
    if (!cached) {
      document.querySelector(".shine").classList.remove("shine");
    }
  }

  const storedData = JSON.parse(window.localStorage.getItem("todays-times"));
  const dateString = dateToday.toLocaleDateString();
  if (storedData && storedData.dateString) {
    drawData(storedData.data, dateString, true);
  }

  console.log("about to fetch");
  fetch(
    `https://script.google.com/a/macros/bilalmasjid.co.uk/s/AKfycbx32N0Mu6rh15Jj_WULEwdxGY7NKpzm7PTg8NpYy8dW-Iz5VIr9/exec?name=calc-formatted&range=${range}`
  )
    .then(res => res.json())
    .then(data => {
      console.log("data fetched:", data);
      drawData(data);
      window.localStorage.setItem(
        "todays-times",
        JSON.stringify({
          data,
          dateString
        })
      );
      window.setInterval(() => drawData(data), 1000 * 30);
    });
};
