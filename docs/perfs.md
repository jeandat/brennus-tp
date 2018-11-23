
# Performance hints

## Analysing bundles content

There is two tools in dev dependencies that may help analyse and understand what is encapsulated in each bundle.

You need first to build in production mode with some flags on to generate a few statistics:

```bash
npm run build:stats
```

Then you may analyse each report with the tool of your choice.

### webpack-bundle-analyzer

This module will help you:

- Realize what's really inside your bundle
- Find out what modules make up the most of its size
- Find modules that got there by mistake
- Optimize it!

A few notes:

- This module is compatible with minified bundles!
- It parses them to get real size of bundled modules
- It also shows their gzipped sizes
- Tree map is zoomable

```bash
# Show a global tree map including all bundles
npx webpack-bundle-analyzer dist/brennus-tp/stats.json
```

As a shortcut for WBA, you can run:

```bash
npm run stats
```

### source-map-explorer

More or less like webpack-bundle-analyzer except that:

- it only works with one bundle at a time
- it works with css bundles too!
- it gives you an incremental percentage value per level of encapsulation

```bash
npx source-map-explorer dist/brennus-tp/main.*.js dist/brennus-tp/main.*.js.map

# Works with css too
npx source-map-explorer dist/brennus-tp/styles.*.css dist/brennus-tp/styles.*.css.map
```


## Possible optimisations

TODO
