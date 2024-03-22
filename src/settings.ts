import express, {Request, Response} from 'express'
import { videosRoute} from "./routes/videos-route";
import {blogsRoute} from "./routes/blogs-route";
import {postsRoute} from "./routes/posts-route";
import {DB} from "./db/db";
import {blogsCollection, commentsCollection, postsCollection, usersCollection} from "./db/mongoDb";
import {STATUS_CODE} from "./common/constant-status-code";
import {usersRoute} from "./routes/users-route";
import {authRoute} from "./routes/auth-route";
import {commentsRoute} from "./routes/comments-route";


export const app = express()


app.use(express.json())

app.use('/videos', videosRoute)
app.use('/blogs', blogsRoute)
app.use('/posts', postsRoute)
app.use('/users', usersRoute)
app.use('/auth', authRoute)
app.use('/comments',commentsRoute)


app.delete('/testing/all-data', async (req: Request, res: Response) => {
    DB.videos.length = 0
   await postsCollection.deleteMany({})
   await blogsCollection.deleteMany({})
    await usersCollection.deleteMany({})
    await commentsCollection.deleteMany({})
    res.sendStatus(STATUS_CODE.NO_CONTENT_204)
})