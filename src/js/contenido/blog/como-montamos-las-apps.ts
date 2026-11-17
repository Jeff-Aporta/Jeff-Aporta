/**
 * como-montamos-las-apps.ts — el stack con el que monto una app de principio a fin, contado con CoContable como ejemplo.
 * Es la versión para leer de la skill `skills/stack-apps/SKILL.md` de este repo (la que usan los agentes).
 * Sin audio (`voz: false`): la narración queda escrita; grabarla con la voz clonada es un paso aparte.
 */
export const comoMontamosLasApps = {
  slug: 'como-montamos-las-apps',
  titulo: 'Cómo montamos las apps',
  subtitulo: 'El stack completo, de la base de datos al botón: web components sin framework, un Worker que decide y un VPS que guarda.',
  resumen: 'El recorrido de principio a fin para montar una app con mi stack: front vanilla con web components en GitHub Pages, API en Deno con DER sobre Cloudflare Workers, datos en SQLite en un VPS propio por un túnel privado, y agentes de IA que solo hacen lo que se les permite. El ejemplo es CoContable, un software contable para Colombia.',
  fecha: '2026-11-17',
  etiquetas: ['Arquitectura', 'Web Components', 'Deno', 'Cloudflare Workers', 'SQLite', 'Zero Trust', 'Agentes de IA'],
  portada: { src: 'assets/blog/como-montamos-las-apps/portada.svg', alt: 'CoContable: un coco contador, la app de ejemplo del stack' },
  voz: false,
  creditos: 'La versión para agentes de esta guía es la skill stack-apps, en la carpeta skills de mi repositorio. La app de ejemplo está en vivo en jeff-aporta.github.io/front-cocontable.',
  pasos: [
    {
      titulo: 'El mapa',
      icono: 'mdi:map-outline',
      narracion: 'Antes de escribir una línea, este es el mapa. El navegador carga la app desde GitHub Pages. La app le habla a un Worker de Cloudflare, que es quien decide. Y el Worker guarda los datos en un servidor propio, por una red privada.',
      bloques: [
        {
          tipo: 'md',
          md: `Todas las apps que monto tienen las mismas tres piezas, y cada una hace **una sola cosa**:

- **El front muestra.** Web components sin framework, publicados como archivos estáticos.
- **El Worker decide.** Sesión, permisos y reglas del negocio.
- **El VPS guarda.** Archivos SQLite detrás de un túnel privado.

Lo que cambia entre una app y otra es el modelo de datos y las pantallas. El esqueleto es siempre este.`,
        },
        {
          tipo: 'codigo',
          lenguaje: 'html',
          titulo: 'Las tres piezas',
          codigo: `<!-- Navegador ──▶ GitHub Pages        front-cocontable   (repo público)  -->
<!--     └──────▶ Cloudflare Worker   api-cocontable     (repo privado)  -->
<!--                  └─ red privada + firma ─▶ VPS propio ─▶ SQLite      -->`,
        },
      ],
      demo: null,
    },
    {
      titulo: 'El modelo va primero',
      icono: 'mdi:database-outline',
      narracion: 'Lo primero no es la pantalla: es el modelo de datos. Lo defino una sola vez, en un archivo, y de ahí salen las tablas, la validación y las rutas del API.',
      bloques: [
        {
          tipo: 'md',
          md: `Uso **DER**, una librería propia: un esquema en JSON se convierte en la tabla, en el validador y en el CRUD por REST. Se consume por CDN, fijada a un commit; no hay \`npm install\`.

Cada entidad es de una de dos clases:

- **Catálogo** (terceros, productos, plan de cuentas): se administra con el CRUD que DER publica solo.
- **Libro** (comprobantes, facturas, kardex, cartera): **solo lo escribe un flujo**, porque cada alta mueve varias tablas a la vez y todo asiento tiene que cuadrar.`,
        },
        {
          tipo: 'codigo',
          lenguaje: 'typescript',
          titulo: 'Una entidad',
          codigo: `export const CuentaEntity = defineEntity({
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
});`,
        },
        {
          tipo: 'nota',
          tono: 'info',
          titulo: 'El diagrama sale del código',
          md: 'El documento del modelo entidad-relación no se escribe a mano: un script recorre las entidades y lo genera. Así nunca queda viejo.',
        },
      ],
      demo: null,
    },
    {
      titulo: 'El Worker decide, el VPS guarda',
      icono: 'mdi:server-network',
      narracion: 'El API corre en un Worker de Cloudflare, pero los datos no viven en Cloudflare. Viven en SQLite, en un servidor mío. La razón es simple: contabilidad necesita transacciones de verdad y muchas escrituras.',
      bloques: [
        {
          tipo: 'md',
          md: `La base de Cloudflare, D1, limita las filas que se escriben y no tiene transacciones interactivas. Una factura toca el documento, sus renglones, el inventario, la cartera y el asiento contable: **o entra todo o no entra nada**.

Por eso le agregué a DER un motor nuevo: el mismo código de siempre, pero cada consulta viaja **firmada** del Worker a un proceso pequeño del VPS, que es el único que toca los archivos.`,
        },
        {
          tipo: 'codigo',
          lenguaje: 'typescript',
          titulo: 'Los dos extremos',
          codigo: `// En el Worker (sin disco)
const db = sqliteHttpDatabase({
  endpoint: "http://127.0.0.1:8098/sql",
  db: "central",
  secreto: env.DB_SECRETO,
  fetch: (url, init) => env.VPS.fetch(url, init), // red privada
});

// En el VPS (junto a los archivos)
const host = sqliteHttpHost({ dir: "/var/lib/cocontable/db", secreto });
Deno.serve({ hostname: "127.0.0.1", port: 8098 }, host.fetch);`,
        },
        {
          tipo: 'nota',
          tono: 'warning',
          titulo: 'Cada consulta es un viaje',
          md: 'Un Worker gratuito admite 50 subpeticiones por invocación. Los flujos cargan los catálogos en bloque e insertan en lote; una prueba falla si una venta pasa de 45 viajes.',
        },
      ],
      demo: null,
    },
    {
      titulo: 'Zero Trust: la red',
      icono: 'mdi:shield-lock-outline',
      narracion: 'El servidor no abre ningún puerto para esto. El Worker llega a él por un túnel con nombre y un servicio privado de Cloudflare. Desde internet no hay nada que atacar.',
      bloques: [
        {
          tipo: 'md',
          md: `Tres capas, de afuera hacia adentro:

1. **Workers VPC**: el Worker se enlaza a un túnel de Cloudflare. No hay dominio ni dirección pública.
2. **Solo \`127.0.0.1\`**: el proceso del VPS no escucha en la red.
3. **Firma HMAC**: cada petición lleva una firma que vence a los 60 segundos. Sin el secreto compartido, no se ejecuta nada.

Los secretos viven en el Worker, en una carpeta protegida del VPS y en un archivo fuera de todo repositorio. Nunca en el código.`,
        },
      ],
      demo: null,
    },
    {
      titulo: 'Zero Trust: los agentes de IA',
      icono: 'mdi:robot-outline',
      narracion: 'Un agente de inteligencia artificial no es un usuario. Es una credencial con una lista cerrada de lo que puede hacer. Si no está en la lista, la respuesta es no.',
      bloques: [
        {
          tipo: 'md',
          md: `Cada agente se crea para **una** empresa, con:

- la lista de **herramientas** que puede usar (consultar un informe, cotizar, registrar una compra…),
- un **tope de monto** por operación y una **fecha de vencimiento**,
- y, si se quiere, **aprobación humana**: la acción queda pendiente y no se ejecuta hasta que una persona la aprueba.

Todo lo que el agente intenta —permitido, negado o pendiente— queda en una bitácora con sus argumentos. El token se muestra una sola vez; en la base solo vive su huella.`,
        },
        {
          tipo: 'codigo',
          lenguaje: 'json',
          titulo: 'Lo que envía el agente',
          codigo: `{
  "herramienta": "ventas.cotizar",
  "argumentos": {
    "fecha": "2026-11-17",
    "tercero": "900123456",
    "renglones": [{ "producto": "COCO-001", "cantidad": 24 }]
  }
}`,
        },
      ],
      demo: null,
    },
    {
      titulo: 'El front, sin framework',
      icono: 'mdi:puzzle-outline',
      narracion: 'La interfaz no usa React ni ningún framework. Son web components de mi kit, cargados por CDN. Y casi todo se declara: un menú y una lista de catálogos.',
      bloques: [
        {
          tipo: 'md',
          md: `La app se crea con un comando y nace con registro de componentes, estilos, build y pruebas. Encima, dos archivos mandan:

- **\`menu.ts\`**: cada entrada del panel abre una pantalla.
- **\`catalogos.ts\`**: columnas de la tabla y campos de la ficha, por pestañas.

Agregar el catálogo de bodegas son diez líneas, sin escribir un componente. Las pantallas propias quedan para lo que tiene reglas: la factura, el comprobante, los informes.`,
        },
        {
          tipo: 'codigo',
          lenguaje: 'typescript',
          titulo: 'Una pantalla nueva es una línea',
          codigo: `cat('bodegas', 'Bodegas', 'mdi:warehouse', 'Inventario'),
{ id: 'pos', titulo: 'Punto de venta', icono: 'mdi:cash-register',
  grupo: 'Ventas', tag: 'coco-factura', props: { clase: 'POS' } },`,
        },
        {
          tipo: 'nota',
          tono: 'info',
          titulo: 'Quién calcula',
          md: 'El total que ves mientras digitas una factura es una guía. El valor definitivo, el inventario y el asiento los calcula el API al finalizar.',
        },
      ],
      demo: null,
    },
    {
      titulo: 'Publicar',
      icono: 'mdi:rocket-launch-outline',
      narracion: 'Publicar es hacer push. El front queda en GitHub Pages. El API pasa sus pruebas y se despliega solo. Y el servidor se actualiza con un comando.',
      bloques: [
        {
          tipo: 'md',
          md: `- **Front** (repo público): push a \`main\` y GitHub Pages lo sirve.
- **API** (repo privado): un workflow corre las pruebas, empaqueta el Worker, lo publica y hace una prueba de humo.
- **VPS**: \`git pull\` y un script de instalación idempotente. Tiene su propia llave para hacer commit y push cuando hay que arreglar algo urgente, y una **bitácora** donde queda escrito qué se arregló y por qué.

Si cambia el modelo, el orden es siempre: primero el VPS, luego el Worker, luego el front.`,
        },
      ],
      demo: null,
    },
    {
      titulo: 'Que cualquiera pueda continuar',
      icono: 'mdi:book-open-page-variant-outline',
      narracion: 'La última pieza no es código. Es que otra persona, o un agente, pueda abrir el proyecto y saber qué hacer. Por eso todo queda escrito, y lo que se puede se genera del código.',
      bloques: [
        {
          tipo: 'md',
          md: `Cada repo trae lo mismo:

- **\`AGENTS.md\`**: qué es, dónde está cada cosa y las reglas que no se rompen.
- **Una skill** con recetas: «agregar una entidad», «agregar un informe», paso a paso.
- **Documentación navegable**: arquitectura, modelo y rutas generados del código, operación y una **guía de auditoría** que dice cómo se hace cada acción y cómo comprobar que quedó bien.
- **Un handoff vivo**: qué se pidió, qué está hecho, qué falta y las trampas ya pagadas.

El resultado está en vivo: [CoContable](https://jeff-aporta.github.io/front-cocontable/). Sin cuenta puedes recorrer la empresa de muestra.`,
        },
      ],
      demo: null,
    },
  ],
};
