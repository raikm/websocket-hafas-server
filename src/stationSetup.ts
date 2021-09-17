const createClient = require("hafas-client");
const bvgProfile = require("hafas-client/p/bvg");

const JSONdb = require("simple-json-db");
const db = new JSONdb("database.json");

export async function showNearbyStationsWithLines(
  _latitude: any,
  _longitude: any,
  _distance: any
) {
  const datbase = db.JSON();
  // check Database
  if (Object.entries(datbase).length !== 0) return db.get("stationWithLines");
  else {
    // -> Datbase empty so request fresh list
    const client = createClient(bvgProfile, "hafas");
    let stationsWithLines = [];
    const resultNearby = await client.nearby(
      {
        type: "location",
        latitude: _latitude,
        longitude: _longitude,
      },
      { distance: _distance }
    );
    for (const station of resultNearby) {
      let stationInformation = await client.stop(station.id, {
        linesOfStops: true,
      });
      stationInformation.lines.forEach((element: any) => {
        element.active = false;
      });
      stationsWithLines.push({
        name: stationInformation.name,
        id: stationInformation.id,
        lines: stationInformation.lines,
      });
    }
    // write stationWithLines in DB
    db.set("stationWithLines", stationsWithLines);
    return db.get("stationWithLines");
  }
}

export function saveFavorites(_favoriteStationLine: any) {
  const { stationId, line } = _favoriteStationLine;
  const stationsWithLines = db.get("stationWithLines");
  stationsWithLines.forEach((station: any) => {
    if (station.id === stationId) {
      station.lines.forEach((_line: any) => {
        if (_line.id === line) {
          _line.active = _line.active === true ? false : true;
        }
      });
    }
  });
  db.set("stationWithLines", stationsWithLines);
}

export function getFavoritesFromDb() {
  const stationWithLines = db.get("stationWithLines");
  // Active === true means it is a favorite marked line
  const stationWithLinesFiltered = stationWithLines.map((station: any) => {
    station.lines = station.lines.filter((line: any) => line.active === true);
    return station;
  });
  // Remove empty stations where no favorite lines are saved
  return stationWithLinesFiltered.filter(
    (station: any) => station.lines.length != 0
  );
}
