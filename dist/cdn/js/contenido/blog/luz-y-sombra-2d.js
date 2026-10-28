const e={slug:"luz-y-sombra-2d",titulo:"Luz y sombra en 2D",subtitulo:"Una gu\xEDa narrada para crear visibilidad y sombras din\xE1micas en tus juegos, paso a paso y con demos que puedes tocar.",resumen:"Construimos desde cero el cl\xE1sico efecto de luz que proyecta sombras sobre una escena 2D: rayos, intersecciones, el pol\xEDgono de visi\xF3n, sombras suaves y varias luces. Cada paso trae su narraci\xF3n y su demo interactiva.",fecha:"2026-10-27",etiquetas:["Gu\xEDa narrada","Canvas 2D","Geometr\xEDa","Videojuegos","TypeScript"],portada:{src:"assets/blog/luz-y-sombra/portada.png",alt:"Escena 2D iluminada por dos luces que proyectan sombras"},creditos:"Esta gu\xEDa reinterpreta en espa\xF1ol \xABSight & Light\xBB de Nicky Case (ncase.me/sight-and-light), de quien tom\xE9 la idea, la escena y las im\xE1genes de fondo y frente. El texto, la narraci\xF3n, el c\xF3digo y los componentes son propios y est\xE1n hechos con web components sobre el kit iswc.",pasos:[{titulo:"Bienvenida",icono:"mdi:hand-wave-outline",narracion:"Hola, soy Jeff. En esta gu\xEDa vamos a construir juntos un efecto que seguro has visto en muchos juegos 2D: una luz que ilumina la escena y proyecta sombras detr\xE1s de los obst\xE1culos. Mueve el cursor sobre la demo para ver a d\xF3nde vamos a llegar. Cuando quieras, pasa al siguiente paso.",bloques:[{tipo:"md",md:`Este efecto se usa en juegos de sigilo, en mazmorras con niebla de guerra y en cualquier juego donde **lo que ve el personaje** importa. No necesitas un motor gr\xE1fico: con **un poco de geometr\xEDa** y el **canvas 2D** del navegador es suficiente.

Lo construimos en **diez pasos**, cometiendo a prop\xF3sito los mismos errores que uno comete la primera vez, para entender por qu\xE9 la soluci\xF3n final funciona.`}],demo:{demo:"luz",paso:8,leyenda:"El resultado final: dos luces que siguen al cursor y proyectan sombras suaves."}},{titulo:"La escena",icono:"mdi:vector-polygon",narracion:"Todo empieza por describir el mundo. Nuestra escena es un rect\xE1ngulo con seis obst\xE1culos, y cada pared es un segmento: un punto de inicio y un punto final. Los bordes tambi\xE9n son segmentos, porque la luz tiene que chocar contra algo.",bloques:[{tipo:"md",md:"La escena mide **840 \xD7 360** p\xEDxeles. Cada pared es un **segmento** con un punto `a` y un punto `b`; un pol\xEDgono se convierte en sus segmentos uniendo cada v\xE9rtice con el siguiente."},{tipo:"codigo",lenguaje:"typescript",titulo:"luz.ts \xB7 la escena",codigo:`type Punto = { x: number; y: number };
type Segmento = { a: Punto; b: Punto };

// Un pol\xEDgono cerrado se convierte en sus segmentos: cada v\xE9rtice con el siguiente.
function poligono(vertices: Punto[]): Segmento[] {
  return vertices.map((a, i) => ({ a, b: vertices[(i + 1) % vertices.length] }));
}

const ESCENA: Segmento[] = [
  ...poligono([{ x: 0, y: 0 }, { x: 840, y: 0 }, { x: 840, y: 360 }, { x: 0, y: 360 }]), // borde
  ...poligono([{ x: 100, y: 150 }, { x: 120, y: 50 }, { x: 200, y: 80 }, { x: 140, y: 210 }]),
  // \u2026y los dem\xE1s obst\xE1culos
];`}],demo:{demo:"luz",paso:0,leyenda:"Los segmentos de las paredes y un punto que sigue al cursor."}},{titulo:"Un rayo",icono:"mdi:ray-start-arrow",narracion:"La idea central es lanzar rayos desde la luz y averiguar d\xF3nde chocan con las paredes. Empecemos con uno solo. El rayo y el segmento se escriben como un punto m\xE1s una direcci\xF3n, y el producto cruz nos dice d\xF3nde se cruzan, o si son paralelos. Nos quedamos con el choque m\xE1s cercano.",bloques:[{tipo:"md",md:"Cualquier recta se puede escribir en **forma param\xE9trica**: un punto de partida m\xE1s una direcci\xF3n multiplicada por un n\xFAmero.\n\n- El **rayo** es `origen + direcci\xF3n \xB7 t`, con `t \u2265 0` (solo hacia adelante).\n- El **segmento** es `a + (b \u2212 a) \xB7 u`, con `0 \u2264 u \u2264 1` (solo entre sus extremos).\n\nPara resolver el sistema usamos el **producto cruz** en 2D, `cruz(p, q) = p.x \xB7 q.y \u2212 p.y \xB7 q.x`, que adem\xE1s avisa cuando las rectas son **paralelas**."},{tipo:"codigo",lenguaje:"typescript",titulo:"luz.ts \xB7 intersecci\xF3n de un rayo con un segmento",codigo:`function interseccion(rayo: Segmento, seg: Segmento) {
  const r = { x: rayo.b.x - rayo.a.x, y: rayo.b.y - rayo.a.y }; // direcci\xF3n del rayo
  const s = { x: seg.b.x - seg.a.x, y: seg.b.y - seg.a.y };     // direcci\xF3n del segmento
  const den = r.x * s.y - r.y * s.x;                           // cruz(r, s)
  if (Math.abs(den) < 1e-12) return null;                      // paralelos

  const q = { x: seg.a.x - rayo.a.x, y: seg.a.y - rayo.a.y };
  const t = (q.x * s.y - q.y * s.x) / den; // distancia a lo largo del rayo
  const u = (q.x * r.y - q.y * r.x) / den; // posici\xF3n sobre el segmento

  if (t < 0 || u < 0 || u > 1) return null; // detr\xE1s del rayo o fuera del segmento
  return { x: rayo.a.x + r.x * t, y: rayo.a.y + r.y * t, t };
}`},{tipo:"md",md:"Probamos el rayo contra **todos** los segmentos y nos quedamos con el de **menor `t`**: el m\xE1s cercano. Lo que hay detr\xE1s queda en sombra."}],demo:{demo:"luz",paso:1,leyenda:"Un rayo desde el centro hacia el cursor: se detiene en la primera pared."}},{titulo:"Rayos en todas direcciones",icono:"mdi:white-balance-sunny",narracion:"Una luz no ilumina en una sola direcci\xF3n. Lo m\xE1s intuitivo es lanzar muchos rayos repartidos en c\xEDrculo, por ejemplo cincuenta, y guardar el choque m\xE1s cercano de cada uno. Mira c\xF3mo se ven en la demo.",bloques:[{tipo:"codigo",lenguaje:"typescript",titulo:"Cincuenta rayos alrededor de la luz",codigo:`const choques = [];
for (let k = 0; k < 50; k++) {
  const angulo = (k / 50) * Math.PI * 2;
  const rayo = { a: luz, b: { x: luz.x + Math.cos(angulo), y: luz.y + Math.sin(angulo) } };
  const choque = masCercano(rayo); // el de menor t entre todos los segmentos
  if (choque) choques.push(choque);
}`}],demo:{demo:"luz",paso:2,leyenda:"Cincuenta rayos uniformes desde el cursor."}},{titulo:"El primer pol\xEDgono (y su error)",icono:"mdi:alert-outline",narracion:"Si unimos los choques en orden, obtenemos la zona iluminada. Pero f\xEDjate en las esquinas: el pol\xEDgono las corta o las atraviesa. Subir a miles de rayos solo esconde el problema. La clave es que la sombra solo cambia en los v\xE9rtices de los obst\xE1culos.",bloques:[{tipo:"md",md:"Con 50 rayos nunca acertamos justo en los v\xE9rtices, y subir a 500 o 5000 rayos solo esconde el problema mientras el rendimiento se desploma."},{tipo:"nota",tono:"warning",titulo:"La clave del efecto",md:"La forma de la sombra solo cambia **en los v\xE9rtices** de los obst\xE1culos. Entre dos v\xE9rtices la luz recorre la pared en l\xEDnea recta. No necesitamos miles de rayos: necesitamos **un rayo por v\xE9rtice**."}],demo:{demo:"luz",paso:3,leyenda:"El pol\xEDgono con 50 rayos: mira c\xF3mo se come las esquinas."}},{titulo:"Rayos hacia cada v\xE9rtice",icono:"mdi:vector-point",narracion:"Ahora lanzamos un rayo hacia cada v\xE9rtice de la escena. Hay una trampa: cuando el rayo roza una esquina, la luz puede seguir de largo. Por eso lanzamos dos rayos extra, desviados un \xE1ngulo diminuto a cada lado. Uno choca con la esquina y el otro sigue hasta el fondo.",bloques:[{tipo:"codigo",lenguaje:"typescript",titulo:"Tres rayos por v\xE9rtice",codigo:`const DESVIO = 0.00001;

const angulos = vertices(ESCENA).flatMap((p) => {
  const a = Math.atan2(p.y - luz.y, p.x - luz.x);
  return [a - DESVIO, a, a + DESVIO];
});`}],demo:{demo:"luz",paso:4,leyenda:"Un rayo a cada v\xE9rtice y dos m\xE1s rozando sus lados."}},{titulo:"El pol\xEDgono de visi\xF3n",icono:"mdi:eye-outline",narracion:"Los choques ya son exactos, pero llegan desordenados. Los ordenamos por \xE1ngulo alrededor de la luz y los unimos en ese orden. El resultado es el pol\xEDgono de visi\xF3n: todo lo que la luz alcanza, con las esquinas perfectas y apenas unas decenas de rayos.",bloques:[{tipo:"codigo",lenguaje:"typescript",titulo:"luz.ts \xB7 pol\xEDgono de visi\xF3n",codigo:`function poligonoVision(luz: Punto): Choque[] {
  const choques = [];
  for (const angulo of angulos) {
    const choque = masCercano(rayoAngulo(luz, angulo));
    if (choque) choques.push({ ...choque, angulo });
  }
  return choques.sort((p, q) => p.angulo - q.angulo); // en orden alrededor de la luz
}

// Dibujarlo es recorrer los puntos y rellenar.
ctx.beginPath();
ctx.moveTo(poli[0].x, poli[0].y);
for (const p of poli.slice(1)) ctx.lineTo(p.x, p.y);
ctx.fill();`}],demo:{demo:"luz",paso:5,leyenda:"El pol\xEDgono de visi\xF3n correcto, con unas pocas decenas de rayos."}},{titulo:"Sombras suaves",icono:"mdi:blur",narracion:"Las sombras reales no tienen bordes perfectos, porque las luces tienen tama\xF1o. Un truco barato y muy efectivo es dibujar la luz principal y diez luces m\xE1s a su alrededor, casi transparentes. Donde se superponen, la luz se suma, y en los bordes aparece la penumbra.",bloques:[{tipo:"codigo",lenguaje:"typescript",titulo:"Luz difusa: la principal y diez a su alrededor",codigo:`const radio = 10;
for (let k = 0; k < 10; k++) {
  const a = (k / 10) * Math.PI * 2;
  const otra = { x: luz.x + Math.cos(a) * radio, y: luz.y + Math.sin(a) * radio };
  ctx.globalAlpha = 0.2;
  rellenar(poligonoVision(otra));
}
ctx.globalAlpha = 1;
rellenar(poligonoVision(luz));`}],demo:{demo:"luz",paso:6,leyenda:"Once pol\xEDgonos superpuestos forman la penumbra."}},{titulo:"Del pol\xEDgono a la escena",icono:"mdi:image-filter-hdr",narracion:"La luz blanca todav\xEDa parece un diagrama. Para que se vea como un juego usamos dos im\xE1genes: un fondo en penumbra y un frente iluminado. El pol\xEDgono de luz funciona como m\xE1scara, y el frente solo se pinta donde ya hab\xEDa luz.",bloques:[{tipo:"md",md:"Con `globalCompositeOperation = 'source-in'`, al dibujar el frente solo se pinta donde ya hab\xEDa p\xEDxeles de luz. El fondo queda debajo, como el fondo del lienzo."},{tipo:"codigo",lenguaje:"typescript",titulo:"La luz como m\xE1scara del frente",codigo:`dibujarLuz(ctx, luz);                         // pol\xEDgonos blancos
ctx.globalCompositeOperation = 'source-in';  // lo siguiente solo donde ya hay p\xEDxeles
ctx.drawImage(frente, 0, 0);
ctx.globalCompositeOperation = 'source-over'; // volver al modo normal`}],demo:{demo:"luz",paso:7,leyenda:"El frente iluminado aparece solo dentro de la zona de luz."}},{titulo:"M\xE1s de una luz",icono:"mdi:lightbulb-group-outline",narracion:"Como cada luz es solo un conjunto de pol\xEDgonos, agregar luces es repetir el dibujo antes de aplicar la m\xE1scara. En la demo hay dos, una a cada lado, que se mueven en sentidos opuestos con el cursor. F\xEDjate c\xF3mo las sombras se cruzan y se suman.",bloques:[{tipo:"nota",tono:"info",titulo:"Rendimiento",md:"Cada pol\xEDgono lanza **3 rayos por v\xE9rtice** y prueba cada rayo contra **todos los segmentos**: unas 3\xB7V\xB7S pruebas. Para escenas peque\xF1as sobra; en mapas grandes conviene filtrar los segmentos cercanos (una cuadr\xEDcula o un \xE1rbol espacial) y limitar el alcance de cada luz."}],demo:{demo:"luz",paso:8,leyenda:"Dos luces sobre la misma escena: las sombras se cruzan y se suman."}},{titulo:"Para terminar",icono:"mdi:flag-checkered",narracion:"Y listo. Con una funci\xF3n de intersecci\xF3n, un rayo por v\xE9rtice y ordenar por \xE1ngulo tienes el n\xFAcleo de cualquier sistema de visibilidad 2D. Desde aqu\xED puedes hacer una linterna, decidir qu\xE9 enemigos ve el jugador o mezclar luces de colores. Si lo llevas a tu juego, cu\xE9ntame c\xF3mo te fue. Gracias por acompa\xF1arme.",bloques:[{tipo:"md",md:`- **Linterna:** filtra los \xE1ngulos dentro de un cono.
- **Sigilo:** usa el pol\xEDgono para decidir **qu\xE9 enemigos ve el jugador**.
- **Ambiente:** combina varias luces de colores.

Las demos son un web component del portafolio, \`<ja-luz-demo>\`, que recibe el paso como propiedad y solo anima mientras est\xE1 a la vista.`}],demo:{demo:"luz",paso:8,leyenda:"Juega con la escena final cuanto quieras."}}]};export{e as luzYSombra2d};
