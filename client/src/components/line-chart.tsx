/* eslint-disable @typescript-eslint/no-explicit-any */
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { capitalize } from "lodash";
import { DateTime } from "luxon";

interface IProps {
  data: {
    date: string;
  }[];
  colorCode: string[];
  keys: string[];
}

export default function LineChartV1(props: IProps) {
  const { data, keys, colorCode } = props;

  const yAxisFormatter = (tick: number) => {
    if (tick >= 1_000_000_000) return `${(tick / 1_000_000_000).toFixed(1)}B`;
    if (tick >= 1_000_000) return `${(tick / 1_000_000).toFixed(1)}M`;
    if (tick >= 1_000) return `${(tick / 1_000).toFixed(1)}K`;
    return tick.toString();
  }

  const renderCustomLegend = (props: any) => {
    const { payload } = props;

    return (
      <ul style={{ display: 'flex', justifyContent: 'center', listStyle: 'none', padding: 0 }}>
        {payload.map((entry: any, index: number) => {
          let icon = "●"; // default dot
          if (entry.value === "revenue") icon = "💰"; // custom icon for revenue
          else if (entry.value === "coconut") icon = "🥥"; // custom icon for coconut

          return (
            <li key={`item-${index}`} style={{ marginRight: 20, display: 'flex', alignItems: 'center' }}>
              <span className="text-sm mr-2">{icon}</span>
              <span className="text-sm" style={{ color: entry.color }}>{capitalize(entry.value)}</span>
            </li>
          );
        })}
      </ul>
    );
  };

  const customTooltip = ({ active, payload, label }: any) => {
    const isVisible = active && payload && payload.length;

    return (
      <div className="bg-white shadow-lg p-4 rounded-md">
        {isVisible && (
          <>
            <p className="my-1 text-sm font-bold">
              {DateTime.fromFormat(label, 'yyyy-MM-dd').toFormat('d MMM yyyy')}
            </p>
            {payload?.map((content) => (
              <p className="my-1 text-sm">
                {capitalize(content.dataKey)}: <span className="font-bold align-middle">{content.value}</span>
              </p>
            ))}
          </>
        )}
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 20,
        }}
      >
        <XAxis label={{ position: 'insideLeft' }} tickMargin={20} dataKey="date" tickLine={false} tick={{ fontSize: 12, stroke: '#999', strokeWidth: 0 }} />
        <YAxis tickLine={false} tickFormatter={yAxisFormatter} tick={{ fontSize: 12, stroke: '#999', strokeWidth: 0 }} />
        <Tooltip content={customTooltip} />
        <Legend content={renderCustomLegend} wrapperStyle={{ position: 'absolute', bottom: 5 }} />
        {keys.map((key, index: number) => (
          <Line type="monotone" dataKey={key} stroke={colorCode[index] || "#8884d8"} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}