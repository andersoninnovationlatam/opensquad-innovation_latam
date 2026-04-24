import { onRequestGet as __api_logs___path___js_onRequestGet } from "/home/anderson/Documentos/InnovationLatam/Integracoes/opensquad-innovation_latam/news-frontend/functions/api/logs/[[path]].js"
import { onRequestGet as __api_status___path___js_onRequestGet } from "/home/anderson/Documentos/InnovationLatam/Integracoes/opensquad-innovation_latam/news-frontend/functions/api/status/[[path]].js"
import { onRequestGet as __api_debug_js_onRequestGet } from "/home/anderson/Documentos/InnovationLatam/Integracoes/opensquad-innovation_latam/news-frontend/functions/api/debug.js"
import { onRequestOptions as __api_generate_js_onRequestOptions } from "/home/anderson/Documentos/InnovationLatam/Integracoes/opensquad-innovation_latam/news-frontend/functions/api/generate.js"
import { onRequestPost as __api_generate_js_onRequestPost } from "/home/anderson/Documentos/InnovationLatam/Integracoes/opensquad-innovation_latam/news-frontend/functions/api/generate.js"

export const routes = [
    {
      routePath: "/api/logs/:path*",
      mountPath: "/api/logs",
      method: "GET",
      middlewares: [],
      modules: [__api_logs___path___js_onRequestGet],
    },
  {
      routePath: "/api/status/:path*",
      mountPath: "/api/status",
      method: "GET",
      middlewares: [],
      modules: [__api_status___path___js_onRequestGet],
    },
  {
      routePath: "/api/debug",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_debug_js_onRequestGet],
    },
  {
      routePath: "/api/generate",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_generate_js_onRequestOptions],
    },
  {
      routePath: "/api/generate",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_generate_js_onRequestPost],
    },
  ]