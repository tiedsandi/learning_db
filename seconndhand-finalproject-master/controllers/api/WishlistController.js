const { Wishlist, User, Product, ProductPicture } = require("../../models");
const Validator = require("validatorjs");
const Sequelize = require('sequelize');
const Op = Sequelize.Op

class WishlistController {
	//read all
	async getAll(req, res) {
		let qRes = [];
		let page = req.query.page
		let limit = req.query.limit || 10
		let offset = (page - 1) * limit

		let qWhere = {}
		if(req.query.product_id) qWhere.product_id = { [Op.eq]: req.query.product_id}
		if(req.query.user_id) qWhere.user_id = { [Op.eq]: req.query.user_id}

		let qOrder = []
		if(req.query.order != undefined){
			let order = req.query.order
			order = order.split(',')
			if(order.length > 0){
				order.forEach((element, i) => {
					let column = element.split(':')
					if(column.length > 0){
						if(column[1] == 'ASC' || column[1] == 'DESC'){
							qOrder[i] = [
								column[0], column[1]
							]
						}
					}
				})
			}
		}
		
		if(!page){
			qRes = await Wishlist.findAll({
				attributes: ['id', 'product_id', 'user_id', 'createdBy', 'updatedBy'],
				include: [
					{
						model: User,
						as: "user",
						attributes: ['id', 'uuid', 'email']
					},
					{
						model: Product,
						as: 'product',
						include: [
							{
								model: ProductPicture,
								as: 'product_pictures',
								attributes: ['id', 'picture'],
							}
						]
					},
				],
				order: qOrder,
				where: qWhere
			});
		}else{
			qRes = await Wishlist.findAll({
				attributes: ['id', 'product_id', 'user_id', 'createdBy', 'updatedBy'],
				offset: offset,
				limit: limit,
				include: [
					{
						model: User,
						as: "user",
						attributes: ['id', 'uuid', 'email']
					},
					{
						model: Product,
						as: 'product',
						include: [
							{
								model: ProductPicture,
								as: 'product_pictures',
								attributes: ['id', 'picture'],
							}
						]
					},
				],
				order: qOrder,
				where: qWhere
			});
		}

		return res.status(200).json({
			status: true,
			data: qRes,
		});
	}

	//read single
	async findByID(req, res) {
		let qRes = await Wishlist.findOne({
			include: [
				{
					model: User,
					as: "user",
					attributes: ['id', 'uuid', 'email']
				},
				{
					model: Product,
					as: 'product'
				},
			],
			where: {id: req.params.id},
		});

		return res.status(200).json({
			status: true,
			data: qRes,
		});
	}

	//create
	async create(req, res) {
		let rules = {
			product_id: "required",
			user_id: "required",
		};

		let validation = new Validator(req.body, rules);
		if (validation.fails()) {
			return res.status(422).json({
				status: false,
				message: "The form is not complete",
				data: validation.errors.all(),
			});
		}

		let { product_id, user_id } = req.body;

		let product = await Product.findOne({where: {id: product_id}});
		if (!product?.product) {
			return res.status(200).json({
				status: false,
				message: "Product not found",
			});
		}

		let user = await User.findOne({where: {id: user_id}});
		if (!user?.email) {
			return res.status(200).json({
				status: false,
				message: "User not found",
			});
		}

		let qRes = await Wishlist.create({
			product_id,
			user_id,
			createdBy: req.user.id
		});

		if (qRes?.id) {
			return res.status(201).json({
				status: true,
				message: "Create Successfully",
				data: qRes,
			});
		}

		return res.status(200).json({
			status: false,
			message: "Create Failed",
		});
	}

	//delete
	async delete(req, res) {
		let wishlist = await Wishlist.findOne({where: {id: req.params.id}});
		if (!wishlist?.id) {
			return res.status(200).json({
				status: false,
				message: "Data not found",
			});
		}

		let qRes = await Wishlist.destroy({
			where: {id: req.params.id},
		});

		if (qRes) {
			return res.status(200).json({
				status: true,
				message: "Delete Successfully",
			});
		}

		return res.status(200).json({
			status: false,
			message: "Delete Failed",
		});
	}
}

module.exports = WishlistController;
