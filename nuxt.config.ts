const isProd = process.env.NODE_ENV === 'production'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  extends: ['@nuxt/ui-pro'],
  modules: [
    '@nuxt/eslint',
    '@nuxthub/core',
    'nuxt-auth-utils',
    '@nuxt/ui',
    'nuxt-security',
  ],
  routeRules: {
    '/api/me': {
      security: {
        rateLimiter: {
          headers: false,
          interval: 60 * 1000,
          tokensPerInterval: 6,
        },
      },
    },
    '/api/_hub/**': {
      csurf: false,
    },
    '/**': {
      security: {
        rateLimiter: false,
      },
    },
  },
  runtimeConfig: {
    app: {
      name: '',
      url: '',
    },
    mail: {
      key: '',
      from: '',
    },
    oauth: {
      google: {
        clientId: process.env.NUXT_OAUTH_GOOGLE_CLIENT_ID,
        clientSecret: process.env.NUXT_OAUTH_GOOGLE_CLIENT_SECRET,
        redirectUrl: process.env.NUXT_OAUTH_GOOGLE_REDIRECT_URL || 'https://wishlister.online/auth/google'
      }
    },
  },
  hub: {
    database: true,
    blob: true,
    kv: true,
  },
  nitro: {
    experimental: {
      tasks: true,
      appManifest: false
    },
    routeRules: {
      '/api/**': {
        cors: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
          'Access-Control-Allow-Headers': 'Content-Type,Authorization,csrf-token',
        }
      }
    }
  },
  nuxthub: {
    blob: {
      driver: 'fs'
    }
  },
  security: {
    csrf: {
      enabled: true,
      exclude: ['/api/public/**', '/auth/google/**'],
      methodsToProtect: ['POST', 'PUT', 'DELETE', 'PATCH']
    },
    rateLimiter: {
      driver: {
        name: 'cloudflare-kv-binding',
        options: {
          binding: 'KV',
        },
      },
    },
    headers: {
      contentSecurityPolicy: {
        'img-src': ['\'self\'', 'data:', 'https://avatars.githubusercontent.com', 'https://static-cdn.jtvnw.net', 'https://lh3.googleusercontent.com'],
        'script-src': ['\'self\'', '\'unsafe-inline\'', 'https:', 'https://accounts.google.com', 'https://static.cloudflareinsights.com'],
        'frame-src': ['\'self\'', 'https://accounts.google.com'],
        'connect-src': ['\'self\'', 'https://accounts.google.com', 'https://www.googleapis.com']
      },
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: false,
      crossOriginOpenerPolicy: false
    },
    corsHandler: {
      origin: ['https://wishlister.online'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization', 'csrf-token']
    }
  },
  csurf: {
    methodsToProtect: ['POST', 'PUT', 'PATCH', 'DELETE'],
  },
  colorMode: {
    preference: 'light',
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },
})
