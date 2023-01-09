const Item = require("../models/item");
const Category = require("../models/category");
const async = require("async");

exports.index = (req, res) => {
  async.parallel(
    {
      item_count(callback) {
        Item.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
      },
      category_count(callback) {
        Category.countDocuments({}, callback);
      },
    },
    (err, results) => {
      res.render("pages/index", {
        error: err,
        data: results,
        page_title: "Home page",
        title: "Welcome",
      });
    }
  );
};

// Display list of all Items
exports.item_list = (req, res) => {
  Item.find({}, "name")
    .populate("category", "name")
    .collation({ locale: "en" }) // for case insensetive sort
    .sort({ name: 1 })
    .exec(function (err, list_item) {
      if (err) {
        return next(err);
      }

      list_item = list_item.sort((a, b) =>
        a.category.name.localeCompare(b.category.name)
      );

      // Successful, so render
      res.render("pages/item_list", {
        page_title: "Item List",
        title: "Item List",
        item_list: list_item,
      });
    });
};

// Display detail page for a speifict Item
exports.item_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: Item detail: ${req.params.id}`);
};

// Display Item create from GET
exports.item_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Item create GET");
};

// Handle Item create on POST.
exports.item_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Item create POST");
};

// Display Item delete form on GET
exports.item_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Item delete get");
};

// Handle Item delete on POST
exports.item_delete_post = (req, res) => {
  res.send("NOT IMPLEMNTED: Item delete POST");
};

// Display Item update form on GET.
exports.item_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Item update GET");
};

// Handle Item update on POST
exports.item_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Item update POST");
};
