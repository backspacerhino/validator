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
import { alpha } from '../../src/Validations/string/alpha'

function compile () {
  return alpha.compile('literal', 'string', rules.alpha().options)
}

test.group('Alpha', () => {
  validate(alpha, test, '9999', 'hello', compile())

  test('ignore validation when value is not a valid string', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    alpha.validate(null, compile().compiledOptions, {
      errorReporter: reporter,
      pointer: 'username',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })

  test('report error when value fails the alpha regex', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    alpha.validate('hello-22', compile().compiledOptions, {
      errorReporter: reporter,
      pointer: 'username',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'username',
      rule: 'alpha',
      message: 'alpha validation failed',
    }])
  })

  test('work fine when value passes the alpha regex', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    alpha.validate('hello', compile().compiledOptions, {
      errorReporter: reporter,
      pointer: 'username',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })
})
