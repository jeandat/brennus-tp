
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

### Material Design Icons

#### What we do today

Right now, we are using the simple solution with Materialize, i.e. we are importing the whole font with an @font-face instruction.
The font is imported from [Material Icons] instead of [Material Design Icons] for quick npm installs.

We can then reference any icon very elegantly like that:

```html
<i class="material-icons">add</i>
```

The solution is very simple and elegant but it has it cost:

- the web font in its best optimised format (woff2) weight 44KB

#### What we might do

We could create an [SVG sprite] to compile and serve only icons we use:

- the weight would be much more lighter
- we could work without an internet connection

Consequences:

- usage will be less elegant with svg code: `<svg class="svg-24px"><use xlink:href="MaterialIcons.svg#ic_face_24px"></use></svg>`
- a build task must be added to create the sprite
- compatibility will reduce: Internet Explorer, Edge, and older Android and iOS browsers cannot use external svg files

For now, I recommend to wait and observe our constraints before choosing a solution: browsers, connection, …

[SVG sprite]: https://github.com/google/material-design-icons/tree/master/sprites
[Material Design Icons]: https://github.com/google/material-design-icons
[Material Icons]: https://github.com/marella/material-icons

