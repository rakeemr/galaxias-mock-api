const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // GET /naves — todas las naves
  router.get("/", (req, res) => {
    const { activa } = req.query;
    const resultado =
      activa !== undefined
        ? db.naves.filter((n) => n.activa === (activa === "true"))
        : db.naves;
    res.json(resultado);
  });

  // GET /naves/:id — una nave por id
  router.get("/:id", (req, res) => {
    const nave = db.naves.find((n) => n.id === req.params.id);
    if (!nave) {
      return res
        .status(404)
        .json({ error: `Nave '${req.params.id}' no encontrada` });
    }
    res.json(nave);
  });

  // GET /naves/:id/historial — historial de viajes de una nave
  // Consulta requerida #4: "Consultar historial de viajes por nave"
  router.get("/:id/historial", (req, res) => {
    const nave = db.naves.find((n) => n.id === req.params.id);
    if (!nave) {
      return res
        .status(404)
        .json({ error: `Nave '${req.params.id}' no encontrada` });
    }

    const viajes = db.historial.filter((h) => h.nave_id === req.params.id);

    // Enriquece cada viaje con los datos de la ruta y galaxias
    const viajesDetallados = viajes
      .map((v) => {
        const ruta = db.rutas.find((r) => r.id === v.ruta_id);
        const origen = ruta
          ? db.galaxias.find((g) => g.id === ruta.origen_id)
          : null;
        const destino = ruta
          ? db.galaxias.find((g) => g.id === ruta.destino_id)
          : null;

        return {
          ...v,
          ruta_tipo: ruta?.tipo,
          origen_nombre: origen?.nombre,
          destino_nombre: destino?.nombre,
          costo_base: ruta?.costo,
        };
      })
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)); // más reciente primero

    res.json({
      nave_id: req.params.id,
      nave_nombre: nave.nombre,
      total_viajes: viajesDetallados.length,
      exitosos: viajesDetallados.filter((v) => v.exitoso).length,
      costo_total: parseFloat(
        viajesDetallados.reduce((s, v) => s + v.costo_real, 0).toFixed(2)
      ),
      viajes: viajesDetallados,
    });
  });

  return router;
};
