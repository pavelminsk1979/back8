import jwt from "jsonwebtoken"
import {settings} from "../common/settings";


export const tokenJwtServise = {

    async createAccessTokenJwt(userId: string): Promise<string> {

        const accessToken = await jwt.sign({userId: userId}, settings.JWT_SECRET_AccessTOKEN, {expiresIn: settings.TIME_LIFE_AccessTOKEN})

        return accessToken
    },


    async createRefreshTokenJwt(userId: string){
        const refreshToken=await  jwt.sign({userId: userId}, settings.JWT_SECRET_RefreshTOKEN, {expiresIn: settings.TIME_LIFE_RefreshTOKEN})

        return refreshToken
    },

    async getUserIdByToken(token: string) {
        try {
            const result = await jwt.verify(token, settings.JWT_SECRET_AccessTOKEN) as {userId:string}

            return   result.userId
        } catch (error) {
            console.log(' FILE token-jwt-service.ts' + error)
            return null
        }
    }
}