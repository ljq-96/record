import { createFromIconfontCN } from '@ant-design/icons'
import moment, { Moment } from 'moment'

/** 自定义图标 */
export const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_3208498_rvqh0pj9ql.js',
})

/** qs */
export const querystring = {
  parse: (search: string = '') => {
    let result: { [k: string]: string } = {}
    search.replace(/([^?&]+)=([^?&]+)?/g, (__all, k, v) => {
      result[k] = v
      return __all
    })
    return result
  },
  stringify: (obj: { [k: string]: any }) => {
    let result = []
    Object.keys(obj).forEach(key => {
      const value = obj[key]
      if (null === value || undefined === value) {
        return
      } else {
        result.push(`${encodeURIComponent(key)}=${encodeURIComponent(value + '').replace(/%20/g, '+')}`)
      }
    })
    return result.join('&')
  },
}

/** 防抖 */
export const debounce = (fn: { apply: (arg0: any, arg1: any[]) => void }, t?: number) => {
  let timer = null
  const timeout = t || 500
  return function (this: any, ...args: any) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, timeout)
  }
}

/** 下划线转驼峰 */
export const nameTran = (str: string) => str.replace(/([A-Z|0-9]+)/g, (_, p1) => '-' + p1.toLowerCase())

/** 随机取数组中一项 */
export const randomInArr = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)]

/** 返回登陆页面 */
export const toLogin = () => (location.href = location.pathname.split('#')[0] + '#/login')

/** 格式化时间 */
export const formatTime = (time, formats = 'yyyy-MM-DD HH:mm:ss') => moment(time).format(formats)

/** 比较Set */
export const isSameSet = (s1: Set<any>, s2: Set<any>) => {
  if (s1.size === s2.size) {
    const values = [...s1]
    for (let i = 0; i < values.length; i++) {
      if (!s2.has(values[i])) return false
    }
    return true
  }
  return false
}

export function arrToTree(arr: { text: string; level: number }[]) {
  const root = { children: [] }
  let current: any = root
  arr.forEach(item => {
    const { text, level } = item
    const obj = { title: text, level, key: text, children: [], parent: undefined }
    while (current !== root && current.level - obj.level !== -1) {
      current = current.parent
    }
    obj.parent = current
    obj.parent.children.push(obj)
    current = obj
  })

  return root.children
}
