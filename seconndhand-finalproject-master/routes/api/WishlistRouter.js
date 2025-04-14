const express = require('express')
const router = express.Router()
const WishlistController = require('../../controllers/api/WishlistController')
const Middleware = require('../../middleware/Middleware')
const ctl = new WishlistController()

router.get(`/wishlist/`, Middleware.verifyJwt, ctl.getAll)
router.get(`/wishlist/:id`, Middleware.verifyJwt, ctl.findByID)
router.post(`/wishlist`, Middleware.verifyJwt, ctl.create)
router.delete(`/wishlist/:id`, Middleware.verifyJwt, ctl.delete)

module.exports = router
