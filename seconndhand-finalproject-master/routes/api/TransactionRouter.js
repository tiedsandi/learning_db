const express = require('express')
const router = express.Router()
const TransactionController = require('../../controllers/api/TransactionController')
const Middleware = require('../../middleware/Middleware')
const ctl = new TransactionController()

router.get(`/transaction/`, Middleware.verifyJwt, ctl.getAll)
router.get(`/transaction/:id`, Middleware.verifyJwt, ctl.findByID)
router.post(`/transaction/buyer/bid`, Middleware.verifyJwt, ctl.buyerBid)
router.put(`/transaction/seller/change_status/:id`, Middleware.verifyJwt, ctl.sellerChangeStatusTransaction)
router.put(`/transaction/seller/change_status/bid/:id`, Middleware.verifyJwt, ctl.sellerChangeStatusBid)
router.delete(`/transaction/:id`, Middleware.verifyJwt, ctl.delete)

module.exports = router
