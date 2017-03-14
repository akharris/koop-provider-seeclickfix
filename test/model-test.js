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
    t.equal(feature.properties.expires, new Date(1484268019000).toISOString(), 'translates expires field correctly')
    t.equal(feature.properties.expires, new Date(1484268019000).toISOString(), 'translates serviceDate field correctly')
    t.equal(feature.properties.expires, new Date(1484268019000).toISOString(), 'translates time field correctly')
    t.end()
  })
})
