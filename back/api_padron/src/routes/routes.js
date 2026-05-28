const app = require('express')
const router = app.Router()
const { authJwt } = require("../middleware")
const auth = require('../controllers/auth.controller')
const mesa = require('../controllers/mesa.controller')

//auth
router.post('/auth', auth.validarUser)
router.get('/validateToken', [authJwt.verifyToken], auth.validaToken)
router.get('/logout', [authJwt.verifyToken], auth.logout)

//carga mesa
router.post('/ordenins', [authJwt.verifyToken], mesa.insertaMesa)

module.exports = router;