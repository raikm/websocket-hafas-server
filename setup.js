const createClient = require("hafas-client");
const bvgProfile = require("hafas-client/p/bvg");

const client = createClient(bvgProfile, "hafas");

const JSONdb = require("simple-json-db");

function showNearbyStations(_latitude, _longitude, _distance) {
  client
    .nearby(
      {
        type: "location",
        latitude: _latitude,
        longitude: _longitude,
      },
      { distance: _distance }
    )
    .then((result) => {
      return result;
    })
    .catch(console.error);
}

function saveFavorites(_favoritesJson) {
  const db = new JSONdb("/path/to/your/database.json");
  //* if station and lines already exist -> overwrite
  //* else create new storage
}

function getFavoritesFromDb() {
  const db = new JSONdb("/path/to/your/database.json");
  //*get data from DB and return
}
