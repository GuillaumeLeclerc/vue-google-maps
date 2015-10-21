# vue-loader example

> Example using [vue-loader](https://github.com/vuejs/vue-loader) with [Webpack](http://webpack.github.io).

## Setup

``` bash
npm install
npm run dev
# go to http://localhost:8080/webpack-dev-server/
```

#### Configuring Global Pre-processors

You can apply loaders globally for a given language type in all your `*.vue` files. In this example we are applying the `babel-loader` to all JavaScript inside `*.vue` files with this [webpack config](build/webpack.dev.config.js#L16):

``` js
module: {
  loaders: [
    {
      test: /\.vue$/,
      loader: vue.withLoaders({
        // apply babel transform to all javascript
        // inside *.vue files.
        js: 'babel?optional[]=runtime&loose=true'
      })
    }
  ]
}
```

Some explanations:

1. Here `js` is the default language for `<script>` blocks.

2. The `?optional[]=runtime&loose=true` is a query string passed to the loader. This instructs Babel to use helper functions from the `babel-runtime` NPM package instead of injecting the helpers into every single file, and also transform the code in loose mode. You'll want this most of the time.

#### Using Per-file Pre-processors

If you only want to use pre-processors in a certain file, you can add an inline `lang` attribute to a language block:

``` html
<style lang="stylus">
  /* use stylus here */
</style>
```

Note you will have to install `stylus-loader` so that Webpack can handle the compilation. The `lang` attribute will be used to automatically locate the loader to use, and you can pass Webpack loader queries in it as well:

``` html
<style lang="sass?outputStyle=expanded">
  /* use sass here with expanded output */
</style>
```

#### Scoped CSS

> Experimental. Requires `vue-loader` ^4.0.0

You can add the `scoped` attribute to a `<style>` block to make it scoped to the current component. A few things to take note:

1. You can include both scoped and non-scoped styles in the same component.

2. A child component's root node will be affected by both the parent's scoped CSS and the child's scoped CSS.

3. Partials are not affected by scoped styles.
