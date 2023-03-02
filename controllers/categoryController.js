const Category = require("../models/category");
const Item = require("../models/item");

// async library to work with asynchronous operations
const async = require("async");

// express-validator module to sanitize forms
const { body, validationResult } = require("express-validator");
const category = require("../models/category");

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
exports.category_detail = (req, res, next) => {
  async.parallel(
    {
      category(callback) {
        // get given category's info from database
        Category.findById(req.params.id).exec(callback);
      },

      category_items(callback) {
        // get items that contain the given category in their category array
        Item.find({ category: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.category == null) {
        // No results.
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
      }
      console.log(results.category_items);
      // Successful, so render
      res.render("pages/category_detail", {
        page_title: "Category Detail",
        title: results.category.name,
        category: results.category,
        item_list: results.category_items,
      });
    }
  );
};

// Display Category create from GET
exports.category_create_get = (req, res, next) => {
  res.render("pages/category_form", {
    title: "Create category",
    page_title: "Create category",
  });
};

// Handle Category create on POST.
exports.category_create_post = [
  // Validate and sanitize the name field.
  body("name", "Category name required").trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a category object with escaped and trimmed data.
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("pages/category_form", {
        title: "Create Category",
        page_title: "Create Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Category with same name already exists.
      Category.findOne({ name: req.body.name }).exec((err, found_category) => {
        if (err) {
          return next(err);
        }

        if (found_category) {
          // Category exists, redirect to its detail page.
          res.redirect(found_category.url);
        } else {
          category.save((err) => {
            if (err) {
              return next(err);
            }
            // Category saved. Redirect to category detail page.
            res.redirect(category.url);
          });
        }
      });
    }
  },
];

// Display Category delete form on GET
exports.category_delete_get = (req, res, next) => {
  async.parallel(
    {
      category(callback) {
        Category.findById(req.params.id).exec(callback);
      },
      categorys_items(callback) {
        Item.find({ category: req.params.id }).exec(callback);
      },
    },

    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.category == null) {
        // No results.
        res.redirect("/catalog/category");
      }

      // Successful, so render.
      res.render("pages/category_delete", {
        title: "Delete Category",
        page_title: "Delete Category",
        category: results.category,
        categorys_items: results.categorys_items,
      });
    }
  );
};

// Handle Category delete on POST
exports.category_delete_post = (req, res, next) => {
  async.parallel(
    {
      category(callback) {
        Category.findById(req.params.id).exec(callback);
      },
      categorys_items(callback) {
        Item.find({ category: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      // Success
      if (results.categorys_items.length > 0) {
        // Category has items. Render in same way as for GET route.
        res.render("pages/category_delete", {
          title: "Delete Category",
          page_title: "Delete Category",
          category: results.category,
          categorys_items: results.categorys_items,
        });
        return;
      }
      // Category has no items. Delete object and redirect to the list of categories.
      Category.findByIdAndRemove(req.body.categoryid, (err) => {
        if (err) {
          return next(err);
        }
        // Success - go to author list
        res.redirect("/catalog/category");
      });
    }
  );
};

// Display Category update form on GET.
exports.category_update_get = (req, res, next) => {
  // Get category for form
  async.parallel(
    {
      category(callback) {
        Category.findById(req.params.id).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.category == null) {
        // No results.
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
      }

      // Success.
      res.render("pages/category_form", {
        title: "Update Category",
        page_title: "Update Category",
        category: results.category,
      });
    }
  );
};

// Handle Category update on POST
exports.category_update_post = [
  // Validate and sanitize the name field.
  body("name", "Category name required").trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a category object with escaped and trimmed data.
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id, //This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("pages/category_form", {
        title: "Create Category",
        page_title: "Create Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the recors
      Category.findByIdAndUpdate(req.params.id, category, {}, (err, thecategory) => {
        if (err) {
          return next(err);
        }
  
        // Successful: redirect to book detail page.
        res.redirect(thecategory.url);
      });

    }
  },
];
