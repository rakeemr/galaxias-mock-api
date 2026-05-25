const express = require("express");
const generarSeed = require("./data/seed");

// Routers
const galaxiasRouter = require("./routes/galaxias");
const rutasRouter = require("./routes/rutas");
const navesRouter = require("./routes/naves");
const historialRouter = require("./routes/historial");
const grafoRouter = require("./routes/grafo");

const app = express();
const PORT = process.env.PORT || 3000;

// Genera los datos UNA sola vez al arrancar el servidor
// Todas las rutas comparten el mismo objeto db (datos consistentes)
const db = generarSeed();

app.use(express.json());

// CORS abierto para que C++ pueda consumir desde cualquier entorno
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  next();
});

// ── Registro de rutas ─────────────────────────────────────────────────
app.use("/galaxias", galaxiasRouter(db));
app.use("/rutas", rutasRouter(db));
app.use("/naves", navesRouter(db));
app.use("/historial", historialRouter(db));
app.use("/grafo", grafoRouter(db));

// ── Índice de endpoints disponibles ──────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    nombre: "Galaxias Mock API",
    version: "1.0.0",
    endpoints: {
      grafo:
        "GET /grafo                          → grafo completo (carga inicial C++)",
      kruskal:
        "GET /grafo/kruskal                  → aristas en orden aleatorio",
      adyacencia: "GET /grafo/adyacencia               → matriz de adyacencia",
      galaxias: "GET /galaxias                       → todos los nodos",
      galaxia: "GET /galaxias/:id                   → nodo por id",
      rutas: "GET /rutas                          → todas las aristas",
      ruta: "GET /rutas/:id                      → arista por id",
      naves: "GET /naves                          → todas las naves",
      nave: "GET /naves/:id                      → nave por id",
      historial_nave:
        "GET /naves/:id/historial            → historial de viajes por nave",
      historial: "GET /historial                      → todos los viajes",
      viaje: "GET /historial/:id                  → viaje por id",
    },
  });
});

app.listen(PORT, () => {
  console.log(`Galaxias Mock API corriendo en http://localhost:${PORT}`);
  console.log(
    `   Datos: ${db.galaxias.length} galaxias | ${db.rutas.length} rutas | ${db.naves.length} naves | ${db.historial.length} viajes\n`
  );
});
