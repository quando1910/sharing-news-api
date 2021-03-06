import { Bookmark, Post, User } from './../models';
import { Request, Response, NextFunction } from 'express';
import { responseMiddleware } from '../lib/utils';
import { PostErrors } from '../lib/api-error';

const bookmarkController = {
  listMyBookmark: responseMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const currentUser: any = req.user;
    const data = await Bookmark.findAll({
      where: {
        userId: currentUser.userId
      },
      include: { 
        model: Post, 
        as: 'post', 
        required: false,
        include: [{
          model: User, 
          as: 'user', 
          required: false,
        }],
      },
      order: [['createdAt', 'DESC']]
    });
    return data;
  }),
  toggleBookmark: responseMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const currentUser: any = req.user;
    const postId = req.body.postId;
    const checkPost = await Post.findByPk(postId);

    if (!checkPost) throw PostErrors.NOT_FOUND;

    const currentBookmark = await Bookmark.findOne({
      where: {
        userId: currentUser.userId,
        postId,
      }
    });
    if (!currentBookmark) {
      const newBookmark = new Bookmark({
        userId: currentUser.userId,
        postId: postId
      });
      newBookmark.save();
      return { isInBookmark: true }
    } else {
      currentBookmark.destroy();
      return { isInBookmark: false }
    }
  }),
}

export default bookmarkController;
