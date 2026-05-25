const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // GET /historial — todos los viajes registrados
  router.get("/", (req, res) => {
    const { nave_id, exitoso } = req.query;
    let resultado = db.historial;

    if (nave_id) resultado = resultado.filter((h) => h.nave_id === nave_id);
    if (exitoso !== undefined) {
      resultado = resultado.filter((h) => h.exitoso === (exitoso === "true"));
    }

    // Enriquece con nombres para facilitar el consumo
    const detallado = resultado.map((v) => {
      const ruta = db.rutas.find((r) => r.id === v.ruta_id);
      const nave = db.naves.find((n) => n.id === v.nave_id);
      const origen = ruta
        ? db.galaxias.find((g) => g.id === ruta.origen_id)
        : null;
      const destino = ruta
        ? db.galaxias.find((g) => g.id === ruta.destino_id)
        : null;

      return {
        ...v,
        nave_nombre: nave?.nombre,
        origen_nombre: origen?.nombre,
        destino_nombre: destino?.nombre,
      };
    });

    res.json(detallado);
  });

  // GET /historial/:id — un viaje específico
  router.get("/:id", (req, res) => {
    const viaje = db.historial.find((h) => h.id === req.params.id);
    if (!viaje) {
      return res
        .status(404)
        .json({ error: `Viaje '${req.params.id}' no encontrado` });
    }

    const ruta = db.rutas.find((r) => r.id === viaje.ruta_id);
    const nave = db.naves.find((n) => n.id === viaje.nave_id);
    const origen = ruta
      ? db.galaxias.find((g) => g.id === ruta.origen_id)
      : null;
    const destino = ruta
      ? db.galaxias.find((g) => g.id === ruta.destino_id)
      : null;

    res.json({
      ...viaje,
      nave_nombre: nave?.nombre,
      ruta_tipo: ruta?.tipo,
      origen_nombre: origen?.nombre,
      destino_nombre: destino?.nombre,
      costo_base: ruta?.costo,
    });
  });

  return router;
};
