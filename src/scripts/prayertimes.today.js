import "../styles/prayertimes.today.css";

window.onload = () => {
  const dateToday = new Date();
  const index = dateToday.getDate() + 1;
  const range = `A${index}:S${index + 1}`;

  const log = window.localStorage.getItem("debug") === "true" ? console.log : () => {};

  // poll frequency: download data from server with this frequency
  // 8 - 11 = once a day
  // 12 = twice a day
  // 13 = every hour
  // 14 = every half an hour
  // 15 = every 10 minute
  // 16 = every minute
  // 18 = every 10 secs
  // 19 = every 1 secs
  const frequency = parseInt(window.localStorage.getItem("frequency") || "12", 10);

  const timeOptions = {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  };

  function formatTime(time, incH = 0, incM = 0) {
    const split = time.replace(/[^ -~]/g, "").split(/[\:\s]/);
    const t = new Date(dateToday);
    t.setHours(Number(split[0]) + incH);
    t.setMinutes(Number(split[1]) + incM);
    return t.toLocaleTimeString("en-GB", timeOptions).replace(/[^ -~]/g, "");
  }

  const getRowData = (row) => {
    const [
      date,
      islamicDay,
      day,
      fajarBegins,
      fajarJamaat,
      sunrise,
      dhurBegins,
      dhurJamaat,
      asarBegins,
      asarJamaat,
      maghribBegins,
      maghribJamaat,
      ishaBegins,
      ishaJamaat,
      islamicMonthNumber,
      islamicYear,
      firstJumah = "12:30",
      secondJumah = "13:10",
      thirdJumah,
      unofficial,
    ] = row.map((val, i) => {
      const [hh, mm] = val.split(":");
      if (mm) {
        const t = new Date(dateToday);
        const h = Number(hh);
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
      "Rabi ath-Thani",
      "Jumadi ul-Ula",
      "Jumadi ul-Akhirah",
      "Rajab",
      "Sha‘ban",
      "Ramadhan",
      "Shawwal",
      "Dhul-Qadah",
      "Dhul-Hijjah",
    ];
    const islamicMonth = islamicMonthNames[islamicMonthNumber - 1];

    return {
      date,
      islamicDay,
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
      islamicYear,
      unofficial,
      firstJumah,
      secondJumah,
      thirdJumah,
    };
  };

  function drawData({ data, dateString }, valid) {
    log(data, dateString, valid);
    const today = getRowData(data[0]);
    const tomorrow = getRowData(data[1] || data[0]);
    const ishraq = formatTime(today.sunrise, 0, 15);

    const todaysDateStr = `${new Date(
      valid ? new Date().toISOString() : dateString
    ).toLocaleDateString("en-GB", {
      day: "numeric",
      year: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })}`;

    const islamicDayStr = `${today.islamicDay} ${today.islamicMonth} ${islamicYear} Hj`;
    const timeToMins = (t) => {
      const [h, m] = t
        .replace(/[^ -~]/g, "")
        .split(":")
        .map(Number);
      return h * 60 + m;
    };

    const calcStyles = (begins, jamaat, before = 0, after = 0, next) => {
      const style = [];
      const now = timeToMins(new Date().toLocaleTimeString("en-GB", timeOptions).slice(0, 5));
      const from = timeToMins(begins) - before;
      const jamaatTime = timeToMins(jamaat);
      const to = jamaatTime + after;
      style.push(from <= now && now < to ? "highlight" : "");
      if (next && jamaatTime !== timeToMins(next)) style.push("changing");
      return style.join(" ");
    };

    // highlight which jamaat time it is now
    const [sehriClass, dhuhurClass, asarClass, maghribClass, ishaClass] = [
      calcStyles(today.fajarBegins, today.fajarJamaat, 30, 0),
      calcStyles(today.dhurBegins, today.dhurJamaat, 0, 10),
      calcStyles(today.asarBegins, today.asarJamaat, 0, 10, tomorrow.asarJamaat),
      calcStyles(today.maghribBegins, today.maghribBegins, 10, 10),
      calcStyles(today.ishaBegins, today.ishaJamaat, 0, 10, tomorrow.ishaJamaat),
    ];
    const legendClass =
      asarClass.includes("changing") || ishaClass.includes("changing") ? "visible" : "";

    const table = `
<div class="date english">${todaysDateStr}</div>
<div class="date islamic">${islamicDayStr}</div>
<table class="table">
  <thead>
    <tr><th>Salah</th><th>Begins</th><th>Jamaat</th></tr>
  </thead>
  <tbody>
    <tr>
      <td>Fajar</td>
      <td class="${sehriClass}">${today.fajarBegins}</td>
      <td>
        <span class="fajar jamaat">${today.fajarJamaat}</span>
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
      <td class="dhuhur jamaat ${dhuhurClass}">${
      today.day === "Fri" ? today.firstJumah : today.dhurJamaat
    }</td>
    </tr>
    <tr>
      <td>Asar</td>
      <td>${today.asarBegins}</td>
      <td class="asar jamaat ${asarClass}">${today.asarJamaat}</td>
    </tr>
    <tr>
      <td>Maghrib</td>
      <td colspan=2 class="maghrib ${maghribClass}">${today.maghribBegins}</td>
    </tr>
    <tr>
      <td>Isha</td>
      <td>${today.ishaBegins}</td>
      <td class="isha jamaat ${ishaClass}">${today.ishaJamaat}</td>
    </tr>
    <tr>
      <td>Jumah</td>
      <td class="jumah" colspan=2>
        ${[today.firstJumah, today.secondJumah, today.thirdJumah].join(" / ")}
      </td>
    </tr>
  </tbody>
</table>
<div class="legend shine ${legendClass}">• <span>Changing tomorrow</span></div>
          `;
    const table_div = document.getElementById("table_div");
    //log("table html calculated:", table);
    table_div.innerHTML = table;

    if (valid) document.querySelector(".shine").classList.remove("shine");
  }

  let stored = JSON.parse(window.localStorage.getItem("todays-times"));
  const isValid = () =>
    stored &&
    new Date().toISOString().slice(0, frequency) === stored.dateString.slice(0, frequency);

  const params = new URL(document.location).searchParams;
  const sheetId = params.get("id") || "1qS2o3JQ07qFkUXMBvEZVZ3E8Z_mk0jMXXhxJkQ35LR8";
  const sheetName = params.get("name") || "calc-formatted";
  const key = params.get("key");

  if (!key) return console.error("Error: No API Key provided in the params");

  const urlToFetch = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!${range}?key=${key}`;
  log({ urlToFetch });

  const fetchFreshDataAndUpdate = () =>
    fetch(urlToFetch)
      .then((res) => res.json())
      .then((res) => {
        log({ res });
        const data = res.values;
        const dateString = new Date().toISOString();
        stored = { data, dateString };
        window.localStorage.setItem("todays-times", JSON.stringify(stored));
      })
      .catch(log);

  const render = () => {
    const valid = isValid();
    stored && stored.data && drawData(stored, valid);
    if (!valid) fetchFreshDataAndUpdate().then(() => drawData(stored, true));
  };
  render();
  window.setInterval(render, 1000);
};
