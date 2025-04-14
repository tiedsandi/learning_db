const { Product, User, Category, ProductPicture, Notification } = require("../../models");
const { rupiah } = require("../../utils/currency")
const Validator = require("validatorjs");
const Sequelize = require('sequelize');
const Op = Sequelize.Op
const fs = require('fs')

class ProductController {
	//read all
	async getAll(req, res) {
		let qRes = [];
		let page = req.query.page
		let limit = req.query.limit || 10
		let offset = (page - 1) * limit

		let qWhere = {}
		if(req.query.product) qWhere.product = { [Op.iLike]: `%${req.query.product}%`}
		if(req.user){
			if(req.user.id) qWhere.seller_id = req.user.id
		}

		if(req?.query?.category && req?.query?.category != '' && req?.query?.category != null) {
      let categories = req.query.category.split(',')
      if(categories.length > 0) qWhere.category_id = { [Op.in]: categories }
    }
    
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
		qOrder.push(['product_pictures', 'id', 'ASC'])

		if(!page){
			qRes = await Product.findAll({
				include: [
					{
						model: Category,
						as: 'category'
					},
					{
						model: ProductPicture,
						as: 'product_pictures'
					},
					{
						model: User,
						as: "user",
						attributes: ['id', 'uuid', 'email']
					},
				],
				order: qOrder,
				where: qWhere
			});
		}else{
			qRes = await Product.findAll({
				offset: offset,
				limit: limit,
				include: [
					{
						model: Category,
						as: 'category'
					},
					{
						model: ProductPicture,
						as: 'product_pictures'
					},
					{
						model: User,
						as: "user",
						attributes: ['id', 'uuid', 'email']
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
    if(req?.params?.id == 'undefined'){
      return res.status(200).json({
        status: false,
        message: 'Invalid ID',
      })
    }

		let qRes = await Product.findOne({
			include: [
				{
					model: Category,
					as: 'category'
				},
				{
					model: ProductPicture,
					as: 'product_pictures'
				},
				{
					model: User,
					as: "user",
					attributes: ['id', 'uuid', 'email']
				},
			],
			order: [['product_pictures', 'id', 'ASC']],
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
			product: "required",
			price: "required",
			category_id: "required",
			description: "required",
			status: "required",
			pictures: "required",
		};

		let validation = new Validator(req.body, rules);
		if (validation.fails()) {
			return res.status(422).json({
				status: false,
				message: "The form is not complete",
				data: validation.errors.all(),
			});
		}

		let { product, price, category_id, description, seller_id, status, pictures } = req.body;

    let total_product = await Product.count({
      where: {
        seller_id: req.user.id,
        status: {
          [Op.in]: [0,1,2]
        }
      }
    });
    
    if(total_product == 4){
      return res.status(400).json({ 
        status: false,
        message: 'You can only sell 4 products' 
      })
    }
    
		let category = await Category.findOne({where: {id: category_id}});
		if (!category?.category) {
			return res.status(200).json({
				status: false,
				message: "Category not found",
			});
		}

		if(seller_id){
			let user = await User.findOne({where: {id: seller_id}});
			if (!user?.email) {
				return res.status(200).json({
					status: false,
					message: "User not found",
				});
			}
		}

    if(pictures.length > 4){
      return res.status(400).json({ 
        status: false,
        message: 'You can only upload 4 pictures' 
      })
    }

		let qRes = await Product.create({
			product,
			price,
			category_id,
			description,
			seller_id: seller_id?seller_id:req.user.id,
			status,
			createdBy: req.user.id
		});

		let picsRes = []
		if (qRes?.id) {
			if(pictures.length > 0){
				for(let i = 0; i < pictures.length; i++){
					picsRes[i] = await ProductPicture.create({
						product_id: qRes.id,
						picture: req.body.pictures[i],
						createdBy: req.user.id
					})
				}
			}
			await Notification.create({
				user_id: req.user.id,
				title: "Berhasil di terbitkan",
				subtitle: qRes.product,
				message: rupiah(qRes.price),
				path: `product/${qRes.id}`,
				image: `${picsRes[0].picture}`,
				createdBy: req.user.id
			})

			return res.status(201).json({
				status: true,
				message: "Create Successfully",
				data: {qRes, picsRes},
			});
		}

		return res.status(200).json({
			status: false,
			message: "Create Failed",
		});
	}

	//update
	async update(req, res) {
		let rules = {
			product: "required",
			price: "required",
			category_id: "required",
			description: "required",
			status: "required",
			pictures: "required"
		};

		let validation = new Validator(req.body, rules);
		if (validation.fails()) {
			return res.status(422).json({
				status: false,
				message: "The form is not complete",
				data: validation.errors.all(),
			});
		}

		let { product, price, category_id, published, description, seller_id, pictures } = req.body;

    if(pictures.length > 4){
      return res.status(400).json({ 
        status: false,
        message: 'You can only upload 4 pictures' 
      })
    }

		let itemProduct = await Product.findOne({where: {id: req.params.id}});
		if (!itemProduct?.product) {
			return res.status(200).json({
				status: false,
				message: "Data not found",
			});
		}

		let category = await Category.findOne({where: {id: category_id}});
		if (!category?.category) {
			return res.status(200).json({
				status: false,
				message: "Category not found",
			});
		}

		if(seller_id){
			let user = await User.findOne({where: {id: seller_id}});
			if (!user?.email) {
				return res.status(200).json({
					status: false,
					message: "User not found",
				});
			}
		}

		let productPics = await ProductPicture.findAll({where: {product_id: req.params.id}})
		let del_id = []
		for(let i = 0; i < productPics.length; i++){
			if(pictures.includes(productPics[i].picture)){
				pictures = pictures.filter((item) => item != productPics[i].picture)
			}else{
				del_id.push(productPics[i].id)
			}
		}

		let picsRes = []
		if(pictures.length > 0){
			for(let i = 0; i < pictures.length; i++){
				picsRes[i] = await ProductPicture.create({
					product_id: req.params.id,
					picture: pictures[i],
					createdBy: req.user.id
				})
			}
		}

		for(let i = 0; i < del_id.length; i++){
			for(let j = 0; j < productPics.length; j++){
				if(productPics[j]?.id == del_id[i]){
					try {
						let _path = `./${productPics[j]?.picture}`
						if(_path != `./uploads/product/default.png`){
							if(fs.existsSync(_path)){
								fs.unlinkSync(_path)
							}
						}
					} catch(err) {
						return res.status(500).json({
							message: 'Process Error'
						})
					}

					await ProductPicture.destroy({where: {id: del_id[i]}});
				}
			}
		}

		let data = {
			product,
			price,
			category_id,
			published,
			description,
			seller_id: seller_id?seller_id:req.user.id,
			updatedBy: req.user.id
		};

		let qRes = await Product.update(data, {
			where: {id: req.params.id},
		});

		if (qRes) {
			return res.status(200).json({
				status: true,
				message: "Update Successfully",
				data: data,
			});
		}

		return res.status(200).json({
			status: false,
			message: "Update Failed",
		});
	}

	//delete
	async delete(req, res) {
		let query = {where: {id: req.params.id}}
		let product = await Product.findOne(query);
		if(!product?.product) {
			return res.status(200).json({
				status: false,
				message: "Data not found",
			});
		}

		let productPics = await ProductPicture.findAll({where: {product_id: product.id}})
		if(!productPics?.length == 0){
			for(let i = 0; i < productPics?.length; i++){
				if(productPics[i]?.picture){
					try {
						let _path = `./${productPics[i]?.picture}`
						if(_path != `./uploads/product/default.png`){
							if(fs.existsSync(_path)){
								fs.unlinkSync(_path)
							}
						}
					} catch(err) {
						return res.status(500).json({
							message: 'Process Error'
						})
					}
				}
				await ProductPicture.destroy({where: {id: productPics[i].id}})
			}
		}

		let qRes = await Product.destroy(query);

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

	//upload gambar
	async uploadPics(req, res) {
		if(req?.files == undefined){
			return res.status(200).json({
				status: false,
				message: 'Picture(s) Required'
			})
		}

		return res.status(200).json({
			status: true,
			message: 'Success Upload',
      data: req.files
		});
	}

	//delete gambar
	async deletePics(req, res) {
		let query = {where: {id: req.params.id}}
		let productPics = await ProductPicture.findOne(query);
		if(!productPics?.picture) {
			return res.status(200).json({
				status: false,
				message: "Data not found",
			});
		}

		if(productPics?.picture){
			try {
				let _path = `./${productPics?.picture}`
				if(_path != `./uploads/product/default.png`){
					if(fs.existsSync(_path)){
						fs.unlinkSync(_path)
					}
				}
			} catch(err) {
				return res.status(500).json({
					message: 'Process Error'
				})
			}
		}

		let qRes = await ProductPicture.destroy(query);

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

module.exports = ProductController;