import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from "@tanstack/react-table";
import type { TestCase } from "../types/flow";

interface Props {
  tests: TestCase[];
}

const columnHelper = createColumnHelper<TestCase>();

const columns = [
  columnHelper.accessor("name", { header: "Test Name", size: 300 }),
  columnHelper.accessor("category", {
    header: "Category",
    cell: (info) => {
      const colors: Record<string, string> = {
        path: "#3b82f6",
        positive: "#22c55e",
        negative: "#ef4444",
        combinatorial: "#a855f7",
        boundary: "#f59e0b",
      };
      return (
        <span style={{ color: colors[info.getValue()] || "#6b7280", fontWeight: 500 }}>
          {info.getValue()}
        </span>
      );
    },
  }),
  columnHelper.accessor("path", {
    header: "Path",
    cell: (info) => info.getValue().join(" → "),
  }),
  columnHelper.accessor("expected", { header: "Expected" }),
  columnHelper.accessor("actual", {
    header: "Actual",
    cell: (info) => info.getValue() || "-",
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => {
      const val = info.getValue();
      const styles: Record<string, { bg: string; color: string }> = {
        pending: { bg: "#f3f4f6", color: "#6b7280" },
        running: { bg: "#dbeafe", color: "#2563eb" },
        passed: { bg: "#dcfce7", color: "#16a34a" },
        failed: { bg: "#fee2e2", color: "#dc2626" },
      };
      const s = styles[val] || styles.pending;
      return (
        <span style={{ background: s.bg, color: s.color, padding: "2px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: 600 }}>
          {val.toUpperCase()}
        </span>
      );
    },
  }),
  columnHelper.accessor("error", {
    header: "Error",
    cell: (info) => {
      const val = info.getValue();
      return val ? <span style={{ color: "#ef4444", fontSize: "12px" }}>{val}</span> : "-";
    },
  }),
];

export function TestResultsTable({ tests }: Props) {
  const table = useReactTable({
    data: tests,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  style={{
                    textAlign: "left",
                    padding: "10px 12px",
                    borderBottom: "2px solid #e5e7eb",
                    background: "#f9fafb",
                    fontWeight: 600,
                  }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} style={{ padding: "8px 12px" }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
