const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // GET /grafo — grafo completo para carga inicial en C++
  // Este es el endpoint principal: tu programa C++ lo llama UNA vez al arrancar
  // y construye toda la estructura de datos en memoria
  router.get("/", (req, res) => {
    const aristasActivas = db.rutas.filter((r) => r.activa);

    res.json({
      meta: {
        total_nodos: db.galaxias.length,
        total_aristas: aristasActivas.length,
        es_dirigido: false,
        version: "1.0",
      },
      nodos: db.galaxias,
      aristas: aristasActivas,
    });
  });

  // GET /grafo/kruskal — aristas ordenadas para el algoritmo de Kruskal
  // Consulta requerida #3: "Mostrar árbol generado por Kruskal"
  // Devuelve las aristas en orden aleatorio tal como lo pide el Kruskal modificado
  router.get("/kruskal", (req, res) => {
    const aristasActivas = db.rutas.filter((r) => r.activa);

    // Orden aleatorio (requerimiento del Kruskal modificado del proyecto)
    const aristasAleatorias = [...aristasActivas].sort(
      () => Math.random() - 0.5
    );

    res.json({
      descripcion: "Aristas en orden aleatorio para Kruskal modificado",
      total_aristas: aristasAleatorias.length,
      total_nodos: db.galaxias.length,
      aristas: aristasAleatorias,
    });
  });

  // GET /grafo/adyacencia — matriz de adyacencia (costos)
  // Útil si decides usar representación matricial en C++
  router.get("/adyacencia", (req, res) => {
    const n = db.galaxias.length;
    const indices = {};
    db.galaxias.forEach((g, i) => {
      indices[g.id] = i;
    });

    // Inicializa con Infinity (sin conexión)
    const matriz = Array.from({ length: n }, () => Array(n).fill(null));

    db.rutas
      .filter((r) => r.activa)
      .forEach((r) => {
        const i = indices[r.origen_id];
        const j = indices[r.destino_id];
        if (i !== undefined && j !== undefined) {
          // Grafo no dirigido: llena ambas direcciones
          matriz[i][j] = r.costo;
          matriz[j][i] = r.costo;
        }
      });

    res.json({
      orden: n,
      nodos: db.galaxias.map((g, i) => ({
        indice: i,
        id: g.id,
        nombre: g.nombre,
      })),
      matriz,
    });
  });

  return router;
};
