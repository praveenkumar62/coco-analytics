/* eslint-disable @typescript-eslint/no-explicit-any */
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { capitalize, startCase } from "lodash";
import { DateTime } from "luxon";

interface IProps {
  data: {
    date: string;
  }[];
  colorCode: string[];
  keys: string[];
  xAxisKey?: string;
  enableKeyTotal?: boolean;
}

export default function StackedBarChartV1(props: IProps) {
  const { data, keys, colorCode, xAxisKey, enableKeyTotal } = props;

  const yAxisFormatter = (tick: number) => {
    if (tick >= 1_000_000_000) return `${(tick / 1_000_000_000).toFixed(1)}B`;
    if (tick >= 1_000_000) return `${(tick / 1_000_000).toFixed(1)}M`;
    if (tick >= 1_000) return `${(tick / 1_000).toFixed(1)}K`;
    return tick.toString();
  }

  const customTooltip = ({ active, payload, label }: any) => {
    const isVisible = active && payload && payload.length;

    return (
      <div className="bg-white shadow-lg p-4 rounded-md">
        {isVisible && (
          <>
            <p className="my-1 text-sm font-bold">
              {typeof label === 'string' ? DateTime.fromFormat(label, 'yyyy-MM-dd').toFormat('d MMM yyyy') : label}
            </p>
            {payload?.map((content) => (
              <p className="my-1 text-sm" key={content.dataKey}>
                {capitalize(startCase(content.dataKey))}: <span className="font-bold align-middle">{content.value}</span>
              </p>
            ))}
            { enableKeyTotal && (
              <p className="font-bold">
                Total: 
                {payload?.reduce((acc, item) => {
                  return Number(acc) + Number(item?.value || 0);
                }, 0)}
              </p>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 20,
        }}
      >
        <XAxis label={{ position: 'insideLeft' }} tickMargin={20} dataKey={xAxisKey || "date"} interval={2} tickLine={false} minTickGap={10} tick={{ fontSize: 12, stroke: '#999', strokeWidth: 0 }} />
        <YAxis tickLine={false} tickFormatter={yAxisFormatter} tick={{ fontSize: 12, stroke: '#999', strokeWidth: 0 }} />
        <Tooltip content={customTooltip} />
        {keys.map((key, index: number) => (
          <Bar dataKey={key} stackId="a" fill={colorCode[index] || "#8884d8"} key={index} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}