import { useEffect, useState } from 'react'
import { Form, Button, Input, Card, message, Row, Col, ConfigProvider } from 'antd'
import { useNavigate } from 'react-router-dom'
import { request } from '../../api'
import { IUser } from '../../../types'
import Logo from '../../components/Logo'
import LoginImage from '../../components/Svg/Login'
import './index.less'
import { LockOutlined, UserOutlined } from '@ant-design/icons'

const COLOR = '#1890ff'
function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [form] = Form.useForm()
  const navigator = useNavigate()

  const handleChangeType = () => {
    setIsLogin(!isLogin)
    form.resetFields()
  }

  const onFinish = (fields: IUser & { password_c?: string }) => {
    const { username, password, password_c } = fields
    if (isLogin) {
      request.login.post({ username, password }).then(res => {
        navigator('/home')
      })
    } else {
      request.register.post({ username, password }).then(res => {
        message.success('注册成功，请登录！')
        setIsLogin(true)
        form.setFields([
          { name: 'username', value: username },
          { name: 'password', value: '' },
        ])
      })
    }
  }

  useEffect(() => {
    ConfigProvider.config({
      theme: {
        primaryColor: COLOR,
      },
    })
  }, [])

  return (
    <div className='login'>
      <div className='login-title'>
        <Logo color={COLOR} style={{ height: 26, marginRight: 10 }} />
        <span>Werido</span>
      </div>
      <div className='login-form'>
        <Form
          form={form}
          layout='vertical'
          labelCol={{ style: { width: 80 } }}
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item name='username' label='用户名' rules={[{ required: true, message: '请输入用户名' }]}>
            <Input prefix={<UserOutlined />} placeholder='请输入用户名' />
          </Form.Item>
          <Form.Item name='password' label='密码' rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder='请输入密码' />
          </Form.Item>
          {!isLogin && (
            <Form.Item
              name='password_c'
              label='确认密码'
              rules={[
                {
                  required: true,
                  message: '请确认密码',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject('两次密码不一致，请重新输入')
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder='请确认密码' />
            </Form.Item>
          )}
        </Form>
        <Button type='primary' block onClick={form.submit}>
          {isLogin ? '登录' : '立即注册'}
        </Button>
        <a onClick={handleChangeType} style={{ display: 'inline-block', userSelect: 'none', marginTop: 16 }}>
          {isLogin ? '没有账号? 点击注册' : '已有账号, 点击登录'}
        </a>
      </div>
      <LoginImage className='login-image' color={COLOR} />
    </div>
  )
}

export default Login
