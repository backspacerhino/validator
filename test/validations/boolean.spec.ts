/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import test from 'japa'
import { rules } from '../../src/Rules'
import { validate } from '../fixtures/rules/index'
import { ApiErrorReporter } from '../../src/ErrorReporter'
import { boolean } from '../../src/Validations/primitives/boolean'

function compile () {
  return boolean.compile('literal', 'boolean', rules['boolean']().options)
}

test.group('boolean', () => {
  validate(boolean, test, 'hello', '0', compile())

  test('report error when value is not a valid boolean', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    boolean.validate(null, compile().compiledOptions, {
      errorReporter: reporter,
      pointer: 'terms',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'terms',
      rule: 'boolean',
      message: 'boolean validation failed',
    }])
  })

  test('cast positive numeric representation to a boolean', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    let value: any = 1

    boolean.validate(value, compile().compiledOptions, {
      errorReporter: reporter,
      pointer: 'terms',
      tip: {},
      root: {},
      mutate: (newValue) => {
        value = newValue
      },
    })

    assert.deepEqual(reporter.toJSON(), [])
    assert.equal(value, true)
  })

  test('cast positive string representation to a boolean', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    let value: any = '1'

    boolean.validate(value, compile().compiledOptions, {
      errorReporter: reporter,
      pointer: 'terms',
      tip: {},
      root: {},
      mutate: (newValue) => {
        value = newValue
      },
    })

    assert.deepEqual(reporter.toJSON(), [])
    assert.equal(value, true)
  })

  test('cast negative numeric representation to a boolean', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    let value: any = 0

    boolean.validate(value, compile().compiledOptions, {
      errorReporter: reporter,
      pointer: 'terms',
      tip: {},
      root: {},
      mutate: (newValue) => {
        value = newValue
      },
    })

    assert.deepEqual(reporter.toJSON(), [])
    assert.equal(value, false)
  })

  test('cast positive string representation to a boolean', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    let value: any = '0'

    boolean.validate(value, compile().compiledOptions, {
      errorReporter: reporter,
      pointer: 'terms',
      tip: {},
      root: {},
      mutate: (newValue) => {
        value = newValue
      },
    })

    assert.deepEqual(reporter.toJSON(), [])
    assert.equal(value, false)
  })

  test('work fine when value is a positive boolean', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    let value: any = true

    boolean.validate(value, compile().compiledOptions, {
      errorReporter: reporter,
      pointer: 'terms',
      tip: {},
      root: {},
      mutate: (newValue) => {
        value = newValue
      },
    })

    assert.deepEqual(reporter.toJSON(), [])
    assert.equal(value, true)
  })

  test('work fine when value is a negative boolean', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    let value: any = false

    boolean.validate(value, compile().compiledOptions, {
      errorReporter: reporter,
      pointer: 'terms',
      tip: {},
      root: {},
      mutate: (newValue) => {
        value = newValue
      },
    })

    assert.deepEqual(reporter.toJSON(), [])
    assert.equal(value, false)
  })
})
