const createClient = require("hafas-client");
const bvgProfile = require("hafas-client/p/bvg");

const JSONdb = require("simple-json-db");
const db = new JSONdb("database.json");

module.exports = {
  showNearbyStationsWithLines: async function (
    _latitude,
    _longitude,
    _distance
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
        stationInformation.lines.forEach((element) => {
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
  },

  saveFavorites: function (_favoriteStationLine) {
    const { stationId, line } = _favoriteStationLine;
    const stationsWithLines = db.get("stationWithLines");
    stationsWithLines.forEach((station) => {
      if (station.id === stationId) {
        station.lines.forEach((_line) => {
          if (_line.id === line) {
            _line.active = _line.active === true ? false : true;
          }
        });
      }
    });
    db.set("stationWithLines", stationsWithLines);
  },

  getFavoritesFromDb: function getFavoritesFromDb() {
    const stationWithLines = db.get("stationWithLines");
    //const r = data.filter(d => d.courses.every(c => courses.includes(c.id)));

    // const stationWithLinesFiltered = stationWithLines.filter((station) => {
    //   station.lines.every((line) => line.active === false);
    // });
    const stationWithLinesFiltered = stationWithLines.map((station) => {
      station.lines = station.lines.filter((line) => line.active === true);
      return station;
    });
    //results.map(result=>{result.courses = result.courses.filter(course=>(filter.includes(course.id)))return result})
    return stationWithLinesFiltered.filter(
      (station) => station.lines.length != 0
    );
  },
};
