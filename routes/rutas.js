const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // GET /rutas — todas las aristas del grafo
  router.get("/", (req, res) => {
    const { tipo, activa } = req.query;
    let resultado = db.rutas;

    if (tipo) resultado = resultado.filter((r) => r.tipo === tipo);
    if (activa !== undefined) {
      const flag = activa === "true";
      resultado = resultado.filter((r) => r.activa === flag);
    }

    res.json(resultado);
  });

  // GET /rutas/:id — una ruta por id
  router.get("/:id", (req, res) => {
    const ruta = db.rutas.find((r) => r.id === req.params.id);
    if (!ruta) {
      return res
        .status(404)
        .json({ error: `Ruta '${req.params.id}' no encontrada` });
    }

    // Incluye nombres de galaxias para facilitar el debug
    res.json({
      ...ruta,
      origen_nombre: db.galaxias.find((g) => g.id === ruta.origen_id)?.nombre,
      destino_nombre: db.galaxias.find((g) => g.id === ruta.destino_id)?.nombre,
    });
  });

  // GET /rutas/entre/:origenId/:destinoId — ruta directa entre dos galaxias
  // Útil para verificar si existe conexión antes de calcular ruta mínima
  router.get("/entre/:origenId/:destinoId", (req, res) => {
    const { origenId, destinoId } = req.params;

    const directas = db.rutas.filter(
      (r) =>
        (r.origen_id === origenId && r.destino_id === destinoId) ||
        (r.origen_id === destinoId && r.destino_id === origenId) // grafo no dirigido
    );

    if (directas.length === 0) {
      return res.status(404).json({
        error: "No existe ruta directa entre estas galaxias",
        origen_id: origenId,
        destino_id: destinoId,
      });
    }

    // Devuelve la de menor costo si hay varias
    const menorCosto = directas.sort((a, b) => a.costo - b.costo)[0];
    res.json(menorCosto);
  });

  return router;
};
