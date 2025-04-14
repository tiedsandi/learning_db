const express = require("express");
const router = express.Router();
const CategoryController = require("../../controllers/api/CategoryController");
const Middleware = require("../../middleware/Middleware");
const ctl = new CategoryController();

router.get(`/category/public`, ctl.getAll);
router.get(`/category/`, Middleware.verifyJwt, ctl.getAll);
router.get(`/category/:id`, Middleware.verifyJwt, ctl.findByID);
router.post(`/category`, Middleware.verifyJwt, ctl.create);
router.put(`/category/:id`, Middleware.verifyJwt, ctl.update);
router.delete(`/category/:id`, Middleware.verifyJwt, ctl.delete);

module.exports = router;