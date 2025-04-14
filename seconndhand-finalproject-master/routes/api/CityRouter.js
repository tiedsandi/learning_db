const express = require('express')
const router = express.Router()
const CityController = require('../../controllers/api/CityController')
const Middleware = require('../../middleware/Middleware')
const ctl = new CityController()

router.get(`/city/`, Middleware.verifyJwt, ctl.getAll)
router.get(`/city/:id`, Middleware.verifyJwt, ctl.findByID)
router.post(`/city`, Middleware.verifyJwt, ctl.create)
router.put(`/city/:id`, Middleware.verifyJwt, ctl.update)
router.delete(`/city/:id`, Middleware.verifyJwt, ctl.delete)

module.exports = router