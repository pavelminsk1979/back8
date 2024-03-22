import {Response, Router} from "express";
import {commentsQueryRepository} from "../repositories/comments/comments-query-repository";
import {RequestWithParams} from "../allTypes/RequestWithParams";
import {STATUS_CODE} from "../common/constant-status-code";
import {IdCommentParam} from "../models/IdCommentParam";
import {authTokenMiddleware} from "../middlewares/authMiddleware/authTokenMiddleware";
import {commentsSevrice} from "../servisces/comments-service";
import {commentIdMiddleware} from "../middlewares/commentsMiddleware/commentIdMiddleware";
import {commentIsOwnMiddleware} from "../middlewares/commentsMiddleware/commentIsOwnMiddleware";
import {RequestWithParamsWithBody} from "../allTypes/RequestWithParamsWithBody";
import {CreateComentBodyModel} from "../models/CreateComentBodyModel";
import {contentValidationComments} from "../middlewares/commentsMiddleware/contentValidationComments";
import {errorValidationBlogs} from "../middlewares/blogsMiddelwares/errorValidationBlogs";
import {isExistCommentMiddleware} from "../middlewares/commentsMiddleware/isExistCommentMiddleware";


export const commentsRoute = Router({})


commentsRoute.get('/:commentId', commentIdMiddleware, async (req: RequestWithParams<IdCommentParam>, res: Response) => {

    try {
        const comment = await commentsQueryRepository.findCommentById(req.params.commentId)

        if (comment) {
            return res.status(STATUS_CODE.SUCCESS_200).send(comment)
        } else {
            return res.sendStatus(STATUS_CODE.NOT_FOUND_404)
        }

    } catch (error) {
        console.log(' FIlE comments-routes.ts get-/:commentId' + error)
        return res.sendStatus(STATUS_CODE.SERVER_ERROR_500)
    }

})


commentsRoute.delete('/:commentId', commentIdMiddleware, isExistCommentMiddleware, authTokenMiddleware, commentIsOwnMiddleware, async (req: RequestWithParams<IdCommentParam>, res: Response) => {

    try {

        const isCommentDelete = await commentsSevrice.deleteComentById(req.params.commentId)

        if(isCommentDelete){
            return res.sendStatus(STATUS_CODE.NO_CONTENT_204)
        } else {
            return res.sendStatus(STATUS_CODE.NOT_FOUND_404)
        }

    } catch (error) {
        console.log(' FIlE comments-routes.ts delete-/:commentId' + error)
        return res.sendStatus(STATUS_CODE.SERVER_ERROR_500)
    }

})


commentsRoute.put('/:commentId',commentIdMiddleware,isExistCommentMiddleware,authTokenMiddleware,commentIsOwnMiddleware,contentValidationComments,errorValidationBlogs, async (req: RequestWithParamsWithBody<IdCommentParam,CreateComentBodyModel>, res: Response)=>{

    try {
        const isUpdateComment = await commentsSevrice.updateComment(req.params.commentId,req.body.content)

        if(isUpdateComment){

            return res.sendStatus(STATUS_CODE.NO_CONTENT_204)
        }else {
            return res.sendStatus(STATUS_CODE.NO_RESPONSE_444)
        }

    } catch (error) {

        console.log(' FIlE comments-routes.ts put-/:commentId' + error)
        return res.sendStatus(STATUS_CODE.SERVER_ERROR_500)
    }



})








