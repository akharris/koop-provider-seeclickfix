# Koop SeeClickFix Provider

SeeClickFix API Documentation: http://dev.seeclickfix.com/
Koop Provider Documentation: https://koopjs.github.io/docs/specs/provider/

Koop Providers connect third-party APIs to both the GeoJSON and Esri Feature Services
ecosystems

## Files
- `index.js`: Main Koop Provider Export
- `model.js`: Translates remote API to GeoJSON

## Test it out
Run server:
- `npm install`
- `npm start`

Example API Query:
- `curl localhost:8080/seeclickfix/FeatureServer/0/query?returnCountOnly=true`

Tests:
- `npm test`

## With Docker

- `docker build -t koop-provider-seeclickfix .`
- `docker run -it -p 8080:8080 koop-provider-seeclickfix`
