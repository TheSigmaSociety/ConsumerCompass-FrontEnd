import type React from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, type TooltipProps } from "recharts"
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"

interface Point {
  x: number
  y: number
}

interface GraphProps {
  data: Point[]
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md">
        <p className="text-sm font-medium text-slate-900 dark:text-white">{`Time: ${label}`}</p>
        <p className="text-sm text-green-600 dark:text-green-400">{`Score: ${payload[0].value}`}</p>
      </div>
    )
  }
  return null
}

const Graph: React.FC<GraphProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="x"
          label={{
            value: "Time",
            position: "insideBottom",
            offset: -5,
            fill: "#64748b",
          }}
          tick={{ fill: "#64748b" }}
        />
        <YAxis
          label={{
            value: "Holistic Score",
            angle: -90,
            position: "insideLeft",
            fill: "#64748b",
          }}
          tick={{ fill: "#64748b" }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="y"
          stroke="#22c55e"
          strokeWidth={3}
          dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
          activeDot={{ fill: "#16a34a", strokeWidth: 0, r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default Graph
