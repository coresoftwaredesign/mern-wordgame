/**
 * @openapi
 * components:
 *    schemas:
 *      validationResponse:
 *        properties:
 *          isValid:
 *            type: boolean
 *            required: true
 *          match:
 *            type: array
 *            description: 1 - not in word, 2 - in word, 3 - match
 *            items:
 *              type: integer
 *              example: [1,1,2,3,1]
 *          isDone:
 *            type: boolean
 *          message:
 *            type: string
 */
