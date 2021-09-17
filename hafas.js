const createClient = require("hafas-client");

module.exports = {
  getDepartures: async function (_favoriteLines) {
    const bvgProfile = require("hafas-client/p/bvg");
    const client = createClient(bvgProfile, "hafas");
    let allDepartures = [];
    for (const station of _favoriteLines) {
      const lineIds = station.lines.map((line) => line.id);
      for (const lineId of lineIds) {
        let departuresFromStation = await client.departures(station.id, {
          line: lineId,
        });
        // TODO: filter out less then 4min
        departuresFromStation = departuresFromStation.filter((departure) => {
          const depeatureTime = new Date(departure.plannedWhen);
          const depatureTime = depeatureTime.getTime();
          const diff = (depeatureTime.getTime() - new Date().getTime()) / 1000;
          if (diff > 5) {
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
