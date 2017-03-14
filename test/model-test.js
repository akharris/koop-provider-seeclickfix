/*
  model-test.js

  Tests the main public function 'getData'
*/

const test = require('tape')
const model = require('../model')()
const nock = require('nock')

test('should properly fetch from the API and translate features', t => {
  nock('')
  .get('')
  .reply(200, require('./fixtures/input.json'))

  model.getData((err, geojson) => {
    t.error(err)
    t.equal(geojson.type, 'FeatureCollection', 'creates a feature collection object')
    t.ok(geojson.features, 'has features')
    const feature = geojson.features[0]
    t.equal(feature.type, 'Feature', 'has proper type')
    t.equal(feature.geometry.type, 'Point', 'creates point geometry')
    t.equal(feature.geometry.coordinates, [0, 0], 'translates geometry correctly')
    t.ok(feature.properties, 'creates attributes')

    const createdAt = feature.properties.created_at
    const updatedAt = feature.properties.updated_at

    t.equal(createdAt, '2016-09-26T09:45:24-04:00', 'translates created_at field correctly')
    t.equal(updatedAt, '2016-09-26T09:45:24-04:00', 'translates updated_at field correctly')
    t.end()
  })
})
