/*
|--------------------------------------------------------------------------
| Benchmarking AdonisJs Validator
|--------------------------------------------------------------------------
|
| The following benchmark tests AdonisJS against community popular validators.
| The benchmark focuses on validating a nested object.
|
*/

import Joi from '@hapi/joi'
import { Suite } from 'benchmark'
import { validateOrReject, ValidateNested, IsString } from 'class-validator'
import { validateAll, schema as indicativeSchema } from 'indicative/validator'

import { validator } from '../src/Validator'
import { schema } from '../src/Schema'

/**
 * Adonis pre compiled validation function
 */
const adonisValidate = validator.compile(schema.create({
  username: schema.string(),
  name: schema.string(),
  profiles: schema.array().members(schema.object().members({
    profileId: schema.string(),
  })),
}))

/**
 * Joi pre compile validation function
 */
const joiValidate = Joi.object({
  username: Joi.string().required(),
  name: Joi.string().required(),
  profiles: Joi.array().items(Joi.object({
    profileId: Joi.string().required(),
  }).required()).required(),
})

/**
 * Class validator from Typescript. Sadly, they don't have any
 * pre compling option, so it's unfair to benchark it against
 * be pre compiled code. However, we still keep it, coz it
 * has first class typescript support and so does AdonisJS
 * validator.
 */
class Profile {
  @IsString()
  public profileId: string
}

class User {
  @IsString()
  public username: string

  @IsString()
  public name: string

  @ValidateNested()
  public profile: Profile[]
}

/**
 * Indicative schema
 */
const indicativeCompiled = indicativeSchema.new({
  username: indicativeSchema.string(),
  name: indicativeSchema.string(),
  profiles: indicativeSchema.array().members(indicativeSchema.object().members({
    profileId: indicativeSchema.string(),
  })),
})

/**
 * Indicative doesn't have a pre-compile function. However, validting
 * once with a cache key caches the compiled schema
 */
validateAll({
  username: 'virk',
  name: 'Virk',
  profiles: [{
    profileId: 'virk011',
  }],
}, indicativeCompiled, {}, {
  cacheKey: 'nested-object',
})

type Deferred = { resolve (): any }

/**
 * Starting benchmark
 */
new Suite()
  .add('AdonisJS', {
    defer: true,
    fn (deferred: Deferred) {
      validator.validate({
        schema: adonisValidate,
        data: {
          username: 'virk',
          name: 'Virk',
          profiles: [{
            profileId: 'virk011',
          }],
        },
      }).then(() => deferred.resolve())
    },
  })
  .add('Joi', {
    defer: true,
    fn (deferred: Deferred) {
      joiValidate.validateAsync({
        username: 'virk',
        name: 'Virk',
        profiles: [{
          profileId: 'virk011',
        }],
      }).then(() => deferred.resolve())
    },
  })
  .add('Indicative', {
    defer: true,
    fn (deferred: Deferred) {
      validateAll({
        username: 'virk',
        name: 'Virk',
        profiles: [{
          profileId: 'virk011',
        }],
      }, indicativeCompiled, {}, {
        cacheKey: 'nested-object',
      }).then(() => deferred.resolve())
    },
  })
  .add('Class Validator', {
    defer: true,
    fn (deferred: Deferred) {
      const user = new User()
      const profile = new Profile()
      profile.profileId = 'virk011'

      user.name = 'Virk'
      user.username = 'virk'
      user.profile = [profile]
      validateOrReject(user).then(() => deferred.resolve())
    },
  })
  .on('cycle', function cycle (event: any) {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ 'async': true })
