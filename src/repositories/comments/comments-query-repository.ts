import {commentsCollection, postsCollection} from "../../db/mongoDb";
import {ObjectId} from "mongodb";
import {commentMaper} from "../../mapers/commentMaper";
import {SortDataGetCoomentsForCorrectPost} from "../../allTypes/commentTypes";




export const commentsQueryRepository = {

    async findCommentById(id: string) {

        const comment = await commentsCollection.findOne({_id: new ObjectId(id)})

        if(!comment) return null

        return commentMaper(comment)
    },


    async getCommentsForCorrectPost(postId:string,sortData:SortDataGetCoomentsForCorrectPost){


        const {sortBy, sortDirection, pageNumber, pageSize} = sortData


        const comments = await commentsCollection
            .find({postId})
            .sort(sortBy, sortDirection)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray()

        const totalCount = await commentsCollection.countDocuments({postId})

        const pagesCount = Math.ceil(totalCount / pageSize)


        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: comments.map(commentMaper)
        }
    }
}