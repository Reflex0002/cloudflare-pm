import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { feedbackColumns } from "./columns";

export const FeedbackTable = ({ data, selectedId, onSelect }) => {
  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data,
    columns: feedbackColumns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => row.id,
  });

  return (
    <div className="table-wrapper">
      {table.getHeaderGroups().map((headerGroup) => (
        <div key={headerGroup.id} className="table-row table-header">
          {headerGroup.headers.map((header) => {
            const canSort = header.column.getCanSort();
            const sortDirection = header.column.getIsSorted();
            return (
              <div
                key={header.id}
                onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                style={{ cursor: canSort ? "pointer" : "default" }}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
                {sortDirection ? (sortDirection === "asc" ? " ↑" : " ↓") : ""}
              </div>
            );
          })}
        </div>
      ))}

      {table.getRowModel().rows.map((row) => (
        <div
          key={row.id}
          className={`table-row ${selectedId === row.id ? "selected" : ""}`}
          onClick={() => onSelect?.(row.id)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              onSelect?.(row.id);
            }
          }}
          role="button"
          tabIndex={0}
        >
          {row.getVisibleCells().map((cell) => (
            <div key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
