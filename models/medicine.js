// let mongoose = require('mongoose');


// let medicineSchema = mongoose.Schema({
//     title: {
//         type: String,
//         required: true
//     },
//     author: {
//         type: String,
//         required: true
//     },
//     body: {
//         type: String,
//         required: true
//     }
// });

// module.exports = mongoose.model('Medicine', medicineSchema);

let mongoose = require('mongoose');

let medicineSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  }
});

let Medicine = mongoose.model('Medicine', medicineSchema);

module.exports = { Medicine, medicineSchema };
