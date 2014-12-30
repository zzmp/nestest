nestest
=====

> Test nested node packages with `npm test`

## Use

If you write nested npm packages, it becomes a pain to test pushd into subpackages just to run `npm test`.
Instead, include `nestest` in the top packages nesting script, and `npm test` will be called on all nested subpackages!

```sh
  "scripts": {
    "test": "mocha test/test.js && nestest"
  },
```

## API

If you want to run other commands recursively on nested subpackages, take a look at `echo-name`. You can change both the command and the argument:

```js
var nestest = require('./index.js')

nestest.command = '/path/to/new/shell/command/to/execute/recursively'
nestest.args = ['-f'] // must be an array

// Simply call bootstrap when you're ready to roll!
nestest.bootstrap()
```

## Contributing

Be sure your tests pass by using `npm test`. Pull requests will be checked using [CircleCI](https://circleci.com/).

### TODO

- Allow capture of `stdout`/`stderr` for programmatic use.