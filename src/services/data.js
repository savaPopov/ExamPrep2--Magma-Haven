//TODO replace with real data service according to exam description

const { Data } = require('../models/Data')

async function getAll() {

  return Data.find().lean()
}

async function getById(id) {
  return Data.findById(id).lean()

}

function getRecent() {
  return Data.find().sort({ $natural: -1 }).limit(3).lean()
}
async function create(data, authorId) {
  //TODO extract properties from view model 
  const record = new Data({
    name: data.name,
    location: data.location,
    elevation: data.elevation,
    lastEruption: data.lastEruption,
    image: data.image,
    typeVolcano: data.typeVolcano,
    description: data.description,
    author: authorId
  })

  await record.save()

  return record
}

async function update(id, data, userId) {
  const record = await Data.findById(id)

  if (!record) {
    throw new ReferenceError('Record not found!' + id)
  }

  if (record.author.toString() != userId) {
    throw new Error('Access Denied!')
  }


  record.name = data.name
  record.location = data.location
  record.elevation = data.elevation
  record.lastEruption = data.lastEruption
  record.image = data.image
  record.typeVolcano = data.typeVolcano
  record.description = data.description


  await record.save()

  return record
}

async function deleteById(id, userId) {
  const record = await Data.findById(id)

  if (!record) {
    throw new ReferenceError('Record not found!' + id)
  }

  if (record.author.toString() != userId) {
    throw new Error('Access Denied!')
  }

  await Data.findByIdAndDelete(id)


}

async function voteVolcanoe(volcanoeId, userId) {
  const record = await Data.findById(volcanoeId)
  // console.log(record)
  if (!record) {
    throw new ReferenceError('Record not found!' + volcanoeId)
  }

  if (record.author.toString() == userId) {
    console.log('err1')
    throw new Error('Access Denied!')
  }

  if (record.votes.find(l => l.toString() == userId)) {
    console.log('err2')
    return
  }

  record.votes.push(userId)

  await record.save()

}


module.exports = {
  getAll,
  getById,
  update,
  deleteById,
  create,
  getRecent,
  voteVolcanoe
}