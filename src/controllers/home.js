const { Router } = require('express');
const { login } = require('../services/user');
const { createToken } = require('../services/jwt');
const { getAll, getById } = require('../services/data');

const homeRouter = Router()
//TODO replace with real router according to exam description

homeRouter.get('/', async (req, res) => {
  res.render('home')
})

homeRouter.get('/catalog', async (req, res) => {
  const volcanoes = await getAll()
  res.render('catalog', { volcanoes })
})

homeRouter.get('/catalog/:id', async (req, res) => {
  const volcanoe = await getById(req.params.id)

  if (!volcanoe) {
    res.render('404')
    return;
  }

  const isOwner = req.user?._id == volcanoe.author.toString()
  const hasVoted = Boolean(volcanoe.votes.find(l => req.user?._id == l.toString()))
  const numberVotes = volcanoe.votes.length
  console.log(numberVotes)

  res.render('details', { volcanoe, isOwner, hasVoted,numberVotes })
})



module.exports = {
  homeRouter
}