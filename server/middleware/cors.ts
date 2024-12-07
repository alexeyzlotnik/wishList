import { defineEventHandler, setResponseHeaders } from 'h3'

export default defineEventHandler((event) => {
  const responseHeaders = event.node.res.getHeaders()
  responseHeaders['Access-Control-Allow-Origin'] = '*'
  responseHeaders['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
  responseHeaders['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
})

