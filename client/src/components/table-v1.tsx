/* eslint-disable @typescript-eslint/no-explicit-any */

import type { JSX } from "react";

export interface IColumn {
  accessor: string;
  header: string;
  cell?: (row: any) => JSX.Element;
}
interface IProps {
  columns: IColumn[];
  rows: Record<string, any>[];
}

export default function Table(props: IProps) {
  const { columns, rows } = props;
  return (
    <div>
      <table className="w-full border-0">
        <thead className="border border-[#9ca3af73]">
          <tr>
            {columns.map((item) => (
              <th className="text-left p-2 text-sm border-0" key={item.accessor}>
                {item.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="border border-t-0 border-[#9ca3af73]">
          {rows.map((row: any, index: number) => (
            <tr key={index}>
              {columns.map((col) => (
                <td className="border-0 border-b border-[#9ca3af73]r p-2 text-sm" key={col.accessor}>
                  {col?.cell ? col.cell(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
