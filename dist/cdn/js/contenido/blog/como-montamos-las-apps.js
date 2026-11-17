const e={slug:"como-montamos-las-apps",titulo:"C\xF3mo montamos las apps",subtitulo:"El stack completo, de la base de datos al bot\xF3n: web components sin framework, un Worker que decide y un VPS que guarda.",resumen:"El recorrido de principio a fin para montar una app con mi stack: front vanilla con web components en GitHub Pages, API en Deno con DER sobre Cloudflare Workers, datos en SQLite en un VPS propio por un t\xFAnel privado, y agentes de IA que solo hacen lo que se les permite. El ejemplo es CoContable, un software contable para Colombia.",fecha:"2026-11-17",etiquetas:["Arquitectura","Web Components","Deno","Cloudflare Workers","SQLite","Zero Trust","Agentes de IA"],portada:{src:"assets/blog/como-montamos-las-apps/portada.svg",alt:"CoContable: un coco contador, la app de ejemplo del stack"},voz:!1,creditos:"La versi\xF3n para agentes de esta gu\xEDa es la skill stack-apps, en la carpeta skills de mi repositorio. La app de ejemplo est\xE1 en vivo en jeff-aporta.github.io/front-cocontable.",pasos:[{titulo:"El mapa",icono:"mdi:map-outline",narracion:"Antes de escribir una l\xEDnea, este es el mapa. El navegador carga la app desde GitHub Pages. La app le habla a un Worker de Cloudflare, que es quien decide. Y el Worker guarda los datos en un servidor propio, por una red privada.",bloques:[{tipo:"md",md:`Todas las apps que monto tienen las mismas tres piezas, y cada una hace **una sola cosa**:

- **El front muestra.** Web components sin framework, publicados como archivos est\xE1ticos.
- **El Worker decide.** Sesi\xF3n, permisos y reglas del negocio.
- **El VPS guarda.** Archivos SQLite detr\xE1s de un t\xFAnel privado.

Lo que cambia entre una app y otra es el modelo de datos y las pantallas. El esqueleto es siempre este.`},{tipo:"codigo",lenguaje:"html",titulo:"Las tres piezas",codigo:`<!-- Navegador \u2500\u2500\u25B6 GitHub Pages        front-cocontable   (repo p\xFAblico)  -->
<!--     \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u25B6 Cloudflare Worker   api-cocontable     (repo privado)  -->
<!--                  \u2514\u2500 red privada + firma \u2500\u25B6 VPS propio \u2500\u25B6 SQLite      -->`}],demo:null},{titulo:"El modelo va primero",icono:"mdi:database-outline",narracion:"Lo primero no es la pantalla: es el modelo de datos. Lo defino una sola vez, en un archivo, y de ah\xED salen las tablas, la validaci\xF3n y las rutas del API.",bloques:[{tipo:"md",md:`Uso **DER**, una librer\xEDa propia: un esquema en JSON se convierte en la tabla, en el validador y en el CRUD por REST. Se consume por CDN, fijada a un commit; no hay \`npm install\`.

Cada entidad es de una de dos clases:

- **Cat\xE1logo** (terceros, productos, plan de cuentas): se administra con el CRUD que DER publica solo.
- **Libro** (comprobantes, facturas, kardex, cartera): **solo lo escribe un flujo**, porque cada alta mueve varias tablas a la vez y todo asiento tiene que cuadrar.`},{tipo:"codigo",lenguaje:"typescript",titulo:"Una entidad",codigo:`export const CuentaEntity = defineEntity({
  schema: defineSchema({
    columns: {
      codigo: { type: "string", pk: true, length: 20 },
      nombre: { type: "string", length: 160, nullable: false },
      naturaleza: { type: "string", length: 1, enum: ["D", "C"] },
      auxiliar: { type: "bool", default: true },
    },
  }),
  singular: "cuenta",
  plural: "cuentas",
  table: "cuentas",
});`},{tipo:"nota",tono:"info",titulo:"El diagrama sale del c\xF3digo",md:"El documento del modelo entidad-relaci\xF3n no se escribe a mano: un script recorre las entidades y lo genera. As\xED nunca queda viejo."}],demo:null},{titulo:"El Worker decide, el VPS guarda",icono:"mdi:server-network",narracion:"El API corre en un Worker de Cloudflare, pero los datos no viven en Cloudflare. Viven en SQLite, en un servidor m\xEDo. La raz\xF3n es simple: contabilidad necesita transacciones de verdad y muchas escrituras.",bloques:[{tipo:"md",md:`La base de Cloudflare, D1, limita las filas que se escriben y no tiene transacciones interactivas. Una factura toca el documento, sus renglones, el inventario, la cartera y el asiento contable: **o entra todo o no entra nada**.

Por eso le agregu\xE9 a DER un motor nuevo: el mismo c\xF3digo de siempre, pero cada consulta viaja **firmada** del Worker a un proceso peque\xF1o del VPS, que es el \xFAnico que toca los archivos.`},{tipo:"codigo",lenguaje:"typescript",titulo:"Los dos extremos",codigo:`// En el Worker (sin disco)
const db = sqliteHttpDatabase({
  endpoint: "http://127.0.0.1:8098/sql",
  db: "central",
  secreto: env.DB_SECRETO,
  fetch: (url, init) => env.VPS.fetch(url, init), // red privada
});

// En el VPS (junto a los archivos)
const host = sqliteHttpHost({ dir: "/var/lib/cocontable/db", secreto });
Deno.serve({ hostname: "127.0.0.1", port: 8098 }, host.fetch);`},{tipo:"nota",tono:"warning",titulo:"Cada consulta es un viaje",md:"Un Worker gratuito admite 50 subpeticiones por invocaci\xF3n. Los flujos cargan los cat\xE1logos en bloque e insertan en lote; una prueba falla si una venta pasa de 45 viajes."}],demo:null},{titulo:"Zero Trust: la red",icono:"mdi:shield-lock-outline",narracion:"El servidor no abre ning\xFAn puerto para esto. El Worker llega a \xE9l por un t\xFAnel con nombre y un servicio privado de Cloudflare. Desde internet no hay nada que atacar.",bloques:[{tipo:"md",md:`Tres capas, de afuera hacia adentro:

1. **Workers VPC**: el Worker se enlaza a un t\xFAnel de Cloudflare. No hay dominio ni direcci\xF3n p\xFAblica.
2. **Solo \`127.0.0.1\`**: el proceso del VPS no escucha en la red.
3. **Firma HMAC**: cada petici\xF3n lleva una firma que vence a los 60 segundos. Sin el secreto compartido, no se ejecuta nada.

Los secretos viven en el Worker, en una carpeta protegida del VPS y en un archivo fuera de todo repositorio. Nunca en el c\xF3digo.`}],demo:null},{titulo:"Zero Trust: los agentes de IA",icono:"mdi:robot-outline",narracion:"Un agente de inteligencia artificial no es un usuario. Es una credencial con una lista cerrada de lo que puede hacer. Si no est\xE1 en la lista, la respuesta es no.",bloques:[{tipo:"md",md:`Cada agente se crea para **una** empresa, con:

- la lista de **herramientas** que puede usar (consultar un informe, cotizar, registrar una compra\u2026),
- un **tope de monto** por operaci\xF3n y una **fecha de vencimiento**,
- y, si se quiere, **aprobaci\xF3n humana**: la acci\xF3n queda pendiente y no se ejecuta hasta que una persona la aprueba.

Todo lo que el agente intenta \u2014permitido, negado o pendiente\u2014 queda en una bit\xE1cora con sus argumentos. El token se muestra una sola vez; en la base solo vive su huella.`},{tipo:"codigo",lenguaje:"json",titulo:"Lo que env\xEDa el agente",codigo:`{
  "herramienta": "ventas.cotizar",
  "argumentos": {
    "fecha": "2026-11-17",
    "tercero": "900123456",
    "renglones": [{ "producto": "COCO-001", "cantidad": 24 }]
  }
}`}],demo:null},{titulo:"El front, sin framework",icono:"mdi:puzzle-outline",narracion:"La interfaz no usa React ni ning\xFAn framework. Son web components de mi kit, cargados por CDN. Y casi todo se declara: un men\xFA y una lista de cat\xE1logos.",bloques:[{tipo:"md",md:`La app se crea con un comando y nace con registro de componentes, estilos, build y pruebas. Encima, dos archivos mandan:

- **\`menu.ts\`**: cada entrada del panel abre una pantalla.
- **\`catalogos.ts\`**: columnas de la tabla y campos de la ficha, por pesta\xF1as.

Agregar el cat\xE1logo de bodegas son diez l\xEDneas, sin escribir un componente. Las pantallas propias quedan para lo que tiene reglas: la factura, el comprobante, los informes.`},{tipo:"codigo",lenguaje:"typescript",titulo:"Una pantalla nueva es una l\xEDnea",codigo:`cat('bodegas', 'Bodegas', 'mdi:warehouse', 'Inventario'),
{ id: 'pos', titulo: 'Punto de venta', icono: 'mdi:cash-register',
  grupo: 'Ventas', tag: 'coco-factura', props: { clase: 'POS' } },`},{tipo:"nota",tono:"info",titulo:"Qui\xE9n calcula",md:"El total que ves mientras digitas una factura es una gu\xEDa. El valor definitivo, el inventario y el asiento los calcula el API al finalizar."}],demo:null},{titulo:"Publicar",icono:"mdi:rocket-launch-outline",narracion:"Publicar es hacer push. El front queda en GitHub Pages. El API pasa sus pruebas y se despliega solo. Y el servidor se actualiza con un comando.",bloques:[{tipo:"md",md:"- **Front** (repo p\xFAblico): push a `main` y GitHub Pages lo sirve.\n- **API** (repo privado): un workflow corre las pruebas, empaqueta el Worker, lo publica y hace una prueba de humo.\n- **VPS**: `git pull` y un script de instalaci\xF3n idempotente. Tiene su propia llave para hacer commit y push cuando hay que arreglar algo urgente, y una **bit\xE1cora** donde queda escrito qu\xE9 se arregl\xF3 y por qu\xE9.\n\nSi cambia el modelo, el orden es siempre: primero el VPS, luego el Worker, luego el front."}],demo:null},{titulo:"Que cualquiera pueda continuar",icono:"mdi:book-open-page-variant-outline",narracion:"La \xFAltima pieza no es c\xF3digo. Es que otra persona, o un agente, pueda abrir el proyecto y saber qu\xE9 hacer. Por eso todo queda escrito, y lo que se puede se genera del c\xF3digo.",bloques:[{tipo:"md",md:`Cada repo trae lo mismo:

- **\`AGENTS.md\`**: qu\xE9 es, d\xF3nde est\xE1 cada cosa y las reglas que no se rompen.
- **Una skill** con recetas: \xABagregar una entidad\xBB, \xABagregar un informe\xBB, paso a paso.
- **Documentaci\xF3n navegable**: arquitectura, modelo y rutas generados del c\xF3digo, operaci\xF3n y una **gu\xEDa de auditor\xEDa** que dice c\xF3mo se hace cada acci\xF3n y c\xF3mo comprobar que qued\xF3 bien.
- **Un handoff vivo**: qu\xE9 se pidi\xF3, qu\xE9 est\xE1 hecho, qu\xE9 falta y las trampas ya pagadas.

El resultado est\xE1 en vivo: [CoContable](https://jeff-aporta.github.io/front-cocontable/). Sin cuenta puedes recorrer la empresa de muestra.`}],demo:null}]};export{e as comoMontamosLasApps};
