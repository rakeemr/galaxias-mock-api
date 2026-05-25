const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // GET /galaxias — todas las galaxias (nodos del grafo)
  router.get("/", (req, res) => {
    const { tipo } = req.query;
    const resultado = tipo
      ? db.galaxias.filter((g) => g.tipo === tipo)
      : db.galaxias;
    res.json(resultado);
  });

  // GET /galaxias/:id — una galaxia por id
  router.get("/:id", (req, res) => {
    const galaxia = db.galaxias.find((g) => g.id === req.params.id);
    if (!galaxia) {
      return res
        .status(404)
        .json({ error: `Galaxia '${req.params.id}' no encontrada` });
    }
    res.json(galaxia);
  });

  return router;
};
