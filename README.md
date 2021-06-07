# Webpack
base webpack setup with dynamic entries.

## Usage

Just copy this repository where needed for an easy and adjustable webpack setup.

## Entries

### Hardcoded
entries can be added by hand in `webpack/entries` or just use dynamic entries.


### Dynamic
Webpack will only scan for entries when you run a task so when you are running a watch task and add a new file it won't be found.

#### Style

add a `index.scss` in a directory and the map name will become the filename.
```
For example:
`./source/sass/modules/results/index.scss`

Will be turned in to
`modules/results.css`
```

#### Script

add a `index.js` in a directory and the map name will become the filename.
```
For example:
`./source/javascript/modules/results/index.js`

Will be turned in to
`modules/results.js`
```
