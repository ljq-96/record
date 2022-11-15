import { generate } from '@ant-design/colors'
import { memo } from 'react'
import Echarts from '../..'
import { useUser } from '../../../../contexts/useUser'
import isDeepEqual from 'react-use/lib/misc/isDeepEqual'

interface IProps {
  loading?: boolean
  data?: {
    name: string
    value: number
  }[]
}

function RiverChart(props: IProps) {
  const { data = [], loading } = props
  const [{ themeColor }] = useUser()
  const plate = generate(themeColor).slice(0, 6).reverse()
  const max = Math.max(...data?.map(item => item.value))
  const step = max / 10

  return (
    <Echarts
      loading={loading}
      option={{
        color: [themeColor],
        tooltip: {
          trigger: 'item',
          formatter: (val: any) => {
            const { dataIndex } = val
            return `${data[dataIndex].name}：${Math.abs(data[dataIndex].value)}`
          },
          axisPointer: {
            type: 'line',
            lineStyle: {
              color: 'rgba(0,0,0,0.2)',
              width: 1,
              type: 'solid',
            },
          },
        },
        grid: {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          containLabel: false,
        },
        visualMap: [
          {
            type: 'piecewise',
            show: false,
            dimension: 0,
            pieces: data?.map((_, index) => {
              const opacity = (255 - (200 / (data.length - 1)) * index).toString(16).split('.')[0]
              return {
                gt: index,
                lt: index + 1,
                color: themeColor + (opacity.length <= 1 ? `0${opacity}` : opacity),
              }
            }),
          },
        ],
        xAxis: {
          type: 'category',
          boundaryGap: false,
          show: false,
          data: [...data?.map(item => item.name), 'ee'],
        },
        yAxis: {
          type: 'value',
          show: false,
        },
        series: [
          {
            type: 'line',
            lineStyle: { width: 0 },
            emphasis: { disabled: true },
            smooth: 0.6,
            smoothMonotone: 'x',
            areaStyle: { color: themeColor + '14' },
            showSymbol: false,
            data: [...data?.map(item => item.value + step), step],
          },
          {
            type: 'line',
            lineStyle: { width: 0 },
            emphasis: { disabled: true },
            smooth: 0.6,
            smoothMonotone: 'x',
            areaStyle: { color: themeColor + '14' },
            showSymbol: false,
            data: [...data?.map(item => -item.value - step), -step],
          },
          {
            type: 'line',
            lineStyle: { width: 0 },
            emphasis: { disabled: true },
            smooth: 0.6,
            smoothMonotone: 'x',
            areaStyle: { color: themeColor + '28' },
            showSymbol: false,
            data: [...data?.map(item => item.value + 2 * step), 2 * step],
          },
          {
            type: 'line',
            lineStyle: { width: 0 },
            emphasis: { disabled: true },
            smooth: 0.6,
            smoothMonotone: 'x',
            areaStyle: { color: themeColor + '28' },
            showSymbol: false,
            data: [...data?.map(item => -item.value - 2 * step), -2 * step],
          },
          {
            type: 'line',
            smooth: 0.6,
            smoothMonotone: 'x',
            areaStyle: { opacity: 1 },
            lineStyle: { width: 0 },
            animation: false,
            showSymbol: false,
            data: [...data?.map(item => item.value), 0],
            emphasis: { disabled: true },
            markLine: {
              symbol: ['none', 'none'],
              label: {
                show: true,
                lineHeight: 20,
                distance: [0, -40],
                formatter: (value: any) => {
                  const { dataIndex } = value
                  if (dataIndex === 0) return `{text1|${data[dataIndex].name}\n}`
                  return `{text2|${data[dataIndex].name}}\n{percent|${((data[dataIndex].value / max) * 100).toFixed(
                    2,
                  )}%}`
                },
                rich: {
                  text1: {
                    align: 'left',
                    padding: [0, 0, 0, 60],
                  },
                  text2: {
                    align: 'left',
                    padding: [0, 0, 0, 80],
                  },
                  percent: {
                    fontWeight: 'bold',
                    fontSize: 16,
                    padding: [0, 0, 0, 80],
                  },
                },
              },
              lineStyle: {
                type: 'solid',
              },
              data: data?.map((item, index) => ({ name: item.name, xAxis: index })),
            },
            // zlevel: 10,
          },
          {
            type: 'line',
            smooth: 0.6,
            smoothMonotone: 'x',
            areaStyle: { opacity: 1 },
            lineStyle: { width: 0 },
            showSymbol: false,
            animation: false,
            data: [...data?.map(item => -item.value), 0],
            emphasis: { disabled: true },
            markLine: {
              symbol: ['none', 'none'],
              label: {
                show: true,
                position: 'start',
                distance: [0, -160],
                lineHeight: 20,
                formatter: (value: any) => {
                  const { dataIndex } = value
                  return `{${dataIndex === 3 ? 'textColored' : 'text'}|${data[dataIndex].value}}`
                },
                rich: {
                  text: {
                    align: 'left',
                    fontSize: 16,
                    color: '#fff',
                    padding: [0, 0, 0, 40],
                    fontWeight: 'bold',
                  },
                  textColored: {
                    align: 'left',
                    fontSize: 16,
                    color: themeColor,
                    padding: [0, 0, 0, 40],
                    fontWeight: 'bold',
                  },
                },
              },
              lineStyle: {
                type: 'solid',
              },
              data: data?.map((item, index) => ({ name: item.name, value: item.value, xAxis: index })),
            },
            // zlevel: 10,
          },
        ],
      }}
    />
  )
}

export default memo(RiverChart, (pre, next) => {
  return isDeepEqual(pre, next)
})
