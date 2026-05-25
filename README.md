# API de Navegación Galáctica - Sistema de Grafos

Este módulo es un backend desarrollado en **Node.js** encargado de gestionar la infraestructura de una red galáctica. Provee datos estructurados (nodos y aristas) para ser consumidos por aplicaciones externas, principalmente programas en **C++** que ejecutan algoritmos de teoría de grafos.

## 🚀 Propósito

La API permite:

- **Gestión de Galaxias:** Administración de nodos (planetas/estaciones).
- **Red de Rutas:** Definición de conexiones entre galaxias con estados de activación.
- **Control de Naves:** Registro de naves y su historial de viajes.
- **Soporte Algorítmico:** Provee endpoints específicos para algoritmos como **Kruskal** (árbol de expansión mínima) mediante la entrega de aristas en órdenes específicos.

## 🛠️ Tecnologías

- **Runtime:** Node.js
- **Framework:** Express.js
- **Persistencia:** Datos volátiles generados mediante un `seed` al arrancar.
- **Interoperabilidad:** Configurada con CORS abierto para consumo desde clientes C++.

## 📋 Endpoints Principales

| Método | Endpoint               | Descripción                                                                    |
| ------ | ---------------------- | ------------------------------------------------------------------------------ |
| `GET`  | `/grafo`               | Obtiene el grafo completo (nodos y aristas activas) para carga inicial en C++. |
| `GET`  | `/grafo/kruskal`       | Obtiene aristas en orden aleatorio para el algoritmo de Kruskal modificado.    |
| `GET`  | `/galaxias`            | Lista todas las galaxias registradas.                                          |
| `GET`  | `/naves`               | Lista las naves disponibles.                                                   |
| `GET`  | `/naves/:id/historial` | Consulta el historial de viajes detallado de una nave específica.              |

## ⚙️ Instalación y Configuración

1. Instala las dependencias:

   ```bash
   npm install
   ```

2. Inicia el servidor:
   ```bash
   node server.js
   ```
   _Por defecto corre en el puerto 3000._

## 🔗 Integración C++

El servidor está diseñado para que el programa cliente en C++ realice una petición inicial a `/grafo`, construya la estructura en memoria y posteriormente pueda reportar viajes o consultar datos adicionales.

---

**Nota:** Los datos se reinician cada vez que se detiene el servidor, ya que se generan dinámicamente mediante el módulo `seed.js`.
