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
      <table className="w-full">
        <thead>
          <tr>
            {columns.map((item) => (
              <th className="border text-left p-2 text-sm" key={item.accessor}>
                {item.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row: any, index: number) => (
            <tr key={index}>
              {columns.map((col) => (
                <td className="border p-2 text-sm" key={col.accessor}>
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
