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
import { ip } from '../../src/Validations/string/ip'

function compile (options?: { version?: '4' | '6' }) {
  return ip.compile('literal', 'string', rules.ip(options).options)
}

test.group('IP Address', () => {
  validate(ip, test, '9999', '127.0.0.1', compile())

  test('ignore validation when value is not a valid string', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    ip.validate(null, compile().compiledOptions, {
      errorReporter: reporter,
      pointer: 'user_ip',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })

  test('report error when value fails the ip address validation', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    ip.validate('hello-22', compile().compiledOptions, {
      errorReporter: reporter,
      pointer: 'user_ip',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'user_ip',
      rule: 'ip',
      message: 'ip validation failed',
    }])
  })

  test('work fine when value passes the ip validation', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    ip.validate('127.0.0.1', compile().compiledOptions, {
      errorReporter: reporter,
      pointer: 'user_ip',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })

  test('report error when value fails the ipv6 address validation', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    ip.validate('127.0.0.1', compile({ version: '6' }).compiledOptions, {
      errorReporter: reporter,
      pointer: 'user_ip',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [{
      field: 'user_ip',
      rule: 'ip',
      message: 'ip validation failed',
    }])
  })

  test('work fine when value passes the ipv6 validation', (assert) => {
    const reporter = new ApiErrorReporter({}, false)
    ip.validate('2001:0db8:85a3:0000:0000:8a2e:0370:7334', compile({ version: '6' }).compiledOptions, {
      errorReporter: reporter,
      pointer: 'user_ip',
      tip: {},
      root: {},
      mutate: () => {},
    })

    assert.deepEqual(reporter.toJSON(), [])
  })
})
