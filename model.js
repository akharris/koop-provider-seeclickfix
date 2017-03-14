/*
  model.js

  This file is required. It must export a class with at least one public function called `getData`

  Documentation: http://koopjs.github.io/docs/specs/provider/
*/
const request = require('request').defaults({gzip: true, json: true})
const config = require('config')

function Model (koop) {}

// This is the only public function you need to implement
Model.prototype.getData = function (req, callback) {
  // Call the remote API with our developer key
 
  const reqUrl = `https://test.seeclickfix.com/api/v2/issues?place_url=${req.params.id}&per_page=100`
  //const key = config.seeclickfix.key
  request(reqUrl, (err, res, body) => {
    if (err) return callback(err)
    // translate the response into geojson
    const geojson = translate(body)
    // Cache data for half an hour
     geojson.ttl = 1800
    // hand off the data to Koop
    callback(null, geojson)
  })
}

function translate (input) {
  return {
    type: 'FeatureCollection',
    features: input.issues.map(formatFeature)
  }
}

function formatFeature (issue) {
  // Most of what we need to do here is extract the longitude and latitude
  var feature = {
    type: 'Feature',
    properties: {
      status: issue.status,
      summary: issue.summary,
      description: issue.description,
      rating: issue.rating,
      address: issue.address,
      url: issue.url,
      html_url: issue.html_url,
      comment_url: issue.comment_url,
      flag_url: issue.flag_url,
      reporter_name: issue.reporter.name,
      reporter_witty_title: issue.witty_title,
      reporter_role: issue.role,
      reporter_civic_points: issue.civic_points,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
      acknowledged_at: issue.acknowledged_at,
      closed_at: issue.closed_at,
      reopened_at: issue.reopened_at
    },
    geometry: issue.point // SeeClickFix rather conveniently has the GeoJSON-formatted geometry :-)
  }

  // Not all SeeClickFix features have a non-empty request_type attribute
  if (issue.request_type && issue.request_type.title) {
    feature.properties.request_type_title = issue.request_type.title
    feature.properties.request_type_url   = issue.request_type.url
    feature.properties.request_type_id    = issue.request_type.id
    feature.properties.request_type_related_issues_url   = issue.request_type.related_issues_url
  }
  // But we also want to translate a few of the date fields so they are easier to use downstream
  const dateFields = [
    'created_at', 
    'updated_at', 
    'acknoledged_at',
    'closed_at',
    'reopened_at'
  ]
  dateFields.forEach(field => {
    if (feature.properties[field]) {
      feature.properties[field] = new Date(feature.properties[field]).toISOString()
    }
  })
  return feature
}

module.exports = Model

/* Example raw API response
{ 
  "metadata": {
    "pagination": {
      "entries": 9389,
      "page": 1,
      "per_page": 20,
      "pages": 470,
      "next_page": 2,
      "next_page_url": "https://test.seeclickfix.com/api/v2/issues?page=2&place_url=district-of-columbia",
      "previous_page": null,
      "previous_page_url": null
    }
  },
  "issues": [{
    "id": 1316438,
    "status": "Open",
    "summary": "Alley Cleaning",
    "description": "yes",
    "rating": 1,
    "lat": 38.8916436374026,
    "lng": -77.0324480264505,
    "address": "188 Constitution Avenue Northwest Washington, District of Columbia",
    "created_at": "2016-09-26T09:45:24-04:00",
    "acknowledged_at": null,
    "closed_at": null,
    "reopened_at": null,
    "updated_at": "2016-09-26T09:45:24-04:00",
    "shortened_url": null,
    "media": {
      "video_url": null,
      "image_full": null,
      "image_square_100x100": null,
      "representative_image_url": "https://test.seeclickfix.com/assets/categories_trans/no-image-f2af6312d3b7cdc128b1c472da1e696af6827f90d98d4aedb5eb55d9f575537f.png"
    },
    "point": {
      "type": "Point",
      "coordinates": [
        -77.0324480264505,
        38.8916436374026
      ]
    },
    "url": "https://test.seeclickfix.com/api/v2/issues/1316438",
    "html_url": "https://test.seeclickfix.com/issues/1316438",
    "request_type": {
      "id": 483,
      "title": "Alley Cleaning",
      "url": "https://test.seeclickfix.com/api/v2/request_types/483",
      "related_issues_url": "https://test.seeclickfix.com/api/v2/issues.1316438?lat=38.8916436374026&lng=-77.0324480264505&request_types=483&sort=distance"
    },
    "comment_url": "https://test.seeclickfix.com/api/v2/issues/1316438/comments",
    "flag_url": "https://test.seeclickfix.com/api/v2/issues/1316438/flag",
    "transitions": {
      "close_url": "https://test.seeclickfix.com/api/v2/issues/1316438/close"
    },
    "reporter": {
      "id": 65773
      "name": "Tim",
      "witty_title": "City Fixer",
      "avatar": {
        "full": "https://test.seeclickfix.com/files/user_images/0002/5684/Screen_Shot_2016-05-03_at_11.25.40_PM.png",
        "square_100x100": "https://test.seeclickfix.com/files/user_images/0002/5684/Screen_Shot_2016-05-03_at_11.25.40_PM_square.png"
      }
    },
    "role": "Admin",
    "civic_points": 4795
  },
  { ... }
  ]
}
*/
