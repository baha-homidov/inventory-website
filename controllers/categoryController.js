const Category = require("../models/category");
const async = require("async");

// Display list of all Categories
exports.category_list = (req, res, next) => {
  Category.find({}, "name")
    .sort({ name: 1 })
    .exec(function (err, list_category) {
      if (err) {
        return next(err);
      }

      // Successful, so render
      res.render("pages/category_list", {
        page_title: "Category List",
        title: "Category List",
        category_list: list_category,
      });
    });
};

// Display detail page for a speifict Category
exports.category_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: Category detail: ${req.params.id}`);
};

// Display Category create from GET
exports.category_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Category create GET");
};

// Handle Category create on POST.
exports.category_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Category create POST");
};

// Display Category delete form on GET
exports.category_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Category delete get");
};

// Handle Category delete on POST
exports.category_delete_post = (req, res) => {
  res.send("NOT IMPLEMNTED: Category delete POST");
};

// Display Category update form on GET.
exports.category_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Category update GET");
};

// Handle Category update on POST
exports.category_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Category update POST");
};
