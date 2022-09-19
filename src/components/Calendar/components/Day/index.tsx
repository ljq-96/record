import { Button, Dropdown, Empty, Menu, Spin } from 'antd'
import clsx from 'clsx'
import moment, { Moment } from 'moment'
import { useContext, useMemo } from 'react'
import { TranslateX, TranslateY } from '../../../Animation'
import { MoreOutlined } from '@ant-design/icons'
import { getEvents } from '../../utils'
import { CalendarContext } from '../..'
import './style.less'

function CalendarDay() {
  const { current, setCurrent, todo, onAction, loading } = useContext(CalendarContext)

  const days = useMemo<{ week: string; day?: Moment }[]>(() => {
    const dayIndex = current.day() === 0 ? 6 : current.day() - 1
    return ['一', '二', '三', '四', '五', '六', '日'].map((item, index) => ({
      week: item,
      day: moment(current).subtract(dayIndex - index, 'days'),
    }))
  }, [current])

  const currentEvents = useMemo(() => {
    return getEvents(todo, current)
  }, [current])

  return (
    <TranslateY className='calendar-day'>
      <div className='calendar-day-head'>
        {days.map(item => (
          <div
            key={item.week}
            className={clsx(
              'calendar-day-head-item',
              item.day.format('yyyy-MM-DD') === moment().format('yyyy-MM-DD') && 'active',
              item.day.format('yyyy-MM-DD') === current.format('yyyy-MM-DD') && 'current',
            )}
            onClick={() => setCurrent(item.day)}
          >
            <div>{item.week}</div>
            <div>{item.day.date()}</div>
            <div
              className={clsx(
                'calendar-day-head-item-dot',
                item.day.format('yyyy-MM-DD') === moment().format('yyyy-MM-DD') &&
                  moment().format('yyyy-MM-DD') === current.format('yyyy-MM-DD') &&
                  'status-processing',
              )}
            ></div>
          </div>
        ))}
      </div>
      <Spin spinning={loading}>
        <div className='calendar-day-today'>
          <div>{current.format('yyyy.MM.DD')}</div>
          <div>{currentEvents?.length ?? 0}个日程</div>
        </div>

        {currentEvents?.length ? (
          <TranslateX.List distance={15} delay={200} interval={200}>
            {currentEvents.map(item => (
              <div className='calendar-day-event-item' key={item.start.valueOf()}>
                <div className='calendar-day-event-item-start'>{item.start.format('HH:mm')}</div>
                <div className='calendar-day-event-item-content'>
                  <div>
                    {item.start.format('HH:mm')} - {item.end.format('HH:mm')}
                    <Dropdown
                      placement='bottomRight'
                      overlay={
                        <Menu
                          onClick={e =>
                            onAction?.({
                              type: e.key as any,
                              todo: { ...item, start: item.start.format(), end: item.end.format() },
                            })
                          }
                          items={[
                            { label: '编辑', key: 'edit' },
                            { label: '删除', key: 'delete' },
                          ]}
                        />
                      }
                    >
                      <Button type='text' size='small' icon={<MoreOutlined />} />
                    </Dropdown>
                  </div>
                  <div>{item.description}</div>
                </div>
              </div>
            ))}
          </TranslateX.List>
        ) : (
          <Empty key={1} image={Empty.PRESENTED_IMAGE_SIMPLE} description='暂无日程' />
        )}
      </Spin>
    </TranslateY>
  )
}

export default CalendarDay
