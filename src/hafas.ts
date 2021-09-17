import { Alternative, HafasClient, Line, Stop } from "hafas-client";

const createClient = require("hafas-client");

export async function getDepartures(_favoriteLines: Stop[]) {
  // Hafas Client
  const bvgProfile = require("hafas-client/p/bvg");
  const client: HafasClient = createClient(bvgProfile, "hafas");

  let allDepartures: Array<any> = [];
  for (const station of _favoriteLines) {
    // Get for each Station the Lines
    const lineIds = station.lines!.map((line: Line) => line.id);
    for (const lineId of lineIds) {
      // Get Depatures from specific station
      let departuresFromStation = await client.departures(
        station.id!,
        undefined
      );
      departuresFromStation = departuresFromStation.filter(
        (departure: Alternative) => {
          const depatureTime = new Date(departure.plannedWhen!);
          // The Depature has to be > 4 minutes
          // BUG -> doesnt work
          if (
            departure.line?.id === lineId &&
            (depatureTime.getTime() - new Date().getTime()) / 1000 > 4
          ) {
            return true;
          }
          return false;
        }
      );
      allDepartures.push(departuresFromStation);
    }
  }

  return allDepartures;
  // * LOOP client.departures... -> use filter OPT
}
