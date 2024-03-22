import {body} from "express-validator";


export const loginAndEmailValidationAuth = body('loginOrEmail')
    .trim()
    .exists()
    .custom((value) => typeof value === 'string')
    .withMessage('Incorrect loginOrEmail')