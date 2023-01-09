#! /usr/bin/env node

console.log(
  "This script populates some test item and categories to the database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/?retryWrites=true&w=majority"
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require("async");
var Item = require("./models/item");
var Category = require("./models/category");

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));



let items = [];
let categories = [];

function itemCreate(name, description, price, number_in_stock, category, cb) {
  itemDetail = {
    name: name,
    description: description,
    price: price,
    number_in_stock: number_in_stock,
    category: category,
  };

  const item = new Item(itemDetail);

  item.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }

    console.log("New Item: " + item);
    items.push(item);
    cb(null, item);
  });
}

function categoryCreate(name, description, cb) {
  const category = new Category({ name: name, description: description });

  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }

    console.log("New Category: " + category);

    categories.push(category);
    cb(null, category);
  });
}

function createCategories(cb) {
  async.series(
    [
      function (callback) {
        categoryCreate(
          "Tablets",
          "A tablet computer, commonly shortened to tablet, is a mobile device, typically with a mobile operating system and touchscreen display processing circuitry, and a rechargeable battery in a single, thin and flat package.",
          callback
        );
      },
      function (callback) {
        categoryCreate(
          "Smartphones",
          "A smartphone is a portable computer device that combines mobile telephone and computing functions into one unit. They are distinguished from feature phones by their stronger hardware capabilities and extensive mobile operating systems, which facilitate wider software, internet (including web browsing over mobile broadband), and multimedia functionality (including music, video, cameras, and gaming), alongside core phone functions such as voice calls and text messaging.",
          callback
        );
      },
      function (callback) {
        categoryCreate(
          "Headphones",
          "Headphones are a pair of small loudspeaker drivers worn on or around the head over a user's ears.",
          callback
        );
      },
      function (callback) {
        categoryCreate(
          "Headphones",
          "Headphones are a pair of small loudspeaker drivers worn on or around the head over a user's ears.",
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

function createItems(cb) {
  async.parallel([
    function (callback) {
      itemCreate(
        "iPad Pro 2018",
        "The third generation of iPad Pro was announced on October 30, 2018, and was made available in two screen sizes: 11-inch (28 cm) and 12.9-inch (33 cm). They feature full-screen displays, with the 11-inch model replacing the 10.5-inch model of the previous generation. They also feature up to 1 TB of storage and Face ID using a sensor array on the top bezel which, unlike iPhone models featuring Face ID, can unlock the iPad in any orientation. The home button was completely removed in favor of a larger display.",
        999,
        144,
        categories[0],
        callback
      );
    },
    function (callback) {
      itemCreate(
        "Samsung Galaxy Tab S",
        "The Samsung Galaxy Tab S8 is a series of Android-based tablets designed, developed and marketed by Samsung Electronics. Unveiled at Samsung's Galaxy Unpacked event on 9 February 2022, they serve as the successor to the Galaxy Tab S7 series.",
        899,
        44,
        categories[0],
        callback
      );
    },
    function (callback) {
      itemCreate(
        "Xiaomi Mi Pad 5",
        "Xiaomi Pad 5 is a line of Android-based tablet computers manufactured by Xiaomi. It was announced on August 10, 2021 with Xiaomi MIX 4",
        399,
        97,
        categories[0],
        callback
      );
    },
    function (callback) {
      itemCreate(
        "iPhone 13 mini",
        "The iPhone 13 mini is the best iPhone for those who want a smaller device on Apple’s iOS platform. In fact, it’s arguably still the best small phone on the market. It’s powerful, the camera is top-tier, and the battery life is better than that of the iPhone 12 mini. It isn’t the best iPhone outright, but if you’re looking for a smaller device then you’re in luck.",
        599,
        432,
        categories[1],
        callback
      );
    },
    function (callback) {
      itemCreate(
        "Pixel 7",
        "The iPhone 13 mini is the best iPhone for those who want a smaller device on Apple’s iOS platform. In fact, it’s arguably still the best small phone on the market. It’s powerful, the camera is top-tier, and the battery life is better than that of the iPhone 12 mini. It isn’t the best iPhone outright, but if you’re looking for a smaller device then you’re in luck.",
        579,
        132,
        categories[1],
        callback
      );
    },
    function (callback) {
      itemCreate(
        "Airpods Pro",
        "AirPods Pro are wireless Bluetooth in-ear headphones designed by Apple, initially released on October 30, 2019. They are Apple's mid-range wireless headphones, sold alongside the base-level AirPods and highest-end AirPods Max.",
        159,
        232,
        categories[2],
        callback
      );
    },
    function (callback) {
      itemCreate(
        "SONY WF-1000XM3",
        "Truly wireless headphones with industry-leading noise cancellation, Bluetooth®, NFC connectivity and all-day battery life.",
        179,
        52,
        categories[2],
        callback
      );
    },
  ]);
}

// function createBooks(cb) {
//   async.parallel(
//     [
//       function (callback) {
//         bookCreate(
//           "The Name of the Wind (The Kingkiller Chronicle, #1)",
//           "I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during day. I have talked to Gods, loved women, and written songs that make the minstrels weep.",
//           "9781473211896",
//           authors[0],
//           [genres[0]],
//           callback
//         );
//       },
//       function (callback) {
//         bookCreate(
//           "The Wise Man's Fear (The Kingkiller Chronicle, #2)",
//           "Picking up the tale of Kvothe Kingkiller once again, we follow him into exile, into political intrigue, courtship, adventure, love and magic... and further along the path that has turned Kvothe, the mightiest magician of his age, a legend in his own time, into Kote, the unassuming pub landlord.",
//           "9788401352836",
//           authors[0],
//           [genres[0]],
//           callback
//         );
//       },
//       function (callback) {
//         bookCreate(
//           "The Slow Regard of Silent Things (Kingkiller Chronicle)",
//           "Deep below the University, there is a dark place. Few people know of it: a broken web of ancient passageways and abandoned rooms. A young woman lives there, tucked among the sprawling tunnels of the Underthing, snug in the heart of this forgotten place.",
//           "9780756411336",
//           authors[0],
//           [genres[0]],
//           callback
//         );
//       },
//       function (callback) {
//         bookCreate(
//           "Apes and Angels",
//           "Humankind headed out to the stars not for conquest, nor exploration, nor even for curiosity. Humans went to the stars in a desperate crusade to save intelligent life wherever they found it. A wave of death is spreading through the Milky Way galaxy, an expanding sphere of lethal gamma ...",
//           "9780765379528",
//           authors[1],
//           [genres[1]],
//           callback
//         );
//       },
//       function (callback) {
//         bookCreate(
//           "Death Wave",
//           "In Ben Bova's previous novel New Earth, Jordan Kell led the first human mission beyond the solar system. They discovered the ruins of an ancient alien civilization. But one alien AI survived, and it revealed to Jordan Kell that an explosion in the black hole at the heart of the Milky Way galaxy has created a wave of deadly radiation, expanding out from the core toward Earth. Unless the human race acts to save itself, all life on Earth will be wiped out...",
//           "9780765379504",
//           authors[1],
//           [genres[1]],
//           callback
//         );
//       },
//       function (callback) {
//         bookCreate(
//           "Test Book 1",
//           "Summary of test book 1",
//           "ISBN111111",
//           authors[4],
//           [genres[0], genres[1]],
//           callback
//         );
//       },
//       function (callback) {
//         bookCreate(
//           "Test Book 2",
//           "Summary of test book 2",
//           "ISBN222222",
//           authors[4],
//           false,
//           callback
//         );
//       },
//     ],
//     // optional callback
//     cb
//   );
// }

// function genreCreate(name, cb) {
//   var genre = new Genre({ name: name });

//   genre.save(function (err) {
//     if (err) {
//       cb(err, null);
//       return;
//     }
//     console.log("New Genre: " + genre);
//     genres.push(genre);
//     cb(null, genre);
//   });
// }

// function authorCreate(first_name, family_name, d_birth, d_death, cb) {
//   authordetail = { first_name: first_name, family_name: family_name };

//   if (d_birth != false) authordetail.date_of_birth = d_birth;
//   if (d_death != false) authordetail.date_of_death = d_death;

//   var author = new Category(authordetail);

//   author.save(function (err) {
//     if (err) {
//       cb(err, null);
//       return;
//     }
//     console.log("New Author: " + author);
//     authors.push(author);
//     cb(null, author);
//   });
// }

// function bookCreate(title, summary, isbn, author, genre, cb) {
//   bookdetail = {
//     title: title,
//     summary: summary,
//     author: author,
//     isbn: isbn,
//   };
//   if (genre != false) bookdetail.genre = genre;

//   var book = new Item(bookdetail);
//   book.save(function (err) {
//     if (err) {
//       cb(err, null);
//       return;
//     }
//     console.log("New Book: " + book);
//     books.push(book);
//     cb(null, book);
//   });
// }

// function bookInstanceCreate(book, imprint, due_back, status, cb) {
//   bookinstancedetail = {
//     book: book,
//     imprint: imprint,
//   };
//   if (due_back != false) bookinstancedetail.due_back = due_back;
//   if (status != false) bookinstancedetail.status = status;

//   var bookinstance = new BookInstance(bookinstancedetail);
//   bookinstance.save(function (err) {
//     if (err) {
//       console.log("ERROR CREATING BookInstance: " + bookinstance);
//       cb(err, null);
//       return;
//     }
//     console.log("New BookInstance: " + bookinstance);
//     bookinstances.push(bookinstance);
//     cb(null, book);
//   });
// }

// function createGenreAuthors(cb) {
//   async.series(
//     [
//       function (callback) {
//         authorCreate("Patrick", "Rothfuss", "1973-06-06", false, callback);
//       },
//       function (callback) {
//         authorCreate("Ben", "Bova", "1932-11-8", false, callback);
//       },
//       function (callback) {
//         authorCreate("Isaac", "Asimov", "1920-01-02", "1992-04-06", callback);
//       },
//       function (callback) {
//         authorCreate("Bob", "Billings", false, false, callback);
//       },
//       function (callback) {
//         authorCreate("Jim", "Jones", "1971-12-16", false, callback);
//       },
//       function (callback) {
//         genreCreate("Fantasy", callback);
//       },
//       function (callback) {
//         genreCreate("Science Fiction", callback);
//       },
//       function (callback) {
//         genreCreate("French Poetry", callback);
//       },
//     ],
//     // optional callback
//     cb
//   );
// }

// function createBookInstances(cb) {
//   async.parallel(
//     [
//       function (callback) {
//         bookInstanceCreate(
//           books[0],
//           "London Gollancz, 2014.",
//           false,
//           "Available",
//           callback
//         );
//       },
//       function (callback) {
//         bookInstanceCreate(
//           books[1],
//           " Gollancz, 2011.",
//           false,
//           "Loaned",
//           callback
//         );
//       },
//       function (callback) {
//         bookInstanceCreate(
//           books[2],
//           " Gollancz, 2015.",
//           false,
//           false,
//           callback
//         );
//       },
//       function (callback) {
//         bookInstanceCreate(
//           books[3],
//           "New York Tom Doherty Associates, 2016.",
//           false,
//           "Available",
//           callback
//         );
//       },
//       function (callback) {
//         bookInstanceCreate(
//           books[3],
//           "New York Tom Doherty Associates, 2016.",
//           false,
//           "Available",
//           callback
//         );
//       },
//       function (callback) {
//         bookInstanceCreate(
//           books[3],
//           "New York Tom Doherty Associates, 2016.",
//           false,
//           "Available",
//           callback
//         );
//       },
//       function (callback) {
//         bookInstanceCreate(
//           books[4],
//           "New York, NY Tom Doherty Associates, LLC, 2015.",
//           false,
//           "Available",
//           callback
//         );
//       },
//       function (callback) {
//         bookInstanceCreate(
//           books[4],
//           "New York, NY Tom Doherty Associates, LLC, 2015.",
//           false,
//           "Maintenance",
//           callback
//         );
//       },
//       function (callback) {
//         bookInstanceCreate(
//           books[4],
//           "New York, NY Tom Doherty Associates, LLC, 2015.",
//           false,
//           "Loaned",
//           callback
//         );
//       },
//       function (callback) {
//         bookInstanceCreate(books[0], "Imprint XXX2", false, false, callback);
//       },
//       function (callback) {
//         bookInstanceCreate(books[1], "Imprint XXX3", false, false, callback);
//       },
//     ],
//     // Optional callback
//     cb
//   );
// }

async.series(
  [createCategories, createItems],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log("Categories: " + categories);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
