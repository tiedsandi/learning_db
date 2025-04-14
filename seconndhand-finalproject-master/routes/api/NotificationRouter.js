const express = require('express')
const router = express.Router()
const NotificationController = require('../../controllers/api/NotificationController')
const Middleware = require('../../middleware/Middleware')
const ctl = new NotificationController()

router.get(`/notification/`, Middleware.verifyJwt, ctl.getAll)
router.get(`/notification/:id`, Middleware.verifyJwt, ctl.findByID)
router.post(`/notification`, Middleware.verifyJwt, ctl.create)
router.put(`/notification/:id`, Middleware.verifyJwt, ctl.update)
router.delete(`/notification/:id`, Middleware.verifyJwt, ctl.delete)
router.get(`/notification/mark_as_read/:id`, Middleware.verifyJwt, ctl.markAsRead)

module.exports = router
