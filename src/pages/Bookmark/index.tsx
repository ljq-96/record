import { Button, Card, Col, Dropdown, Empty, Menu, Row, Segmented, Space, Spin } from 'antd'
import { Fragment, useEffect, useState } from 'react'
import { IBookmark } from '../../../types'
import { request } from '../../api'
import BookmarkItem from '../../components/BookmarkItem'
import BookmarkModal from '../../components/Modal/BookmarkModal'
import { MultipleContainers } from '../../components/Sortable/MultipleContainers'
import { rectSortingStrategy } from '@dnd-kit/sortable'
import './style.less'
import { DocIndexType } from '../../../types/enum'
import { extract } from '../../utils/common'
import Tops from '../../components/Tops'
import { TranslateX } from '../../components/Animation'
import { MoreOutlined } from '@ant-design/icons'

function Bookmark() {
  const [showModal, setShowModal] = useState<IBookmark | boolean>(null)
  const [loading, setLoading] = useState(false)
  const [bookmarks, setBookmarks] = useState<IBookmark[]>([])

  const getBookmark = () => {
    setLoading(true)
    request
      .bookmark({ method: 'GET' })
      .then(res => {
        setBookmarks(res)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleCreate = () => {
    setShowModal(true)
  }

  useEffect(() => {
    getBookmark()
  }, [])

  return (
    <Fragment>
      <Row gutter={[16, 16]}>
        <Col span={18}>
          <TranslateX>
            <Card
              title='我的书签'
              bodyStyle={{ padding: 12 }}
              extra={
                <Dropdown
                  menu={{
                    items: [
                      { label: '添加书签', key: 1, onClick: handleCreate },
                      { label: '导入书签', key: 2 },
                    ],
                  }}
                >
                  <Button icon={<MoreOutlined />} />
                </Dropdown>
              }
            >
              <Spin spinning={loading}>
                {bookmarks.length > 0 ? (
                  <MultipleContainers
                    vertical
                    value={bookmarks}
                    onChange={value => {
                      const _value = value.filter(item => {
                        if (item.children?.length) return true
                        request.bookmark({ method: 'DELETE', query: item._id })
                      })
                      setBookmarks(_value)
                      request.docIndex({
                        method: 'PUT',
                        query: DocIndexType.书签,
                        data: extract(_value),
                      })
                    }}
                    columns={10}
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
                              request
                                .bookmark({ method: 'PUT', query: value._id, data: { pin: !value.pin } })
                                .then(getBookmark)
                            case 'delete':
                              request.bookmark({ method: 'DELETE', query: value._id }).then(getBookmark)
                          }
                        }}
                      />
                    )}
                  />
                ) : (
                  <Empty style={{ padding: 24 }} />
                )}
              </Spin>
            </Card>
          </TranslateX>
        </Col>
        <Col span={6}>
          <TranslateX distance={20}>
            <Tops />
          </TranslateX>
        </Col>
      </Row>

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
