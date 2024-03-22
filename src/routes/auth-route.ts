import {Response, Router} from "express";
import {RequestWithBody} from "../allTypes/RequestWithBody";
import {errorValidationBlogs} from "../middlewares/blogsMiddelwares/errorValidationBlogs";
import {STATUS_CODE} from "../common/constant-status-code";
import {loginAndEmailValidationAuth} from "../middlewares/authMiddleware/loginAndEmailValidationAuth";
import {passwordValidationAuth} from "../middlewares/authMiddleware/passwordValidationAuth";
import {AuthCodeConfirmationModel, AuthEmailModel, AuthModel, AuthRegistrationModel} from "../allTypes/authTypes";
import {authService} from "../servisces/auth-service";
import {tokenJwtServise} from "../servisces/token-jwt-service";
import {authTokenMiddleware} from "../middlewares/authMiddleware/authTokenMiddleware";
import {userMaperForMeRequest} from "../mapers/userMaperForMeRequest";
import {loginValidationUsers} from "../middlewares/usersMiddlewares/loginValidationUsers";
import {passwordValidationUsers} from "../middlewares/usersMiddlewares/passwordValidationUsers";
import {emailValidationUsers} from "../middlewares/usersMiddlewares/emailValidationUsers";
import {codeConfirmationValidation} from "../middlewares/authMiddleware/codeConfirmationValidation";
import {isConfirmedFlagValidation} from "../middlewares/authMiddleware/isConfirmedFlagValidation";
import {isExistLoginValidator} from "../middlewares/authMiddleware/isExistLoginValidator";
import {isExistEmailValidation} from "../middlewares/authMiddleware/isExistEmailValidation";


export const authRoute = Router({})

const postValidationAuth = () => [loginAndEmailValidationAuth, passwordValidationAuth]

const postValidationForRegistration = () => [loginValidationUsers, passwordValidationUsers, emailValidationUsers,isExistLoginValidator,isExistEmailValidation]


authRoute.post('/login', postValidationAuth(), errorValidationBlogs, async (req: RequestWithBody<AuthModel>, res: Response) => {
    try {

        const idUser = await authService.findUserInDataBase(req.body)

        if (idUser) {

            const token = await tokenJwtServise.createTokenJwt(idUser)
            const answer = {"accessToken": token}

            res.status(STATUS_CODE.SUCCESS_200).send(answer)

        } else {
            res.sendStatus(STATUS_CODE.UNAUTHORIZED_401)
        }

    } catch (error) {
        console.log('auth-routes.ts /login' + error)
    }
})


authRoute.get('/me', authTokenMiddleware, async (req: any, res: Response) => {
    try {

        const userModel = await userMaperForMeRequest(req.userIdLoginEmail)
        res.status(STATUS_CODE.SUCCESS_200).send(userModel)

    } catch (error) {
        console.log(' FIlE auth-routes.ts /me' + error)
        res.sendStatus(STATUS_CODE.SERVER_ERROR_500)
    }
})


authRoute.post('/registration', postValidationForRegistration(), errorValidationBlogs, async (req: RequestWithBody<AuthRegistrationModel>, res: Response) => {
    try {
        await authService.registerUser(req.body.login,req.body.email,req.body.password)

        res.sendStatus(STATUS_CODE.NO_CONTENT_204)

    } catch (error) {
        console.log(' FIlE auth-routes.ts /registration' + error)
        res.sendStatus(STATUS_CODE.SERVER_ERROR_500)
    }
})




authRoute.post('/registration-confirmation', codeConfirmationValidation,errorValidationBlogs,async (req: RequestWithBody<AuthCodeConfirmationModel>, res: Response) => {
    try {
        await authService.updateConfirmationCode(req.body.code)

        res.sendStatus(STATUS_CODE.NO_CONTENT_204)

    } catch (error) {
        console.log(' FIlE auth-routes.ts /registration-confirmation' + error)
        res.sendStatus(STATUS_CODE.SERVER_ERROR_500)
    }
})



authRoute.post('/registration-email-resending',emailValidationUsers,isConfirmedFlagValidation,errorValidationBlogs,async (req: RequestWithBody<AuthEmailModel>, res: Response) => {
    try {
        await authService.updateCodeConfirmationAndExpirationDate(req.body.email)

        res.sendStatus(STATUS_CODE.NO_CONTENT_204)

    } catch (error) {
        console.log(' FIlE auth-routes.ts /registration-email-resending' + error)
        res.sendStatus(STATUS_CODE.SERVER_ERROR_500)
    }
})



