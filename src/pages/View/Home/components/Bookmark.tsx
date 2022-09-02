import { Card, Spin } from 'antd'
import { Fragment, useEffect, useState } from 'react'
import { IBookmark } from '../../../../../types'
import { request } from '../../../../api'
import BookmarkItem from '../../../../components/BookmarkItem'
import { MultipleContainers } from '../../../../components/Sortable/MultipleContainers'
import { rectSortingStrategy } from '@dnd-kit/sortable'
import { DocIndexType } from '../../../../../types/enum'
import { extract } from '../../../../utils/common'
import BookmarkModal from '../../../../components/Modal/BookmarkModal'

function Bookmark() {
  const [bookmarks, setBookmarks] = useState<IBookmark[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState<IBookmark | boolean>(null)

  const getBookmark = () => {
    setLoading(true)
    request.bookmark
      .get('favorite')
      .then(res => {
        setBookmarks([
          {
            creator: '62cfe23234cd79f07a173f5f',
            title: '文档',
            _id: '62fa62c17948b8d29883c3c4',
            children: res,
          },
        ])
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    getBookmark()
  }, [])

  return (
    <Fragment>
      <Card size='small'>
        <Spin spinning={loading}>
          <MultipleContainers
            vertical
            containerDisabled
            value={bookmarks}
            onChange={value => {
              setBookmarks(value)
              request.docIndex.put({ _id: DocIndexType.首页书签, content: JSON.stringify(extract(value[0].children)) })
            }}
            columns={8}
            strategy={rectSortingStrategy}
            renderItem={value => (
              <BookmarkItem
                item={value}
                onMenu={action => {
                  switch (action) {
                    case 'edit':
                      setShowModal(value)
                      break
                    case 'pin':
                      request.bookmark.put({ _id: value._id, pin: !value.pin }).then(getBookmark)
                  }
                }}
              />
            )}
          />
        </Spin>
      </Card>

      <BookmarkModal
        visible={showModal}
        onCancle={() => setShowModal(false)}
        groups={bookmarks.map(item => ({ label: item.title, value: item.title }))}
        onOk={() => {
          setShowModal(false)
          getBookmark()
        }}
      />
    </Fragment>
  )
}

export default Bookmark
