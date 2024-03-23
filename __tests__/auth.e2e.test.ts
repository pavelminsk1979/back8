import {agent as supertest} from "supertest";
import {app} from "../src/settings";
import {STATUS_CODE} from "../src/common/constant-status-code";


const  req = supertest(app)

describe('/auth',()=>{

    beforeAll(async ()=>{
        await req
            .delete ('/testing/all-data')
    })



    const loginPasswordBasic64='YWRtaW46cXdlcnR5'
    const loginNewUser ='300300'
    const passwordNewUser ='11111pasw'
    const emailNewUser ='palPel@mail.ru'

    it('POST create newUsers',async ()=>{
        const res =await req
            .post('/users')
            .set('Authorization', `Basic ${loginPasswordBasic64}`)
            .send({ login: loginNewUser,
                password: passwordNewUser,
                email:emailNewUser})
            .expect(STATUS_CODE.CREATED_201)

        expect(res.body.login).toEqual(loginNewUser)
        expect(res.body.email).toEqual(emailNewUser)
    })

let refreshToken:string;
let jwtToken:string=''
    it("input correct login and password and sign in (ok)",async ()=>{
        const res =await req
            .post('/auth/login')
            .send({ loginOrEmail: loginNewUser,
                password: passwordNewUser})
            .expect(STATUS_CODE.SUCCESS_200)

            console.log(res.body.accessToken)
                //console.log(res.headers['set-cookie']);

        const allCookies = res.headers['set-cookie'];
         refreshToken = allCookies[0].split(';')[0].split('=')[1];
        console.log(refreshToken);

        jwtToken=res.body.accessToken

        expect(res.body.accessToken).toBeTruthy()
    })



    it("me  request  (ok)",async ()=>{
        const res =await req
            .get('/auth/me')
            .set('Authorization', `Bearer ${jwtToken}`)
            .expect(STATUS_CODE.SUCCESS_200)

    })



    it("should return two token (accessToken and refreshToken",async ()=>{
        const res =await req
            .post('/auth/refresh-token')
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(STATUS_CODE.SUCCESS_200)
        console.log(res.body)

    })

})