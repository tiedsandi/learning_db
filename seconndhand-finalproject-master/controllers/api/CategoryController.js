const { Category, Product } = require("../../models");
const Validator = require("validatorjs");

class CategoryController {
  //read all
  async getAll(req, res) {
    let qRes = await Category.findAll();

    return res.status(200).json({
      status: true,
      data: qRes,
    });
  }

  //read single
  async findByID(req, res) {
    let qRes = await Category.findOne({
      include: [
        {
          model: Product,
          as: "products",
        },
      ],
      where: { id: req.params.id },
    });

    return res.status(200).json({
      status: true,
      data: qRes,
    });
  }
  //create
  async create(req, res) {
    let rules = {
      category: "required",
    };

    let validation = new Validator(req.body, rules);
    if (validation.fails()) {
      return res.status(422).json({
        status: false,
        message: "The form is not complete",
        data: validation.errors.all(),
      });
    }

    let { category } = req.body;

    let qRes = await Category.create({
      category: category,
      createdBy: req.user.id,
    });

    if (qRes.id) {
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

  //update
  async update(req, res) {
    let rules = {
      category: "required",
    };

    let validation = new Validator(req.body, rules);
    if (validation.fails()) {
      return res.status(422).json({
        status: false,
        message: "The form is not complete",
        data: validation.errors.all(),
      });
    }

    let { category } = req.body;

    let update = await Category.findOne({ where: { id: req.params.id }});
    if (update == undefined) {
      return res.status(200).json({
        status: false,
        message: "Data not found",
      });
    }

    let data = {
      category: category,
      updatedBy: req.user.id,
    };

    let qRes = await Category.update(data, {
      where: { id: req.params.id },
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
    let dihapus = await Category.findOne({ where: { id: req.params.id } });
    if (dihapus == undefined) {
      return res.status(200).json({
        status: false,
        message: "Data not found",
      });
    }

    let qRes = await Category.destroy({
      where: { id: req.params.id },
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

module.exports = CategoryController;