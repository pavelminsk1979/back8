
import {OutputComment} from "../allTypes/commentTypes";




export const commentMaper = (comment:any):OutputComment => {
    return {
        id:comment._id.toString(),
        content: comment.content,
        createdAt: comment.createdAt,
        commentatorInfo: {
            userId:comment.commentatorInfo.userId,
            userLogin:comment.commentatorInfo.userLogin
        }
        //commentatorInfo:comment.commentatorInfo
    }
}