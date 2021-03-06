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
import { requiredIfExists } from '../../src/Validations/existence/requiredIfExists'

function compile (field: string) {
  return requiredIfExists.compile('literal', 'string', rules.requiredIfExists(field).options)
}

test.group('Required If Exists', () => {
  validate(requiredIfExists, test, undefined, 'foo', compile('id'), {
    tip: { id: 1 },
  })

  test('do not compile when args are not defined', (assert) => {
    const fn = () => requiredIfExists.compile('literal', 'string')
    assert.throw(fn, 'requiredIfExists: The 3rd arguments must be a combined array of arguments')
  })

  test('do not compile when options are not defined', (assert) => {
    const fn = () => requiredIfExists.compile('literal', 'string', [])
    assert.throw(fn, 'requiredIfExists: expects a "field"')
  })

  test('compile with options', (assert) => {
    assert.deepEqual(requiredIfExists.compile('literal', 'string', ['id']), {
      name: 'requiredIfExists',
      allowUndefineds: true,
      async: false,
      compiledOptions: { field: 'id' },
    })
  })

  test('report error when expectation matches and field is null', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfExists.validate(null, compile('type').compiledOptions!, {
      errorReporter: reporter,
      pointer: 'profile_id',
      tip: {
        type: 'twitter',
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'profile_id',
      rule: 'requiredIfExists',
      message: 'requiredIfExists validation failed',
    }])
  })

  test('report error when expectation matches and field is null', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfExists.validate(undefined, compile('type').compiledOptions!, {
      errorReporter: reporter,
      pointer: 'profile_id',
      tip: {
        type: 'twitter',
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'profile_id',
      rule: 'requiredIfExists',
      message: 'requiredIfExists validation failed',
    }])
  })

  test('report error when expectation matches and field is empty string', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfExists.validate('', compile('type').compiledOptions!, {
      errorReporter: reporter,
      pointer: 'profile_id',
      tip: {
        type: 'twitter',
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'profile_id',
      rule: 'requiredIfExists',
      message: 'requiredIfExists validation failed',
    }])
  })

  test('work fine when target field is undefined', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfExists.validate('', compile('type').compiledOptions!, {
      errorReporter: reporter,
      pointer: 'profile_id',
      tip: {
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })

  test('work fine when target field is null', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfExists.validate('', compile('type').compiledOptions!, {
      errorReporter: reporter,
      pointer: 'profile_id',
      tip: {
        type: null,
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })

  test('work fine when expectation matches and field has value', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    requiredIfExists.validate('hello', compile('type').compiledOptions!, {
      errorReporter: reporter,
      pointer: 'profile_id',
      tip: {
        type: 'twitter',
      },
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })
})
