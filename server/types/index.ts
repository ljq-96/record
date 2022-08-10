import * as express from 'express'
import Koa from 'koa'
import { ComponentType, LazyExoticComponent, ReactElement } from 'react'
import { UserStatus } from './enum'

export type Request<ReqBody = any, ReqQuery = any, Locals = { user: UserType }> = express.Request<
  any,
  any,
  ReqBody,
  ReqQuery,
  Locals
>
export type Response<T = any> = express.Response<IResponse<T>>

export interface RouterCtx<Query = any, Body = any, Response = any> extends Koa.ParameterizedContext {
  request: Koa.Request & {
    body: Body
    query: Query
    params: any
  }
}

export interface IResponse<T = any> {
  msg?: string
  data?: T
}

export interface Pager<T = any> {
  page?: number
  size?: number
  total?: number
  list?: T[]
}

export type QueryList<T = any> = {
  page: number
  size: number
} & Partial<T>

export interface RouteProps {
  path: string
  name?: string
  icon?: JSX.Element
  component?: ComponentType | LazyExoticComponent<any>
  hide?: boolean
  routes?: RouteProps[]
}

export interface UserType {
  _id: string
  username: string
  password: string
  createTime: number
  updateTime: number
  status: UserStatus
  themeColor: string
  layoutB: 'side' | 'top'
  layoutC: 'side' | 'top'
}

export interface IconType {
  _id: string
  icon: string
  name: string
  creator: string
  createTime: number
  updateTime: number
}

export interface BookmarkType {
  _id: string
  title: string
  icon?: string
  url?: string
  creator: string
  prev?: string
  parent?: string
  next?: string
  createTime?: number
  updateTime?: number
  children: BookmarkType[]
}

export interface BlogType {
  _id: string
  prev: string
  next: string
  parent: string
  createTime: number
  updateTime: number
  title: string
  content: string
  words: number
  description: string
  creator: string
  tags: string[]
}

export interface BingWallpaperType {
  title: string
  desc: string
  copyright: string
  wallpaper: string
  date: string
}
