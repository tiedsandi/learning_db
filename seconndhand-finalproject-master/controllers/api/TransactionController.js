const { Transaction, User, Product, ProductPicture, Notification, Biodata, sequelize } = require("../../models")
const { rupiah } = require("../../utils/currency")
const Validator = require('validatorjs')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

class TransactionController {
  //read all
  async getAll(req, res){
    let qRes = [];
    let page = req.query.page
    let limit = req.query.limit || 10
    let offset = (page - 1) * limit
    
    let qWhere = {}
    if(req.query.seller_id != undefined) qWhere.seller_id = req.query.seller_id
    if(req.query.buyer_id != undefined) qWhere.buyer_id = req.query.buyer_id
    if(req.query.bid_status != undefined) qWhere.bid_status = req.query.bid_status
    if(req.query.transaction_status != undefined) qWhere.transaction_status = req.query.transaction_status

    let qWhereProduct;
    if(req.query.product) qWhereProduct.product = { [Op.iLike]: `%${req.query.product}%`}  
    
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
    qOrder.push(['product', 'product_pictures', 'id', 'ASC'])

    if(!page){
      qRes = await Transaction.findAll({
        include: [
          {
            model: User,
            as: 'buyer',   
            attributes: ['id', 'uuid', 'email'],
            include: [
              {
                model: Biodata,
                as: 'biodata',
                attributes: ['fullname', 'profile_picture', 'number_phone']
              }
            ]
          },
          {
            model: User,
            as: 'seller',   
            attributes: ['id', 'uuid', 'email'],
            include: [
              {
                model: Biodata,
                as: 'biodata',
                attributes: ['fullname', 'profile_picture', 'number_phone']
              }
            ]
          },
          {
            model: Product,
            as: 'product',   
            attributes: ['id', 'product', 'price', 'category_id', 'status'],
            where: qWhereProduct,
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
      })
    }else{
      qRes = await Transaction.findAll({
        offset: offset,
        limit: limit,
        include: [
          {
            model: User,
            as: 'buyer',   
            attributes: ['id', 'uuid', 'email'],
            include: [
              {
                model: Biodata,
                as: 'biodata',
                attributes: ['fullname', 'profile_picture', 'number_phone']
              }
            ]
          },
          {
            model: User,
            as: 'seller',   
            attributes: ['id', 'uuid', 'email'],
            include: [
              {
                model: Biodata,
                as: 'biodata',
                attributes: ['fullname', 'profile_picture', 'number_phone']
              }
            ]
          },
          {
            model: Product,
            as: 'product',   
            attributes: ['id', 'product', 'price', 'category_id', 'status'],
            where: qWhereProduct,
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
      })
    }

    return res.status(200).json({
      status: true,
      data: qRes
    })
  }

  //read single
  async findByID(req, res){
    let qRes = await Transaction.findOne({
      include: [
        {
          model: User,
          as: 'buyer',   
          attributes: ['id', 'uuid', 'email'],
          include: [
            {
              model: Biodata,
              as: 'biodata',
              attributes: ['fullname', 'profile_picture', 'number_phone']
            }
          ]
        },
        {
          model: User,
          as: 'seller',   
          attributes: ['id', 'uuid', 'email'],
          include: [
            {
              model: Biodata,
              as: 'biodata',
              attributes: ['fullname', 'profile_picture', 'number_phone']
            }
          ]
        },
        {
          model: Product,
          as: 'product',   
          attributes: ['id', 'product', 'price', 'category_id', 'status'],
          include: [
            {
              model: ProductPicture,
              as: 'product_pictures',
              attributes: ['id', 'picture'],
            }
          ]
        },
      ],
      order: [['product', 'product_pictures', 'id', 'ASC']],
      where: {id: req.params.id}
    })

    return res.status(200).json({
      status: true,
      data: qRes
    })
  }

  //
  async buyerBid(req, res){
    let rules = {
      product_id: 'required',
      bid_price: 'required'
    }

    let validation = new Validator(req.body, rules)
    if(validation.fails()){
      return res.status(422).json({
        status: false,
        message: 'The form is not complete',
        data: validation.errors.all()
      })
    }
    
    let { product_id, bid_price } = req.body
    let buyer_id = req.user.id
    
    const t = await sequelize.transaction();

    try {
      let buyer = await User.findOne({where: {id: buyer_id}})
      if(!buyer?.email){
        return res.status(200).json({
          status: false,
          message: 'User not found',
        })
      }

      let product = await Product.findOne({where: {id: product_id}})
      if(!product?.seller_id){
        return res.status(200).json({
          status: false,
          message: 'Product not found',
        })
      }

      if(product.price < bid_price){
        return res.status(200).json({
          status: false,
          message: `Can't bid below product price`
        })
      }
      
      if(product?.seller_id == buyer_id){
        return res.status(200).json({
          status: false,
          message: `Can't bid on your own product`,
        })
      }
      
      await Product.update({status: 2, updatedBy: req.user.id}, {where: {id: product.id}})

      let qRes = await Transaction.create({
        product_id: product_id,
        bid_price: bid_price,
        bid_status: 0,
        transaction_status: 0,
        seller_id: product?.seller_id,
        buyer_id: buyer_id,
        createdBy: req.user.id,
        updatedBy: req.user.id
      })
      
      let product_picture = await ProductPicture.findOne({where: {product_id: product_id}})
      await Notification.create({
        user_id: product.seller_id,
        title: 'Penawaran produk',
        message: `${product?.product} <br> ${rupiah(product?.price)} <br> Ditawar ${rupiah(bid_price)}`,
        path: `transaction/${qRes.id}`,
        image: `${product_picture?.picture}`,
        createdBy: req.user.id
      })

      await t.commit();
      return res.status(201).json({
        status: true,
        message: 'Bid Successfully',
        data: qRes
      })
    } catch (error) {
      // console.log(error)
      await t.rollback();   
      return res.status(200).json({
        status: false,
        message: 'Bid Failed',
      })
    }
  }

  async sellerChangeStatusTransaction(req, res){
    let rules = {
      transaction_status: 'required|in:0,1,2',
    }

    let validation = new Validator(req.body, rules)
    if(validation.fails()){
      return res.status(422).json({
        status: false,
        message: 'The form is not complete',
        data: validation.errors.all()
      })
    }
    
    let { transaction_status } = req.body
    const t = await sequelize.transaction();
    try {
      let transaction = await Transaction.findOne({where: {id: req?.params.id}})

      if(!transaction?.id){
        return res.status(200).json({
          status: false,
          message: 'Transaction not found',
        })
      }

      if(transaction?.bid_status != '1'){
        return res.status(200).json({
          status: false,
          message: 'Bid status must be accepted/1',
        })
      }

      let product = await Product.findOne({where: {id: transaction.product_id}})
      if(!product?.id){
        return res.status(200).json({
          status: false,
          message: 'Product not found',
        })
      }
      
      let product_picture = await ProductPicture.findOne({where: {product_id: transaction.product_id}})
      let sStatus = 1
      if(transaction_status == '0'){
        sStatus = 2
      }else if(transaction_status == '1'){
        await Notification.create({
          user_id: transaction.buyer_id,
          title: 'Berhasil terbeli',
          subtitle: '',
          message: `${product?.product} <br> <s>${rupiah(product?.price)}</s> <br> Berhasil ditawar ${rupiah(transaction.bid_price)}`,
          path: `transaction/${transaction.id}`,
          image: `${product_picture?.picture}`,
          createdBy: req.user.id
        })

        await Notification.create({
          user_id: transaction.seller_id,
          title: 'Berhasil terjual',
          subtitle: '',
          message: `${product?.product} <br> <s>${rupiah(product?.price)}</s> <br> Berhasil ditawar ${rupiah(transaction.bid_price)}`,
          path: `transaction/${transaction.id}`,
          image: `${product_picture?.picture}`,
          createdBy: req.user.id
        })

        sStatus = 3
      }else if(transaction_status == '2'){
        await Notification.create({
          user_id: transaction.buyer_id,
          title: 'Transaksi dibatalkan penjual',
          subtitle: '',
          message: `${product?.product} <br> ${rupiah(product?.price)} <br> Berhasil ditawar ${rupiah(transaction.bid_price)}`,
          path: `transaction/${transaction.id}`,
          image: `${product_picture?.picture}`,
          createdBy: req.user.id
        })

        await Notification.create({
          user_id: transaction.seller_id,
          title: 'Transaksi dibatalkan',
          subtitle: '',
          message: `${product?.product} <br> ${rupiah(product?.price)} <br> Berhasil ditawar ${rupiah(transaction.bid_price)}`,
          path: `transaction/${transaction.id}`,
          image: `${product_picture?.picture}`,
          createdBy: req.user.id
        })

        sStatus = 1
      }

      await Product.update({status: sStatus, updatedBy: req.user.id}, {where: {id: product.id}})
      await Transaction.update({transaction_status: transaction_status, transaction_status_at: new Date(), updatedBy: req.user.id }, {where: {id: req.params.id}})

      await t.commit();
      return res.status(201).json({
        status: true,
        message: 'Change Status Transaction Successfully',
      })
    } catch (error) {
      await t.rollback();   
      return res.status(200).json({
        status: false,
        message: 'Change Status Transaction Failed',
      })
    }
  }

  async sellerChangeStatusBid(req, res){
    let rules = {
      bid_status: 'required|in:0,1,2',
    }

    let validation = new Validator(req.body, rules)
    if(validation.fails()){
      return res.status(422).json({
        status: false,
        message: 'The form is not complete',
        data: validation.errors.all()
      })
    }
    
    let { bid_status } = req.body
    const t = await sequelize.transaction();
    try {
      let transaction = await Transaction.findOne({where: {id: req?.params.id}})

      if(!transaction?.id){
        return res.status(200).json({
          status: false,
          message: 'Transaction not found',
        })
      }

      let product = await Product.findOne({where: {id: transaction.product_id}})
      if(!product?.id){
        return res.status(200).json({
          status: false,
          message: 'Product not found',
        })
      }
      
      let product_picture = await ProductPicture.findOne({where: {product_id: transaction.product_id}})
      let sStatus = 1
      if(bid_status == '0'){
        await Notification.create({
          user_id: transaction.seller_id,
          title: 'Penawaran produk',
          message: `${product?.product} <br> ${rupiah(product?.price)} <br> Ditawar ${rupiah(transaction.bid_price)}`,
          path: `transaction/${transaction.id}`,
          image: `${product_picture?.picture}`,
          createdBy: req.user.id
        })

        await Notification.create({
          user_id: transaction.buyer_id,
          title: 'Penawaran produk',
          message: `${product?.product} <br> ${rupiah(product?.price)} <br> Menawar ${rupiah(transaction.bid_price)}`,
          path: `transaction/${transaction.id}`,
          image: `${product_picture?.picture}`,
          createdBy: req.user.id
        })

        sStatus = 2
      }else if(bid_status == '1'){
        await Notification.create({
          user_id: transaction.buyer_id,
          title: 'Penawaran produk',
          subtitle: 'Kamu akan segera dihubungi penjual via whatsapp',
          message: `${product?.product} <br> <s>${rupiah(product?.price)}</s> <br> Berhasil ditawar ${rupiah(transaction.bid_price)}`,
          path: `transaction/${transaction.id}`,
          image: `${product_picture?.picture}`,
          createdBy: req.user.id
        })

        await Notification.create({
          user_id: transaction.seller_id,
          title: 'Penawaran produk',
          subtitle: 'Anda menyetujui penawaran',
          message: `${product?.product} <br> <s>${rupiah(product?.price)}</s> <br> Berhasil ditawar ${rupiah(transaction.bid_price)}`,
          path: `transaction/${transaction.id}`,
          image: `${product_picture?.picture}`,
          createdBy: req.user.id
        })

        sStatus = 2
      }else if(bid_status == '2'){
        await Notification.create({
          user_id: transaction.buyer_id,
          title: 'Penawaran produk',
          subtitle: 'Penawaran anda tidak disetujui penjual',
          message: `${product?.product} <br> ${rupiah(product?.price)} <br> Gagal ditawar ${rupiah(transaction.bid_price)}`,
          path: `transaction/${transaction.id}`,
          image: `${product_picture?.picture}`,
          createdBy: req.user.id
        })

        await Notification.create({
          user_id: transaction.seller_id,
          title: 'Penawaran produk',
          subtitle: 'Anda menolak penawaran',
          message: `${product?.product} <br> ${rupiah(product?.price)} <br> Gagal ditawar ${rupiah(transaction.bid_price)}`,
          path: `transaction/${transaction.id}`,
          image: `${product_picture?.picture}`,
          createdBy: req.user.id
        })

        sStatus = 1
      }

      await Product.update({status: sStatus, updatedBy: req.user.id}, {where: {id: product.id}})
      await Transaction.update({bid_status: bid_status, bid_status_at: new Date(), updatedBy: req.user.id }, {where: {id: req.params.id}})
      await t.commit();
      return res.status(200).json({
        status: true,
        message: 'Change Status Bid Successfully',
      })
    } catch (error) {
      // console.log(error)
      await t.rollback();   
      return res.status(200).json({
        status: false,
        message: 'Change Status Bid Failed',
      })
    }
  }

  async delete(req, res){
    let transaction = await Transaction.findOne({where: {id: req.params.id}})
    if(!transaction?.product_id){
      return res.status(200).json({
        status: false,
        message: 'Data not found',
      })
    }

    let qRes = await Transaction.destroy({
      where: {id: req.params.id}
    })

    if(qRes){
      return res.status(200).json({
        status: true,
        message: 'Delete Successfully',
      })
    }

    return res.status(200).json({
      status: false,
      message: 'Delete Failed',
    })
  }
}


module.exports = TransactionController