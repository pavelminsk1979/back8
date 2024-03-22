import {OutputPost, PaginationWithOutputPosts, Post, SortDataPost} from "../allTypes/postTypes";
import {postsCollection} from "../db/mongoDb";
import {postMaper} from "../mapers/postMaper";
import {ObjectId} from "mongodb";


export const postQueryRepository = {

    async getPosts(sortDataPost: SortDataPost): Promise<PaginationWithOutputPosts<OutputPost>> {

        const {sortBy, sortDirection, pageNumber, pageSize} = sortDataPost

        const posts = await postsCollection
            .find({})
            .sort(sortBy, sortDirection)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray()

        const totalCount = await postsCollection.countDocuments({})

        const pagesCount = Math.ceil(totalCount / pageSize)


        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: posts.map(postMaper)
        }

    },


    async findPostById(id: string) {
        const post = await postsCollection.findOne({_id: new ObjectId(id)})
        if (post) {
            return postMaper(post)
        } else {
            return null
        }
    },
}