const createClient = require("hafas-client");

module.exports = {
  getDepartures: async function (_favoriteLines) {
    // Hafas Client
    const bvgProfile = require("hafas-client/p/bvg");
    const client = createClient(bvgProfile, "hafas");

    let allDepartures = [];
    for (const station of _favoriteLines) {
      // Get for each Station the Lines
      const lineIds = station.lines.map((line) => line.id);
      for (const lineId of lineIds) {
        // Get Depatures from specific station
        let departuresFromStation = await client.departures(station.id, {
          line: lineId,
        });
        departuresFromStation = departuresFromStation.filter((departure) => {
          const depeatureTime = new Date(departure.plannedWhen);
          // const depatureTime = depeatureTime.getTime();
          // The Depature has to be > 4 minutes
          if ((depeatureTime.getTime() - new Date().getTime()) / 1000 > 4) {
            return true;
          }
          return false;
        });
        allDepartures = [...departuresFromStation];
      }
    }

    return allDepartures;
    // * LOOP client.departures... -> use filter OPT
  },
};
