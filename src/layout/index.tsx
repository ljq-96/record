import { Suspense, useEffect, useMemo, useState } from 'react'
import ProLayout, { DefaultFooter } from '@ant-design/pro-layout'
import { UserOutlined } from '@ant-design/icons'
import {
  ConfigProvider,
  Menu,
  Layout,
  Space,
  Button,
  Avatar,
  Dropdown,
  Drawer,
  Segmented,
  Card,
  message,
  Spin,
} from 'antd'
import { Link, Outlet, useNavigate, useLocation, useMatch } from 'react-router-dom'
import Logo from '../components/Logo'
import { useUser } from '../contexts/useUser'
import { request } from '../api'
import { CirclePicker, MaterialPicker, SliderPicker } from 'react-color'
import { basicUserView } from '../contexts/useUser/actions'
import { PageProps, RouteProps } from '../../types'
import Loading from '../components/Loading'
import * as colors from '@ant-design/colors'
import { TranslateX } from '../components/Animation'
import './style.less'
import '../assets/css/index.less'

export default (props: PageProps) => {
  const { route } = props
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(true)
  const [showColorDrawer, setShowColorDrawer] = useState(false)
  const [loginUser, userDispatch] = useUser()

  const currentRoutes = useMemo(() => {
    function parseRoute(item: RouteProps) {
      const { routes } = item
      if (routes) {
        return {
          ...item,
          routes: routes.filter(item => !item.hide).map(item => parseRoute(item)),
        }
      }
      return item
    }

    return parseRoute(route)
  }, [pathname, route])

  const currentLayout = useMemo(
    () => (currentRoutes.path === '/' ? loginUser.layoutC : loginUser.layoutB),
    [currentRoutes, loginUser],
  )

  const getMyProfile = () => {
    request.myProfile.get().then(res => {
      userDispatch(basicUserView.update.actions(res))
      ConfigProvider.config({
        theme: {
          primaryColor: res.themeColor,
        },
      })
    })
  }

  const logout = () => {
    request.logout.post().then(res => {
      navigate('/login')
      message.success(res.msg)
      userDispatch(basicUserView.destroy.actions())
    })
  }

  const changeColor = ({ hex }) => {
    ConfigProvider.config({
      theme: {
        primaryColor: hex,
      },
    })
    userDispatch(basicUserView.update.actions({ themeColor: hex }))
  }

  const handleDrawer = () => {
    setShowColorDrawer(!showColorDrawer)
    if (showColorDrawer) {
      const { themeColor, layoutB, layoutC } = loginUser
      request.myProfile.put({ themeColor, layoutB, layoutC })
    }
  }

  useEffect(getMyProfile, [])

  return (
    <ProLayout
      className='layout'
      disableContentMargin
      fixSiderbar={true}
      navTheme='light'
      headerTheme='light'
      headerHeight={48}
      fixedHeader={false}
      splitMenus={false}
      onCollapse={setCollapsed}
      collapsed={collapsed}
      breakpoint={false}
      menuHeaderRender={(logo, title) => (
        <Space>
          {logo}
          {!collapsed && (
            <TranslateX delay={400} distance={-10}>
              <span style={{ fontSize: 16, fontFamily: 'Tencent', color: loginUser?.themeColor }}>Werido</span>
            </TranslateX>
          )}
        </Space>
      )}
      title='Werido'
      logo={<Logo style={{ width: 32 }} color={loginUser?.themeColor} />}
      route={currentRoutes}
      menuItemRender={(item, dom) => <Link to={item.path}>{dom}</Link>}
      location={{ pathname }}
      rightContentRender={() => (
        <Space>
          <Button type='text' id='tp-weather-widget'></Button>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item>个人中心</Menu.Item>
                <Menu.Item onClick={() => setShowColorDrawer(true)}>系统设置</Menu.Item>
                <Menu.Divider />
                <Menu.Item onClick={logout}>退出</Menu.Item>
              </Menu>
            }
          >
            <Button type='text'>
              <Avatar
                shape='circle'
                size='small'
                src='https://joeschmoe.io/api/v1/random'
                icon={<UserOutlined />}
                style={{ marginRight: 10 }}
              />
              {loginUser?.username}
            </Button>
          </Dropdown>
        </Space>
      )}
    >
      <Layout.Content
        id='content'
        style={{
          position: 'relative',
          height: 'calc(100vh - 48px)',
          padding: 16,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <Suspense fallback={<Loading />}>
          {loginUser?._id && <Outlet />}
          <DefaultFooter style={{ background: 'transparent' }} copyright='京ICP备2022008343号' />
        </Suspense>
      </Layout.Content>

      <Drawer
        visible={showColorDrawer}
        width={300}
        mask={false}
        onClose={handleDrawer}
        closeIcon={null}
        style={{ top: 16, zIndex: 18 }}
      >
        <CirclePicker
          colors={[
            colors.red.primary,
            colors.volcano.primary,
            colors.orange.primary,
            colors.gold.primary,
            colors.yellow.primary,
            colors.lime.primary,
            colors.green.primary,
            colors.cyan.primary,
            colors.blue.primary,
            colors.geekblue.primary,
            colors.purple.primary,
            colors.magenta.primary,
          ]}
          color={loginUser?.themeColor}
          onChange={changeColor}
        />
        <div style={{ margin: '24px 0' }}>
          <SliderPicker color={loginUser?.themeColor} onChange={changeColor} />
        </div>
        <Card size='small' hoverable>
          <div className='overflow-hidden'>
            <div style={{ margin: '0 -1px' }}>
              <MaterialPicker color={loginUser?.themeColor} onChange={changeColor} />
            </div>
          </div>
        </Card>

        <div style={{ marginBottom: 8 }}>
          前台系统：
          <Segmented
            value={loginUser.layoutC}
            onChange={(e: any) => userDispatch(basicUserView.update.actions({ layoutC: e }))}
            options={[
              {
                label: '侧栏',
                value: 'side',
              },
              {
                label: '顶栏',
                value: 'top',
              },
            ]}
          ></Segmented>
        </div>
        <div>
          后台管理：
          <Segmented
            value={loginUser.layoutB}
            onChange={(e: any) => userDispatch(basicUserView.update.actions({ layoutB: e }))}
            options={[
              {
                label: '侧栏',
                value: 'side',
              },
              {
                label: '顶栏',
                value: 'top',
              },
            ]}
          ></Segmented>
        </div>

        <Space style={{ marginTop: 24 }}>
          <Button
            onClick={() => {
              setShowColorDrawer(false)
              getMyProfile()
            }}
          >
            取消
          </Button>
          <Button onClick={handleDrawer} type='primary'>
            应用
          </Button>
        </Space>
      </Drawer>
    </ProLayout>
  )
}
