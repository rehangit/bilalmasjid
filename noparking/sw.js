self.addEventListener("install", function(e) {
  e.waitUntil(
    caches.open("noparking").then(function(cache) {
      return cache.addAll([
        ".",
        "in.html",
        "in.html?homescreen=1",
        "?homescreen=1",
        "noparking-icon-4x.png",
        "NoParkingLocationsWithDesc.png",
        "CharlesWright-Bold.woff"
      ]);
    })
  );
});
