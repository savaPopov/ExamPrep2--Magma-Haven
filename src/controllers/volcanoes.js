const { Router } = require('express');
const { create, getById, update, deleteById, voteVolcanoe } = require('../services/data');
const { body, validationResult } = require('express-validator');
const { isUser } = require('../middlewares/guards');
const { parseError } = require('../util');

const volcanoeRouter = Router()

volcanoeRouter.get('/create', isUser(), async (req, res) => {
  // let typesOfVolcano = ['Supervolcanoes', 'Submarine', 'Subglacial', 'Mud', 'Stratovolcanoes', 'Shield']
  // res.render('create', { typesOfVolcano })
  res.render('create')
})

volcanoeRouter.post('/create', isUser(),
  body('name').trim().isLength({ min: 2 }).withMessage('Name should be at least 2 charachters long'),
  body('location').trim().isLength({ min: 3 }).withMessage('Location must be at least 3 charachters long'),
  body('elevation').trim().isLength({ min: 0 }).withMessage('Elevation should be at least 2 charachters long'),
  body('lastEruption').trim().isInt({ min: 0, max: 2024 }).withMessage('The Year of Last Eruption should be between 0 and 2024'),
  body('typeVolcano').trim().isIn(['Supervolcanoes', 'Submarine', 'Subglacial', 'Mud', 'Stratovolcanoes', 'Shield']).withMessage('The type of the volcanoe must be between one of the choosen'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description should be at least 10 charachters long'),
  body('image').trim().isURL({ require_tld: false }).withMessage('Image must be a valid URL'),
  async (req, res) => {


    // let typesOfVolcano = ['Supervolcanoes', 'Submarine', 'Subglacial', 'Mud', 'Stratovolcanoes', 'Shield']


    try {
      const validation = validationResult(req)
      if (validation.errors.length) {
        throw validation.errors
      }
      const result = await create(req.body, req.user._id)
      res.redirect('/catalog')
    } catch (err) {

      // res.render('create', { data: req.body, typesOfVolcano, errors: parseError(err).errors })
      res.render('create', { data: req.body, errors: parseError(err).errors })
    }
  }
)

volcanoeRouter.get('/edit/:id', isUser(), async (req, res) => {
  const volcanoe = await getById(req.params.id)


  if (!volcanoe) {
    res.render('404')
  }

  const isOwner = req.user?._id == volcanoe.author.toString()

  if (!isOwner) {
    res.redirect('/login')
    return;
  }
  // console.log(vol)
  res.render('edit', { data: volcanoe })
})

volcanoeRouter.post('/edit/:id', isUser(),
  body('name').trim().isLength({ min: 2 }).withMessage('Name should be at least 2 charachters long'),
  body('location').trim().isLength({ min: 3 }).withMessage('Location must be at least 3 charachters long'),
  body('elevation').trim().isLength({ min: 0 }).withMessage('Elevation should be at least 2 charachters long'),
  body('lastEruption').trim().isInt({ min: 0, max: 2024 }).withMessage('The Year of Last Eruption should be between 0 and 2024'),
  body('typeVolcano').trim().isIn(['Supervolcanoes', 'Submarine', 'Subglacial', 'Mud', 'Stratovolcanoes', 'Shield']).withMessage('The type of the volcanoe must be between one of the choosen'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description should be at least 10 charachters long'),
  body('image').trim().isURL({ require_tld: false }).withMessage('Image must be a valid URL'),
  async (req, res) => {
    const volcanoeId = req.params.id
    const userId = req.user._id
    try {
      const validation = validationResult(req)

      if (validation.errors.length) {
        throw validation.errors
      }
      console.log(req.body)
      const result = await update(volcanoeId, req.body, userId)
      res.redirect('/catalog/' + volcanoeId)
    } catch (err) {
      res.render('create', { data: req.body, errors: parseError(err).errors })
    }
  }
)

volcanoeRouter.get('/delete/:id', isUser(), async (req, res) => {
  const volcanoeId = req.params.id
  const userId = req.user._id

  try {

    const result = await deleteById(volcanoeId, userId)
    res.redirect('/catalog')
  } catch (err) {
    res.redirect('/catalog/' + volcanoeId)
  }
}
)

volcanoeRouter.get('/vote/:id', isUser(), async (req, res) => {
  const volcanoeId = req.params.id
  const userId = req.user._id

  try {

    const result = await voteVolcanoe(volcanoeId, userId)
    res.redirect('/catalog/' + volcanoeId)
  } catch (err) {
    console.log(err)
    res.redirect('/')
  }
}
)



module.exports = {
  volcanoeRouter
}