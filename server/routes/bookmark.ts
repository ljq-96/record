import { Router } from 'express'
import { UserModal, BookmarkModel } from '../model'
import { Request, Response, Bookmark, IResponse } from '../interfaces'
import { formateTree } from '../utils/common'

const router = Router()

router
  .route('/bookmark')
  /** 获取标签 */
  .get(async (req: Request, res: Response<Bookmark.Doc[]>) => {
    const { _id } = req.app.locals.user
    const data = await BookmarkModel.find({ creator: _id }).populate('items.icon')

    res.json({
      code: 0,
      data: formateTree(data),
    })
  })
  /** 更新标签 */
  .post(async (req: Request<Bookmark.UpdateParams[]>, res: Response) => {
    const { body } = req
    for (let item of body) {
      const { _id, ...reset } = item
      await BookmarkModel.updateOne({ _id }, { ...reset })
    }

    res.json({
      code: 0,
      msg: 'success',
    })
  })
  .put(async (req: Request<{ label: string }>, res: Response<Bookmark.ListResult>) => {
    const { body } = req
    const { user } = req.app.locals
    const prevBookmark = await BookmarkModel.findOne({ creator: user._id, next: null })
    let bookmark
    if (prevBookmark) {
      bookmark = await BookmarkModel.create({
        label: body.label,
        creator: user._id,
        prev: prevBookmark._id,
        next: null,
        children: [],
      })
      await BookmarkModel.updateOne({ _id: prevBookmark._id }, { next: bookmark._id })
    } else {
      bookmark = await BookmarkModel.create({
        label: body.label,
        creator: user._id,
        prev: null,
        next: null,
        children: [],
      })
    }

    res.json({
      code: 0,
      msg: 'success',
      data: bookmark as any,
    })
  })

export default router
