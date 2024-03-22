import {Response, Router} from "express";
import {STATUS_CODE} from "../common/constant-status-code";
import {RequestWithParams} from "../allTypes/RequestWithParams";
import {IdStringGetAndDeleteModel} from "../models/IdStringGetAndDeleteModel";
import {RequestWithBody} from "../allTypes/RequestWithBody";
import {CreateAndUpdatePostModel} from "../models/CreateAndUpdatePostModel";
import {titleValidationPosts} from "../middlewares/postsMiddlewares/titleValidationPosts";
import {authMiddleware} from "../middlewares/authMiddleware/authMiddleware";
import {shortDescriptionValidationPosts} from "../middlewares/postsMiddlewares/shortDescriptionValidationPosts";
import {contentValidationPosts} from "../middlewares/postsMiddlewares/contentValidationPosts";
import {blogIdValidationPosts} from "../middlewares/postsMiddlewares/blogIdValidationPosts";
import {errorValidationBlogs} from "../middlewares/blogsMiddelwares/errorValidationBlogs";
import {RequestWithParamsWithBody} from "../allTypes/RequestWithParamsWithBody";
import {QueryBlogInputModal} from "../allTypes/postTypes";
import {postsSevrice} from "../servisces/posts-service";
import {postQueryRepository} from "../repositories/post-query-repository";
import {RequestWithQuery} from "../allTypes/RequestWithQuery";
import {authTokenMiddleware} from "../middlewares/authMiddleware/authTokenMiddleware";
import {CreateComentPostIdModel} from "../models/CreateComentPostIdModel";
import {CreateComentBodyModel} from "../models/CreateComentBodyModel";
import {contentValidationComments} from "../middlewares/commentsMiddleware/contentValidationComments";
import {ResultCode} from "../common/object-result";
import {RequestWithParamsWithQuery} from "../allTypes/RequestWithParamsWithQuery";
import {QueryInputModalGetCommentsForCorrectPost} from "../allTypes/commentTypes";
import {commentsQueryRepository} from "../repositories/comments/comments-query-repository";
import {postIdMiddleware} from "../middlewares/postsMiddlewares/postIdMiddleware";


export const postsRoute = Router({})


const createAndUpdateValidationPosts = () => [titleValidationPosts, shortDescriptionValidationPosts, contentValidationPosts, blogIdValidationPosts]

postsRoute.get('/', async (req: RequestWithQuery<QueryBlogInputModal>, res: Response) => {

    const sortDataPost = {
        pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
        pageSize: req.query.pageSize ? +req.query.pageSize : 10,
        sortBy: req.query.sortBy ?? 'createdAt',
        sortDirection: req.query.sortDirection ?? 'desc',
    }

    const posts = await postQueryRepository.getPosts(sortDataPost)

    res.status(STATUS_CODE.SUCCESS_200).send(posts)
})


postsRoute.get('/:id', async (req: RequestWithParams<IdStringGetAndDeleteModel>, res: Response) => {
    const post = await postQueryRepository.findPostById(req.params.id)
    if (post) {
        res.status(STATUS_CODE.SUCCESS_200).send(post)
    } else {
        res.sendStatus(STATUS_CODE.NOT_FOUND_404)
    }

})


postsRoute.post('/', authMiddleware,
    createAndUpdateValidationPosts(),
    errorValidationBlogs, async (req: RequestWithBody<CreateAndUpdatePostModel>, res: Response) => {
        const newPost = await postsSevrice.createPost(req.body)
        res.status(STATUS_CODE.CREATED_201).send(newPost)
    })


postsRoute.put('/:id', authMiddleware,
    createAndUpdateValidationPosts(),
    errorValidationBlogs, async (req: RequestWithParamsWithBody<IdStringGetAndDeleteModel, CreateAndUpdatePostModel>, res: Response) => {
        const isUpdatePost = await postsSevrice.updatePost(req.params.id, req.body)
        if (isUpdatePost) {
            res.sendStatus(STATUS_CODE.NO_CONTENT_204)
        } else {
            res.sendStatus(STATUS_CODE.NOT_FOUND_404)
        }
    })


postsRoute.delete('/:id', authMiddleware, async (req: RequestWithParams<IdStringGetAndDeleteModel>, res: Response) => {
    const isPostDelete = await postsSevrice.deletePostById(req.params.id)
    if (isPostDelete) {
        res.sendStatus(STATUS_CODE.NO_CONTENT_204)
    } else {
        res.sendStatus(STATUS_CODE.NOT_FOUND_404)
    }
})


postsRoute.post('/:postId/comments',postIdMiddleware, authTokenMiddleware, contentValidationComments, errorValidationBlogs, async (req: RequestWithParamsWithBody<CreateComentPostIdModel, CreateComentBodyModel>, res: Response) => {

    try {
        const newCommentForPost = await postsSevrice.createCommentForPostByPostId(req.params.postId, req.body.content, req.userIdLoginEmail.id, req.userIdLoginEmail.login)

        if (newCommentForPost.code === ResultCode.NotFound) {
            return res.sendStatus(STATUS_CODE.NOT_FOUND_404)

        }
        if (newCommentForPost.code === ResultCode.Success) {
            return res.status(STATUS_CODE.CREATED_201).send(newCommentForPost.data)
        } else {
            console.log(' FIlE post-routes.ts post-/:postId/comments')
            return res.sendStatus(STATUS_CODE.NOT_FOUND_404)
        }

    } catch (error) {

        console.log(' FIlE post-routes.ts post-/:postId/comments' + error)
        return res.sendStatus(STATUS_CODE.SERVER_ERROR_500)
    }
})


postsRoute.get('/:postId/comments',postIdMiddleware, async (req: RequestWithParamsWithQuery<CreateComentPostIdModel, QueryInputModalGetCommentsForCorrectPost>, res: Response) => {


    const sortData = {
        pageNumber: isNaN(Number(req.query.pageNumber))
            ? 1
            : Number(req.query.pageNumber),

        pageSize: isNaN(Number(req.query.pageSize))
            ? 10
            : Number(req.query.pageSize),

        sortBy: req.query.sortBy ?? 'createdAt',
        sortDirection: req.query.sortDirection ?? 'desc',
    }


    try {

        const post = await postQueryRepository.findPostById(req.params.postId)

        if (!post) {
            return res.sendStatus(STATUS_CODE.NOT_FOUND_404)
        }

        const comments = await commentsQueryRepository.getCommentsForCorrectPost(req.params.postId, sortData)

        return res.status(STATUS_CODE.SUCCESS_200).send(comments)


    } catch (error) {

        console.log(' FIlE post-routes.ts get-/:postId/comments' + error)
        return res.sendStatus(STATUS_CODE.SERVER_ERROR_500)
    }

})








