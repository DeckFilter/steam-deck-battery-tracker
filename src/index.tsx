import { callable, definePlugin } from '@decky/api'
import { PanelSection, PanelSectionRow, Router, staticClasses, SliderField, Field } from '@decky/ui'
import { useState } from 'react'
import { FaBatteryFull } from 'react-icons/fa'

import { Canvas } from './canvas'

interface BatteryData {
  x: number[]
  cap: number[]
  power_data: { name: string; average_power: number }[]
}

const getRecentData = callable<[lookback: number], BatteryData | null>('get_recent_data')
const setApp = callable<[app: string], boolean>('set_app')

const Content = () => {
  const [lookback, setLookback] = useState(1)
  const [leData, setData] = useState<BatteryData | null>(null)

  const drawCanvas = async (ctx: CanvasRenderingContext2D, frameCount: number) => {
    if (frameCount % 1000 > 1) {
      return
    }
    let data = leData
    if (data == null) {
      try {
        data = await getRecentData(lookback)
        console.log('Got first time data', data)
        setData(data)
      } catch (error) {
        console.error('Could not get recent battery data', error)
        return
      }
    }
    if (data == null) {
      return
    }

    console.log('in draw canvas ', leData)

    const width: number = ctx.canvas.width
    const height: number = ctx.canvas.height
    ctx.strokeStyle = '#1a9fff'
    ctx.fillStyle = '#1a9fff'
    ctx.lineWidth = 2
    ctx.lineJoin = 'round'
    ctx.clearRect(0, 0, width, height)

    // graph helper lines
    ctx.beginPath()
    ctx.strokeStyle = '#093455'
    const totalLines = 7
    const lineDistance = 1 / (totalLines + 1)
    for (let i = 1; i <= totalLines; i++) {
      ctx.moveTo(lineDistance * i * width, 0)
      ctx.lineTo(lineDistance * i * width, height)
      ctx.moveTo(0, lineDistance * i * height)
      ctx.lineTo(width, lineDistance * i * height)
    }
    ctx.stroke()

    ctx.beginPath()
    ctx.strokeStyle = '#1a9fff'
    ctx.fillStyle = '#1a9fff'

    // axis labels
    ctx.textAlign = 'center'
    ctx.rotate(-Math.PI / 2)
    ctx.fillText('Batt %', -height / 2, 12) // Y axis is rotated 90 degrees
    ctx.rotate(Math.PI / 2)
    ctx.fillText('Time', width / 2, height - 4)
    // graph data labels
    ctx.textAlign = 'start' // default
    ctx.fillText('-2d', 2, height - 2)
    ctx.fillText('100%', 2, 9)
    ctx.textAlign = 'right'
    ctx.fillText('Now', width - 2, height - 2)

    // ctx.moveTo(data[0].x/width, );
    for (var i = 0; i < data.x.length; i++) {
      ctx.beginPath()
      // console.log(data.x[i+1] - data.x[i]);
      if (data.x[i + 1] - data.x[i] > 0.000078354119349755 * 10) {
        ctx.strokeStyle = 'yellow'
      } else {
        if (data.cap[i + 1] > data.cap[i]) {
          ctx.strokeStyle = 'green'
        } else {
          ctx.strokeStyle = 'red'
        }
      }
      ctx.moveTo(data.x[i] * width, height - data.cap[i] * height)
      ctx.lineTo(data.x[i + 1] * width, height - data.cap[i + 1] * height)
      ctx.stroke()
    }
    console.debug('Rendered ', frameCount)
  }

  return (
    <PanelSection title="Recent Battery Use">
      <PanelSectionRow>
        <SliderField
          label="Lookback in days"
          value={lookback || 1}
          step={1}
          max={7}
          min={1}
          resetValue={1}
          showValue={true}
          onChange={(value: number) => {
            setLookback(value)
            getRecentData(value).then(setData).catch((error) => {
              console.error('Could not get recent battery data', error)
            })
          }}
        />
      </PanelSectionRow>
      <PanelSectionRow>
        <Field focusable disabled childrenLayout="below">
          <Canvas
            draw={(ctx: CanvasRenderingContext2D, frameCount: number) => drawCanvas(ctx, frameCount)}
            width={268}
            height={200}
            style={{
              width: '268px',
              height: '200px',
              padding: '0px',
              border: '1px solid #1a9fff',
              'background-color': '#1a1f2c',
              'border-radius': '4px',
            }}
            onClick={(e: any) => console.log(e)}
          />
        </Field>
      </PanelSectionRow>

      {leData?.power_data.map((item) => (
        <PanelSectionRow key={item.name}>
          <Field focusable disabled label={item.name}>
            {item.average_power}W
          </Field>
        </PanelSectionRow>
      ))}
    </PanelSection>
  )
}

export default definePlugin(() => {
  console.log('defining battery plugin')
  const updateApp = () => {
    setApp(Router.MainRunningApp?.display_name ?? 'Unknown').catch((error) => {
      console.error('Could not update the running app', error)
    })
  }
  updateApp()
  const appInterval = window.setInterval(updateApp, 1000 * 10)

  return {
    name: 'Battery Tracker',
    titleView: <div className={staticClasses.Title}>Battery Tracker</div>,
    content: <Content />,
    icon: <FaBatteryFull />,
    onDismount() {
      window.clearInterval(appInterval)
    },
  }
})
