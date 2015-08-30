# vue-loader example

> Example using [vue-loader](https://github.com/vuejs/vue-loader) with [Webpack](http://webpack.github.io).

## Setup

``` bash
npm install
npm run dev
```

#### Configuring Global Pre-processors

You can apply loaders globally for a given language type in all your `*.vue` files. In this example we are applying the `babel-loader` to all JavaScript inside `*.vue` files with this [webpack config](webpack.config.js#L13-L16):

``` js
module: {
  loaders: [
    {
      test: /\.vue$/,
      loader: vue.withLoaders({
        // apply babel transform to all javascript
        // inside *.vue files.
        js: 'babel?optional[]=runtime'
      })
    }
  ]
}
```

Some explanations: 

1. Here `js` is the default language for `<script>` blocks.

2. The `?optional[]=runtime` query string passed to the loader. This instructs Babel to use helper functions from the `babel-runtime` NPM package instead of injecting the helpers into every single file. You'll want this most of the time.

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

> Requires `vue-loader` ^3.0.0

You can add the `scoped` attribute to a `<style>` block to make it scoped to the current component. Two things to take note:

1. When using `scoped`, you have to refer to the template root node as `:scope`. If the component template has multiple root-level nodes, `:scope` applies to all of them. So it is preferred to have a single root node when using scoped CSS.

2. Scoped CSS only prevents the styles from polluting the global CSS namespace; it does **not** prevent downward cascading, so it still may affect child components nested under the current one.

Example:

``` html
<style scoped>
:root {
  border: 1px solid red;
}
/* scoped to current component and its children */
.red {
  color: red;
}
</style>

<template>
  <div><!-- this should have red border -->
    <button class="red">This should be red</button>
  </div>
</template>
```
