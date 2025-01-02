import { defineEventHandler, setResponseHeaders } from 'h3'

export default defineEventHandler((event) => {
  setResponseHeaders(event, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, csrf-token',
    'Access-Control-Allow-Credentials': 'true'
  })

  if (event.method === 'OPTIONS') {
    event.node.res.statusCode = 204
    event.node.res.statusMessage = 'No Content'
    return 'OK'
  }
})

