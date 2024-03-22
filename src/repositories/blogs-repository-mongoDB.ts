import {CreateAndUpdateBlogModel} from "../models/CreateAndUpdateBlogModel";
import {blogsCollection} from "../db/mongoDb";
import {ObjectId} from "mongodb";
import {Blog} from "../allTypes/blogTypes";


export const blogsRepository = {

    async createBlog(newBlog: Blog) {

        const result = await blogsCollection.insertOne(newBlog)
        return result
    },


    async updateBlog(id: string, requestBodyBlog: CreateAndUpdateBlogModel) {

        const {name, description, websiteUrl} = requestBodyBlog

        const result = await blogsCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {
                name: name,
                description: description,
                websiteUrl: websiteUrl
            }
        })

        return !!result.matchedCount

    },


    async deleteBlogById(id: string) {

        const result = await blogsCollection.deleteOne({_id: new ObjectId(id)})

        return !!result.deletedCount
    }
}

