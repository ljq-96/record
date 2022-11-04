import { InfoCircleOutlined } from '@ant-design/icons'
import { Alert, Button, Dropdown, Form, Input, Menu, message, Modal, Segmented, Space, Tag } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IBlog, IUser } from '../../../../../types'
import { request } from '../../../../api'
import CommonTable, { CommonTableInstance, ToolItem } from '../../../../components/CommonTable'
import { formatTime } from '../../../../utils/common'
import { TranslateX } from '../../../../components/Animation'
import { useStore } from '../../../../contexts/useStore'

function UserCenterBlogList(props) {
  const [showModal, setShowModal] = useState<boolean | IUser>(false)
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [form] = Form.useForm()
  const tableRef = useRef<CommonTableInstance>(null)
  const navigate = useNavigate()
  const [{ tags }, { getTags }] = useStore()

  const toolList: ToolItem[] = [
    {
      type: 'input',
      name: 'username',
      label: '文章标题',
    },
    {
      type: 'date',
      name: 'createTime',
      label: '创建时间',
    },
    {
      type: 'select',
      name: 'tags',
      label: '标签',
      childrenProps: {
        options: tags.map(item => ({ label: item.name, value: item.name })),
      },
    },
  ]

  const handleDelete = (id: string) => {
    Modal.confirm({
      type: 'error',
      title: '警告',
      icon: <InfoCircleOutlined style={{ color: 'red' }} />,
      content: '确定要删除此文章吗？',
      okButtonProps: { danger: true, children: '删除' },
      onOk() {
        return request.blog({ method: 'DELETE', query: id }).then(() => {
          // setShowModal(false)
          message.success('删除成功')
          tableRef.current.fetchData()
          return Promise.resolve()
        })
      },
    })
  }

  const handleSubmit = async (fields: Partial<IUser>) => {}

  const columns: ColumnsType<IBlog> = [
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '字数',
      dataIndex: 'words',
      sorter: true,
      render: (val: number) => (val ? val.toLocaleString() : '--'),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: val => formatTime(val),
    },
    {
      title: '操作',
      width: 180,
      render: (value, record) => {
        return (
          <Space style={{ marginLeft: -16 }}>
            <Button type='link' onClick={() => navigate(`/blog/editor?id=${record._id}`)}>
              编辑
            </Button>
            <Button type='link' onClick={() => handleDelete(record._id)}>
              删除
            </Button>
            <Dropdown
              overlay={
                <Menu
                  items={[
                    { label: '查看', key: 'detail' },
                    { label: '导出', key: 'export' },
                  ]}
                ></Menu>
              }
            >
              <Button type='link'>更多</Button>
            </Dropdown>
          </Space>
        )
      },
    },
  ]

  useEffect(() => {
    getTags()
  }, [])

  return (
    <Fragment>
      <CommonTable
        ref={tableRef}
        title={() =>
          selectedKeys.length > 0 && (
            <Space>
              已选择<a>{selectedKeys.length}</a>条
            </Space>
          )
        }
        request={request.blog}
        rowSelection={{ selectedRowKeys: selectedKeys, onChange: (keys: string[]) => setSelectedKeys(keys) }}
        extra={
          <Space>
            {selectedKeys.length > 0 && (
              <TranslateX.List className='inline-block'>
                <Button key={1} className='mr-2'>
                  导出
                </Button>
                <Button key={2}>删除</Button>
              </TranslateX.List>
            )}

            <Button key={3} type='primary' onClick={() => navigate('/blog/editor')}>
              新建文章
            </Button>
          </Space>
        }
        toolList={toolList}
        columns={columns}
      />

      <Modal
        title={`${typeof showModal === 'boolean' ? '新增' : '编辑'}用户`}
        open={!!showModal}
        onOk={form.submit}
        onCancel={() => {
          setShowModal(false)
          form.resetFields()
        }}
      >
        <Form form={form} labelCol={{ style: { width: 70 } }} onFinish={handleSubmit}>
          <Form.Item label='用户名' name='username' rules={[{ required: true, message: '请输入用户名！' }]}>
            <Input placeholder='请输入用户名' />
          </Form.Item>
          <Form.Item label='密码' name='password' rules={[{ required: true, message: '请输入密码！' }]}>
            <Input.Password placeholder='请输入密码' />
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  )
}

export default UserCenterBlogList
