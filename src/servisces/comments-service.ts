import {commentsRepository} from "../repositories/comments/comments-repository";



export const commentsSevrice = {

    async deleteComentById(idComent:string){

        return commentsRepository.deleteComentById(idComent)

    },


    async updateComment(commentId:string,content:string){
        return commentsRepository.updateComment(commentId,content)
    }
}