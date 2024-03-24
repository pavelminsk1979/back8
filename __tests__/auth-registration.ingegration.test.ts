import {agent as supertest} from "supertest";
import {app} from "../src/settings";
import {authService} from "../src/servisces/auth-service";
import {createItemsForTest} from "./utils/createItemsForTest";
import {ObjectId} from "mongodb";
import {emailAdapter} from "../src/adapters/emailAdapter";
import {STATUS_CODE} from "../src/common/constant-status-code";


const  req = supertest(app)

describe('user registration',()=>{

 /*   beforeAll(async ()=>{
        await req
            .delete ('/testing/all-data')
    })*/

const registerUserMethod = authService.registerUser;

    emailAdapter.sendEmail=jest.fn().mockImplementation((email,confirmationCode)=>{return true})

    it("rigistration newUser with correct data",async ()=>{
        const {login,email,password}=createItemsForTest.createOneItem()

        const result = await registerUserMethod(login,email,password)

        console.log(result)

        expect(result).toEqual({
            login,
            email,
            passwordHash:expect.any(String),
            createdAt:expect.any(Date),
            emailConfirmation:{
                confirmationCode:expect.any(String),
                expirationDate:expect.any(Date),
                isConfirmed:false
            },
            _id: expect.any(ObjectId),
            blackListRefreshToken:[]
        })
    })



    const loginPasswordBasic64='YWRtaW46cXdlcnR5'

    it('get users',async ()=>{
        const res = await req
            .get('/users')
            .set('Authorization', `Basic ${loginPasswordBasic64}`)
            .expect(STATUS_CODE.SUCCESS_200)

        console.log(res.body.items)

    })

})
