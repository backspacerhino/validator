/*
* @adonisjs/validator
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import test from 'japa'
import { Socket } from 'net'
import { IncomingMessage, ServerResponse } from 'http'
import { FakeLogger } from '@adonisjs/logger/build/standalone'
import { Profiler } from '@adonisjs/profiler/build/standalone'
import { RequestConstructorContract } from '@ioc:Adonis/Core/Request'
import { HttpContext, Request } from '@adonisjs/http-server/build/standalone'

import { schema } from '../src/Schema'
import { validator } from '../src/Validator'
import extendRequest from '../src/Bindings/Request'

test.group('Request validator', (group) => {
  group.before(() => {
    extendRequest(Request as unknown as RequestConstructorContract, validator.validate)
  })

  test('choose api reporter when accept header is application/json', async (assert) => {
    assert.plan(1)

    const req = new IncomingMessage(new Socket())
    const res = new ServerResponse(req)
    const logger = new FakeLogger({ enabled: true, name: 'adonisjs', level: 'trace' })
    const profiler = new Profiler(__dirname, logger, {})

    const ctx = HttpContext.create('/', {}, logger, profiler.create(''), {}, req, res)
    ctx.request.request.headers.accept = 'application/json'
    ctx.request.allFiles = function () {
      return {}
    }

    try {
      await ctx.request.validate({
        schema: validator.compile(schema.create({
          username: schema.string(),
        })),
      })
    } catch (error) {
      assert.deepEqual(error.messages, [{
        rule: 'required',
        message: 'required validation failed',
        field: 'username',
      }])
    }
  })

  test('choose jsonapi reporter when accept header is application/vnd.api+json', async (assert) => {
    assert.plan(1)

    const req = new IncomingMessage(new Socket())
    const res = new ServerResponse(req)
    const logger = new FakeLogger({ enabled: true, name: 'adonisjs', level: 'trace' })
    const profiler = new Profiler(__dirname, logger, {})

    const ctx = HttpContext.create('/', {}, logger, profiler.create(''), {}, req, res)
    ctx.request.request.headers.accept = 'application/vnd.api+json'
    ctx.request.allFiles = function () {
      return {}
    }

    try {
      await ctx.request.validate({
        schema: validator.compile(schema.create({
          username: schema.string(),
        })),
      })
    } catch (error) {
      assert.deepEqual(error.messages, {
        errors: [{
          code: 'required',
          detail: 'required validation failed',
          source: {
            pointer: 'username',
          },
        }],
      })
    }
  })

  test('choose vanilla reporter when no accept header is set', async (assert) => {
    assert.plan(1)

    const req = new IncomingMessage(new Socket())
    const res = new ServerResponse(req)
    const logger = new FakeLogger({ enabled: true, name: 'adonisjs', level: 'trace' })
    const profiler = new Profiler(__dirname, logger, {})

    const ctx = HttpContext.create('/', {}, logger, profiler.create(''), {}, req, res)
    ctx.request.allFiles = function () {
      return {}
    }

    try {
      await ctx.request.validate({
        schema: validator.compile(schema.create({
          username: schema.string(),
        })),
      })
    } catch (error) {
      assert.deepEqual(error.messages, {
        username: ['required validation failed'],
      })
    }
  })

  test('profile using the profiler', async (assert) => {
    assert.plan(3)

    const req = new IncomingMessage(new Socket())
    const res = new ServerResponse(req)
    const logger = new FakeLogger({ enabled: true, name: 'adonisjs', level: 'trace' })
    const profiler = new Profiler(__dirname, logger, { enabled: true })
    profiler.process((packet) => {
      if (packet.type === 'action') {
        assert.deepEqual(packet.data, { status: 'error' })
        assert.exists(packet.parent_id)
        assert.equal(packet.label, 'request:validate')
      }
    })

    const httpRow = profiler.create('http')
    const ctx = HttpContext.create('/', {}, logger, profiler.create('http'), {}, req, res)
    ctx.request.allFiles = function () {
      return {}
    }

    try {
      await ctx.request.validate({
        schema: validator.compile(schema.create({
          username: schema.string(),
        })),
      })
    } catch {}

    httpRow.end()
  })
})
