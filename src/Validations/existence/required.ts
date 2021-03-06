/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { SyncValidation } from '@ioc:Adonis/Core/Validator'
import { exists } from '../../Validator/helpers'

const RULE_NAME = 'required'
const DEFAULT_MESSAGE = 'required validation failed'

/**
 * Ensure the value exists. `null`, `undefined` and `empty string`
 * fails the validation
 */
export const required: SyncValidation = {
  compile () {
    return {
      allowUndefineds: true,
      async: false,
      name: RULE_NAME,
      compiledOptions: undefined,
    }
  },
  validate (value, _, { errorReporter, pointer, arrayExpressionPointer }) {
    if (!exists(value)) {
      errorReporter.report(pointer, RULE_NAME, DEFAULT_MESSAGE, arrayExpressionPointer)
    }
  },
}
