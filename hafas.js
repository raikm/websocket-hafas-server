const createClient = require("hafas-client");
const bvgProfile = require("hafas-client/p/bvg");

const client = createClient(bvgProfile, "hafas");

function getDepartures(_favorites) {
  // * LOOP client.departures... -> use filter OPT
}
