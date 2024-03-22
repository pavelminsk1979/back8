import {blogsCollection, postsCollection} from "../db/mongoDb";
import {blogMaper} from "../mapers/blogMaper";
import {ObjectId} from "mongodb";
import {OutputBlog, PaginationWithOutputBlog, SortData} from "../allTypes/blogTypes";
import {postMaper} from "../mapers/postMaper";


export const blogQueryRepository = {
    async getBlogs(sortData: SortData): Promise<PaginationWithOutputBlog<OutputBlog>> {
        const {searchNameTerm, sortBy, sortDirection, pageNumber, pageSize} = sortData

        let filter = {}

        if (searchNameTerm) {
            filter = {
                name: {
                    $regex: searchNameTerm,
                    $options: 'i'
                }
            }
        }


        const blogs = await blogsCollection
            .find(filter)
            .sort(sortBy, sortDirection)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray()

        const totalCount = await blogsCollection.countDocuments(filter)

        const pagesCount = Math.ceil(totalCount / pageSize)


        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: blogs.map(blogMaper)
        }
    },


    async getPostsForCorrectBlog(sortDataGetPostsForBlogs: any, blogId: string) {

        const {sortBy, sortDirection, pageNumber, pageSize} = sortDataGetPostsForBlogs


        const blog = await blogQueryRepository.findBlogById(blogId)

        if (!blog) {
            return null
        }

        const filter = {blogId}

        const posts = await postsCollection
            .find(filter)
            .sort(sortBy, sortDirection)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray()

        const totalCount = await postsCollection.countDocuments(filter)

        const pagesCount = Math.ceil(totalCount / pageSize)


        return {
            pagesCount,
            page: pageNumber,
            pageSize,
            totalCount,
            items: posts.map(postMaper)
        }

    },


    async findBlogById(id: string) {
        const blog = await blogsCollection.findOne({_id: new ObjectId(id)})
        if (blog) {
            return blogMaper(blog)
        } else {
            return null
        }
    },
}