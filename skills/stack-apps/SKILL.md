---
name: stack-apps
description: >-
  El stack de la casa para montar una app de principio a fin: front vanilla con web components iswc-base en GitHub
  Pages, API en Deno + DER sobre Cloudflare Workers, datos en SQLite en el VPS propio por túnel privado (Workers VPC) y
  firma HMAC, agentes de IA con Zero Trust, repos con workflows, VPS con llave de despliegue y bitácora, documentación
  con el visor del kit y handoff vivo. Usar SIEMPRE al fundar una app nueva, al decidir dónde va una pieza, al desplegar,
  o al retomar un proyecto montado con este stack (CoContable es la referencia).
---

# stack-apps — cómo montamos una app de principio a fin

Referencia viva: **CoContable** (`D:\VPS\projs\cocontable\`): `api-cocontable` (privado) y `front-cocontable` (público). Cuando esta skill y un repo se contradigan, gana el `AGENTS.md` del repo; cuando falte algo aquí, complétalo en el mismo cambio.

## 1. El mapa

```
Navegador ──HTTPS──▶ GitHub Pages            front-<app>   (público)  web components iswc-base por CDN
    │
    └──HTTPS──▶ Cloudflare Worker            api-<app>     (privado)  Deno + DER: sesión, permisos, reglas, agentes
                    │  binding Workers VPC (red privada, sin hostname público) + firma HMAC
                    ▼
               VPS propio                     anfitrion.ts  127.0.0.1:<puerto>  →  SQLite (una base central + una por inquilino)
```

| Capa | Tecnología | Repo | Se publica |
|---|---|---|---|
| Kit de interfaz | `iswc-base` (web components vanilla) | `Jeff-Aporta/is-webcomponents` | CDN jsDelivr, fijado a SHA |
| Modelo y API | `DER` (schemas → Zod → controllers REST + plugins) | `Jeff-Aporta/DER` | CDN jsDelivr, fijado a SHA |
| Front de la app | Deno + `create-iswc-app` | `front-<app>` público | GitHub Pages desde `main` |
| API de la app | Deno + DER, empaquetado con `deno bundle` | `api-<app>` privado | Cloudflare Workers por workflow |
| Datos | SQLite (`node:sqlite`) en el VPS | (mismo `api-<app>`: `anfitrion.ts`) | `git pull` + `deploy/instalar.sh` |

## 2. Las leyes

1. **Todo en Deno.** Librerías por CDN o `npm:`/`jsr:` en el import map; nunca `npm install` ni `package.json` de framework.
2. **Kit y DER solo por CDN con un SHA de 40 hex.** Nunca `@main`, `@latest` ni rutas locales entre repos.
3. **Front vanilla con `iswc-*`.** Cero React/Vue/Svelte/Tailwind. Toda pieza de UI es un componente; colores solo por tokens `--iswc-*`.
4. **El modelo se define una vez, en DER** (`defineSchema` / `defineEntity`). Las tablas las crea `seed()`; nada de DDL a mano.
5. **Sin autenticación propia.** Login, sesiones, usuarios y permisos son plugins de DER. Tiquetes, mensajes, calificaciones, reacciones, archivos y errores también: se montan, no se reescriben.
6. **El Worker decide; el VPS guarda.** El Worker no usa disco ni `node:`. El anfitrión no decide negocio.
7. **Los datos van en SQLite del VPS, no en D1**: D1 limita las filas escritas y no tiene transacciones interactivas.
8. **Zero Trust en dos frentes:** red (Workers VPC + túnel con nombre, sin puertos ni hostname públicos, más firma HMAC) e IA (cada agente es una credencial con lista cerrada de herramientas, tope, vencimiento, aprobación humana opcional y bitácora).
9. **Secretos solo por entorno:** `wrangler secret` en el Worker, `/etc/<app>/` (600) en el VPS y `D:/VPS/secrets.json` en el equipo. Nunca en un repo, un log o un mensaje de error.
10. **Gate en verde = hecho.** `deno task test:all` en cada repo. Rojo se arregla, nunca se salta.
11. **Front público, API privado.** Un push a `main` de cualquiera llega a producción.
12. **Todo queda escrito:** `AGENTS.md` + `CLAUDE.md` + `skills/<repo>/SKILL.md` en cada repo, `docs/` con el visor del kit y un `HANDOFF.md` vivo en el espacio de trabajo.

## 3. Fundar una app (orden obligatorio)

### 3.1 Espacio de trabajo

`D:\VPS\projs\<app>\` con `api-<app>\`, `front-<app>\`, `AGENTS.md` (mapa de la carpeta), `HANDOFF.md` y `tools\`. La carpeta no es un repo: agrupa los repos.

### 3.2 Modelo entidad-relación primero

- Dos archivos: `src/domain/central.ts` (usuarios, inquilinos, agentes) y `src/domain/<inquilino>.ts` (lo de cada empresa o cliente).
- Clasifica cada entidad: **catálogo** (CRUD de DER, `exposed: true`) o **libro** (solo lo escribe un flujo, `exposed: false`).
- Declara las relaciones lógicas en un arreglo `RELACIONES` y genera el documento ER desde el código (`scripts/er.ts`).
- Convenciones de columnas: `b…` sí/no, `j…` JSON, `fh…` fecha y hora, `i…` identificador de texto; dinero `decimal(18,2)`.

### 3.3 API (`api-<app>`)

```
worker.ts            entrada del Worker: arma la app con bases remotas (binding VPS)
anfitrion.ts         proceso del VPS: POST /sql (protocolo de DER) y POST /mantenimiento, ambos con HMAC
local.ts             todo en un proceso sobre archivos (desarrollo y base de las pruebas)
src/app.ts           buildApp({ central, abrir(nombre), mantenimiento, env }): router de DER + plugins + guarda
src/domain/          el modelo
src/flujos/          las reglas: cada escritura de varias tablas, dentro de una transacción
src/seguridad.ts     identidad + permisos de DER y la matriz rol → capacidades
src/agentes.ts       herramientas de agente (Zero Trust)
src/rutas.ts         rutas propias, una línea por ruta
src/mantenimiento.ts lo que necesita disco: implementación local (VPS) y por HTTP firmado (Worker)
tests/               caja negra por `fetch`; un archivo por escenario
deploy/              unidades systemd, instalar.sh, respaldo.sh
scripts/             worker.ts (bundle) · secretos.ts · humo.ts · er.ts · docs.ts
```

Piezas clave de DER (skill `der`, guía `servidor`):

```ts
// Worker (sin node:)
import { sqliteHttpDatabase } from "@Jeff-Aporta/DER/src/02-controllers/server/sqlite-http.ts";
const db = sqliteHttpDatabase({ endpoint: "http://127.0.0.1:8098/sql", db: "central", secreto: env.DB_SECRETO, fetch: (i, o) => env.VPS.fetch(i, o) });
// VPS
import { sqliteHttpHost } from "@Jeff-Aporta/DER/src/02-controllers/server/sqlite-http-host.ts";
const host = sqliteHttpHost({ dir: "/var/lib/app/db", secreto, permitir: (db) => NOMBRE.test(db) });
```

Reglas del API:

- **Cada sentencia es un viaje de red** y un Worker gratuito admite 50 subpeticiones por invocación: carga catálogos en bloque, inserta en lote, nunca consultes en un bucle. Mide los viajes de la operación más pesada en una prueba.
- **El Worker nunca crea tablas ni siembra**: lo hace el anfitrión al arrancar y por órdenes de mantenimiento.
- **Multi-inquilino:** cabecera `X-<Inquilino>`; la guarda del router resuelve inquilino y rol; cada escritura exige su capacidad.
- **CORS:** declara las cabeceras propias (`x-empresa`, `x-agente`) en `cors.headers` del router, y limita orígenes con una variable `ORIGENES`.
- **Pruebas:** DER guarda las puertas de seguridad en un registro global por proceso → un archivo de prueba por escenario (cada uno corre en su isolate). Incluye siempre una prueba de la **cadena completa** (app del Worker → firma → anfitrión) con `fetch` inyectado.

### 3.4 Infraestructura (una vez por app)

```bash
wrangler tunnel create <app>
wrangler vpc service create <app>-vps --type http --tunnel-id <id> --ipv4 127.0.0.1 --http-port <puerto>
# wrangler.toml:  [[vpc_services]]  binding = "VPS"  service_id = "<id del servicio>"
deno run -A scripts/secretos.ts generar   # crea los secretos en D:/VPS/secrets.json
deno run -A scripts/secretos.ts vps       # los deja en /etc/<app>/ del VPS, con el token del túnel
gh repo create Jeff-Aporta/api-<app> --private --source . --push
# VPS: llave de despliegue CON escritura, clonar en /opt/<app>/, bash deploy/instalar.sh
deno task deploy && deno run -A scripts/secretos.ts worker
deno run -A scripts/humo.ts               # prueba de humo con escritura contra producción
```

En el VPS: usuario de servicio sin privilegios, el anfitrión escuchando solo en `127.0.0.1`, `cloudflared` como servicio con el token en un archivo 600, respaldo diario con `sqlite3 .backup` y 14 días de retención.

### 3.5 Front (`front-<app>`)

```bash
deno run -A --reload=https://raw.githubusercontent.com/Jeff-Aporta/is-webcomponents/ \
  https://raw.githubusercontent.com/Jeff-Aporta/is-webcomponents/main/dist/cdn/skills/iswc-foundation/tools/create-iswc-app.mjs \
  front-<app> --prefijo=<p> --titulo="<Nombre>" --puerto=<n>
```

Sobre la plantilla (skill `iswc-foundation`):

- **Declarativo antes que componentes:** `core/menu.ts` (módulos → tag + props) y `core/catalogos.ts` (columnas y campos por pestaña). Un catálogo nuevo no escribe componentes.
- **Piezas reutilizables:** una tabla, una ficha (formulario en diálogo con pestañas) y una pantalla genérica de catálogo; las vistas propias solo para lo que tiene reglas (documentos con renglones, informes).
- **`core/api.ts`** es el único que llama `fetch`: token, inquilino activo, preferencias y un evento de ventana al cambiar la sesión.
- **Sin sesión hay una demo pública de solo lectura**; cada escritura invita a entrar.
- **Los valores definitivos los calcula el API**; lo que el front muestra al digitar es guía.
- **Apariencia:** paleta y tema por defecto en `<html data-palette data-theme>`; lo elegido se guarda en las preferencias del usuario y en `iswc:app-cfg` para que `boot.ts` lo aplique antes del primer pintado.
- Dos metas en `index.html`: la URL del API de producción y la del API local (la app en `127.0.0.1` usa la local).
- `dist/cdn/` se versiona: es lo que sirve Pages. Activar Pages: `gh api -X POST repos/<dueño>/<repo>/pages -f "source[branch]=main" -f "source[path]=/"`.

### 3.6 Documentación y contexto para agentes

| Archivo | Para qué |
|---|---|
| `AGENTS.md` | qué es el repo, mapa, leyes numeradas, comandos, despliegue, qué hacer con un reporte |
| `CLAUDE.md` | cinco líneas que apuntan a `AGENTS.md` y a la skill |
| `skills/<repo>/SKILL.md` | recetas: «agregar X» paso a paso con los archivos exactos |
| `docs/` | hojas `NNN-Tema/NNN-Hoja.md` con frontmatter `Titulo`, `Estado`, `Autor`, `tags`; `docs/index.html` con `<iswc-md-docs-vault>`; lo que se pueda, **generado del código** (modelo, rutas) |
| `docs/…/Guia-de-auditoria.md` | por cada acción: cómo se hace en la app, la llamada del API, qué queda escrito y cómo comprobarlo |
| `docs/…/Bitacora.md` | cada arreglo hecho desde el VPS: fecha, síntoma, causa, arreglo, commit |
| `HANDOFF.md` (espacio de trabajo) | requisitos, decisiones, hecho, pendiente paso a paso y trampas. Se actualiza al terminar cada paso |

Instalar las skills del kit y de DER en Claude: `deno run -A D:/VPS/projs/cocontable/tools/instalar-skills.ts`.

## 4. Agentes de IA con Zero Trust (patrón)

- Tabla de agentes en la base central: dueño, **un** inquilino, lista de herramientas, herramientas que exigen aprobación, tope de monto, vencimiento y la **huella** (SHA-256) del token. El token se muestra una sola vez.
- Tabla de bitácora: toda llamada con sus argumentos y su estado (permitida, denegada, pendiente, aprobada, rechazada, error).
- Catálogo `HERRAMIENTAS` en el API: nombre → `{ descripcion, escribe, monto?, ejecutar }`. El agente llama `POST /agente/ejecutar` con su token en una cabecera propia; **nunca** recibe un JWT de persona ni usa rutas de persona.
- Orden de las puertas: ¿existe y la tiene? → ¿supera el tope? → ¿exige aprobación? (queda pendiente y no se ejecuta) → ejecutar → anotar.
- Negar por defecto: una herramienta nueva no la tiene ningún agente hasta que una persona la marque.

## 5. Operar

| Tarea | Cómo |
|---|---|
| Desplegar el Worker | push a `main` (workflow: gate → bundle → `wrangler deploy` → humo) |
| Actualizar el VPS | `ssh … "cd /opt/<app>/api-<app> && git pull && bash deploy/instalar.sh"` (cuando cambian dominio, semilla, anfitrión o `deploy/`) |
| Orden si cambia el modelo | VPS → Worker → front |
| Arreglo urgente desde el VPS | reproducir con una prueba → arreglar → gate → commit y push → bitácora |
| Comprobar producción | `curl …/api/salud`, `deno run -A scripts/humo.ts`, `wrangler tunnel list` |

## 6. Trampas ya pagadas

| Trampa | Solución |
|---|---|
| CORS bloquea las cabeceras propias | declararlas en `cors.headers` del router |
| Dos apps de DER en un proceso se pisan las puertas de seguridad | un archivo de prueba por escenario |
| `wrangler tunnel create` no muestra el token | pedirlo a la API de Cloudflare con la sesión de wrangler y enviarlo directo al VPS (`scripts/secretos.ts vps`) |
| El VPS usa otra llave al hacer `git pull` | hay un `core.sshCommand` global: fijar uno **local** en el repo con su propia llave |
| El primer acceso tras un despliegue responde 503 | el front reintenta una vez las lecturas; nunca las escrituras |
| En la plantilla del kit, `attr=${texto con espacios}` se parte en varios atributos | `html` de `base/componente.ts` debe poner comillas |
| `deno task icons` a veces se cuelga | construir sin ese paso y reintentar luego |
| Heredocs y `node -e` con comillas mezcladas fallan en el shell | escribir un archivo `.mjs` y ejecutarlo |
| Crear una subcuenta vuelve a la cuenta padre no auxiliar | es la regla correcta; avisar en la guía de auditoría |
| APIs de pago (voz, imágenes) | nunca sin autorización escrita por cada uso |

## 7. Lista de entrega de una app

- [ ] Modelo en `src/domain/` y su documento ER generado.
- [ ] `deno task test:all` en verde en los dos repos, con la prueba de la cadena completa.
- [ ] Worker desplegado, túnel `healthy`, humo con escritura en verde.
- [ ] Front en Pages probado contra producción (demo sin sesión y un recorrido con cuenta).
- [ ] `AGENTS.md`, `CLAUDE.md`, `skills/` y `docs/` (con guía de auditoría) en cada repo.
- [ ] VPS: servicio sin privilegios, respaldo diario, llave con escritura y bitácora.
- [ ] `HANDOFF.md` al día: hecho, pendiente y trampas.
