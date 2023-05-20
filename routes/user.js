var express = require('express');
var router = express.Router();
const {
  body,
  validationResult
} = require('express-validator');


let {
  Medicine
} = require('../models/medicine');


let {User} = require('../models/user');

/* GET home page. */
router.get('/', function (req, res, next) {

  Medicine.find({})
    .then(medicines => {
      res.render('index', {
        title: 'Medicines',
        medicines: medicines
      });
    })
    .catch(err => {
      console.log(err);
    });
});

router.get('/add', function (req, res) {
  res.render('add', {
    title: 'Add Medicine'
  })
});

router.post('/add', [
  body('name').notEmpty().withMessage('name is required'),
  body('price').notEmpty().withMessage('price is required'),
  body('details').notEmpty().withMessage('Details is required'),
], function (req, res) {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render('add', {
      title: 'Add Medicine',
      errors: errors.array()
    })
  } else {
    let medicine = new Medicine({
      name: req.body.name,
      price: req.body.price,
      details: req.body.details
    });
    medicine.save()
      .then(() => {
        req.flash('success', 'Medicine Updated')
        res.redirect('/');
      })
      .catch(err => {
        console.log(err);
        return;
      });
  }
});


router.get('/medicines/:id', (req, res) => {
  Medicine.findById(req.params.id)
    .then((medicine) => {
      res.render('medicine', {
        medicine: medicine
      })
    })
})

router.get('/medicines/edit/:id', (req, res) => {
  Medicine.findById(req.params.id)
    .then((medicine) => {
      res.render('edit', {
        title: 'Edit',
        medicine: medicine
      })
    })
})

router.post('/medicines/edit/:id', function (req, res) {
  let medicine = {};
  medicine.name = req.body.name;
  medicine.price = req.body.price;
  medicine.details = req.body.details;

  let query = {
    _id: req.params.id
  }
  Medicine.updateOne(query, medicine)
    .then(() => {
        req.flash('success', 'Medicine Updated')
        res.redirect('/'); 
    })
    .catch(err => {
      console.log(err);
      return;
    });
});


router.get('/medicines/delete/:id', function (req, res) {
  let medicine = new Medicine();
  medicine.name = req.body.name;
  medicine.price = req.body.price;
  medicine.details = req.body.details;
  let query = {
    _id: req.params.id
  };
  Medicine.deleteOne(query, medicine)
    .then(() => {
      res.redirect('/')
    })
    .catch(err => {
      console.log(err);
      return;
    });
});

router.get('/search', function(req, res) {
    res.render('search', { title: 'Search Medicines using Name,Details or Price' });
});
//get results in the medicine 
router.get('/search/data', async function(req, res) {
  console.log(req.query);
  try {
    const searchQuery = req.query.query;
    console.log(searchQuery);

    const medicines = await Medicine.find({
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { price: { $regex: searchQuery, $options: 'i' } },
        { details: { $regex: searchQuery, $options: 'i' } }
      ],
    });

    res.render('search-results', { title: 'Search Results', medicines }); 
  } catch (err) {
    console.error(err);
    res.render('error', { message: 'Error searching medicines', error: err });
  }
});





router.get('/login', function(req, res){
    res.render('login')
});

router.get('/logout', function(req, res){
    req.session.destroy = null;
        res.redirect('/login')
});

router.post('/login', async function(req, res){
    let query = {username: req.body.username, password: req.body.password};
    User.findOne(query)
    .then((query) => {
      if(query) {
        req.session.username = query.username;
        res.redirect('/');
      } else {
        req.flash('danger', 'Invalid Login')
        res.redirect('/login');
    }
    })
});



module.exports = router;
