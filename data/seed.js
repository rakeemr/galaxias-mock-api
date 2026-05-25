const { faker } = require("@faker-js/faker");

const TIPOS_GALAXIA = ["espiral", "eliptica", "irregular", "lenticular"];
const TIPOS_RUTA = ["hiperespacio", "subespacio", "wormhole", "convencional"];

// ── Galaxias (nodos) ──────────────────────────────────────────────────
function generarGalaxias(n = 12) {
  const galaxias = [];
  const codigosUsados = new Set(); // validar datos repetidos

  for (let i = 1; i <= n; i++) {
    let codigo;
    do {
      codigo = "GAL-" + faker.string.alphanumeric(6).toUpperCase();
    } while (codigosUsados.has(codigo));
    codigosUsados.add(codigo);

    galaxias.push({
      id: `galaxia-${i}`,
      codigo,
      nombre: faker.science.chemicalElement().name + " Galaxy",
      tipo: faker.helpers.arrayElement(TIPOS_GALAXIA),
      x: parseFloat(faker.number.float({ min: -500, max: 500 }).toFixed(2)),
      y: parseFloat(faker.number.float({ min: -500, max: 500 }).toFixed(2)),
      z: parseFloat(faker.number.float({ min: -500, max: 500 }).toFixed(2)),
      descripcion: faker.lorem.sentence(),
    });
  }
  return galaxias;
}

// ── Rutas (aristas ponderadas) ────────────────────────────────────────
function generarRutas(galaxias, minPorNodo = 2) {
  const rutas = [];
  const rutasUsadas = new Set(); // evitar duplicados

  galaxias.forEach((origen, i) => {
    // Cada galaxia tiene al menos minPorNodo conexiones salientes
    const candidatos = galaxias.filter((_, j) => j !== i);
    const destinos = faker.helpers.arrayElements(candidatos, minPorNodo);

    destinos.forEach((destino) => {
      const clave = [origen.id, destino.id].sort().join("|");
      if (rutasUsadas.has(clave)) return;
      rutasUsadas.add(clave);

      // Peso basado en distancia euclidiana más ruido
      const dist = Math.sqrt(
        Math.pow(origen.x - destino.x, 2) +
          Math.pow(origen.y - destino.y, 2) +
          Math.pow(origen.z - destino.z, 2)
      );

      rutas.push({
        id: `ruta-${rutas.length + 1}`,
        origen_id: origen.id,
        destino_id: destino.id,
        tipo: faker.helpers.arrayElement(TIPOS_RUTA),
        costo: parseFloat(
          (dist * faker.number.float({ min: 0.8, max: 1.5 })).toFixed(2)
        ),
        tiempo_dias: parseFloat(
          (dist / faker.number.float({ min: 50, max: 200 })).toFixed(2)
        ),
        activa: faker.datatype.boolean({ probability: 0.9 }),
      });
    });
  });

  return rutas;
}

// ── Naves ─────────────────────────────────────────────────────────────
function generarNaves(n = 10) {
  const codigos = new Set();
  return Array.from({ length: n }, (_, i) => {
    let codigo;
    do {
      codigo = "NV-" + faker.string.alphanumeric(5).toUpperCase();
    } while (codigos.has(codigo));
    codigos.add(codigo);

    return {
      id: `nave-${i + 1}`,
      codigo,
      nombre:
        faker.vehicle.vehicle() +
        " " +
        faker.number.int({ min: 1, max: 9 }) +
        faker.string.alpha(1).toUpperCase(),
      capacidad: faker.number.int({ min: 10, max: 500 }),
      velocidad_max: faker.number.int({ min: 1000, max: 50000 }),
      activa: true,
    };
  });
}

// ── Historial de viajes ───────────────────────────────────────────────
function generarHistorial(naves, rutas, n = 20) {
  return Array.from({ length: n }, (_, i) => {
    const nave = faker.helpers.arrayElement(naves);
    const ruta = faker.helpers.arrayElement(rutas);

    return {
      id: `viaje-${i + 1}`,
      nave_id: nave.id,
      ruta_id: ruta.id,
      fecha: faker.date.past({ years: 2 }).toISOString().split("T")[0],
      costo_real: parseFloat(
        (ruta.costo * faker.number.float({ min: 0.9, max: 1.3 })).toFixed(2)
      ),
      exitoso: faker.datatype.boolean({ probability: 0.85 }),
    };
  });
}

// ── Seed principal ────────────────────────────────────────────────────
function generarSeed() {
  const galaxias = generarGalaxias(12);
  const rutas = generarRutas(galaxias, 2);
  const naves = generarNaves(10);
  const historial = generarHistorial(naves, rutas, 25);
  return { galaxias, rutas, naves, historial };
}

module.exports = generarSeed;
