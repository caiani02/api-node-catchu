const express = require("express");
const router = express.Router();
const cors = require("cors");

const UsuariosController = require("../controllers/usuarios");

// aplicar CORS nesta rota (ou no app principal)
router.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000", credentials: true }));

router.get("/usuarios", UsuariosController.listarUsuarios);
router.post("/usuarios", UsuariosController.cadastrarUsuarios);
router.patch("/usuarios/:usu_id", UsuariosController.editarUsuarios);
router.delete("/usuarios/:usu_id", UsuariosController.apagarUsuarios);
router.get("/login", UsuariosController.login);

module.exports = router;