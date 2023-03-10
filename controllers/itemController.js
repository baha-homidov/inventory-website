const Item = require("../models/item");
const Category = require("../models/category");
const async = require("async");

// express-validator module to sanitize forms
const { body, validationResult } = require("express-validator");

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
  async.parallel(
    {
      item(callback) {
        // get item info from database
        Item.findById(req.params.id).populate("category").exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.item == null) {
        // No results.
        const err = new Error("Genre not found");
        err.status = 404;
        return next(err);
      }

      res.render("pages/item_detail", {
        page_title: "Item detail",
        title: results.item.name,
        item: results.item,
      });
    }
  );
};

// Display Item create from GET
exports.item_create_get = (req, res, next) => {
  // Get all categories, which will be used for adding to the item
  async.parallel(
    {
      categories(callback) {
        Category.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render("pages/item_form", {
        title: "Create item",
        page_title: "Create item",
        categories: results.categories,
      });
    }
  );
};

// Handle Item create on POST.
exports.item_create_post = [
  // Validate and sanitize the name field
  body("name", "Category name required").trim().isLength({ min: 1 }).escape(),
  body("price", "Price should be more than 0")
    .trim()
    .isFloat({ min: 0 })
    .escape(),
  body("number_in_stock", "Number in srock should be more than -1")
    .trim()
    .isInt({ min: 0 })
    .escape(),

  // Process request after validation and sanitization
  (req, res, next) => {
    // Extract the valdation errors from a request
    const errors = validationResult(req);

    // Get category ID for further saving
    async.parallel(
      {
        category(callback) {
          // get item info from database
          Category.findOne({ name: req.body.category }).exec(callback);
        },
      },
      (err, results) => {
        if (err) {
          next(err);
        }

        // Create an item object wth escaped and trimmed data.
        const item = new Item({
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
          number_in_stock: req.body.number_in_stock,
          category: results.category._id,
        });

        if (!errors.isEmpty()) {
          // There are errors. Render the form again with sanitized values/error messages.
          res.render("pages/index", {
            title: "Create Item",
            page_title: "Create Item",
            item: item,
            errors: errors.array(),
          });
          return;
        } else {
          // Date from form is valid
          item.save((err) => {
            if (err) {
              return next(err);
            }
            // Item saved. Redirect to item detail page
            res.redirect(item.url);
          });
        }

        // res.send(results.category._id);
      }
    );

    // res.send(req.body);
  },
];

// Display Item delete form on GET
exports.item_delete_get = (req, res, next) => {
  async.parallel(
    {
      item(callback) {
        Item.findById(req.params.id).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.item == null) {
        // No results.
        res.redirect("/catalog/item");
      }

      // Successful, so render.
      res.render("pages/item_delete", {
        title: "Delete Item",
        page_title: "Delete Item",
        category: results.item,
      });
    }
  );
};

// Handle Item delete on POST
exports.item_delete_post = (req, res, next) => {
  //  Delete object and redirect to the list of categories.
  Item.findByIdAndRemove(req.body.itemid, (err) => {
    if (err) {
      return next(err);
    }
    // Success - go to author list
    res.redirect("/catalog/item");
  });
};

// Display Item update form on GET.
exports.item_update_get = (req, res, next) => {
  // Get all categories, which will be used for adding to the item

  async.parallel(
    {
      categories(callback) {
        Category.find(callback)
      },
      item(callback) {
        Item.findById(req.params.id).populate("category", "name").exec(callback);
      }
    }, (err, results) => {
      if(err) {
        return next(err);
      }
      if (results.item == null) {
        // No results.
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
      }

      // Success.
      res.render("pages/item_form", {
        title: "Update Item",
        page_title: "Update Item",
        categories: results.categories,
        item: results.item,
      });
    }
  )
};

// Handle Item update on POST
exports.item_update_post = [
  // Validate and sanitize the name field
  body("name", "Category name required").trim().isLength({ min: 1 }).escape(),
  body("price", "Price should be more than 0")
    .trim()
    .isFloat({ min: 0 })
    .escape(),
  body("number_in_stock", "Number in srock should be more than -1")
    .trim()
    .isInt({ min: 0 })
    .escape(),
  
// Process request after validation and sanitization
(req, res, next) => {
  // Extract the valdation errors from a request
  const errors = validationResult(req);

  // Get category ID for further saving
  async.parallel(
    {
      category(callback) {
        // get item info from database
        Category.findOne({ name: req.body.category }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        next(err);
      }

      // Create an item object wth escaped and trimmed data.
      const item = new Item({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        number_in_stock: req.body.number_in_stock,
        category: results.category._id,
        _id: req.params.id, // This is required, or a new ID will be assigned!
      });

      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        res.render("pages/index", {
          title: "Create Item",
          page_title: "Create Item",
          item: item,
          errors: errors.array(),
        });
        return;
      } else {
        // Date from form is valid
        Item.findByIdAndUpdate(req.params.id, item, {},  (err, theitem) => {
          if (err) {
            return next(err);
          }
          // Item saved. Redirect to item detail page
          res.redirect(theitem.url);
        });
      }


    }
  );

  // res.send(req.body);
},

]
