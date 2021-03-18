const http = require('http')
const createHafas = require('hafas-client')
const svvProfile = require('hafas-client/p/svv')


//in server.js there should be a frequent requester
const exposeHafasClient = require('hafas-client-rpc/ws/server')

const httpServer = http.createServer()
httpServer.listen(3000)

const hafas = createHafas(svvProfile, 'homeapp')
const server = exposeHafasClient(httpServer, hafas)
console.log("hafas-websocket-server running")


