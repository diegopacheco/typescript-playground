import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { fetchOrders, updateOrderStatus } from "../api";
import type { Order } from "../types";

const columnHelper = createColumnHelper<Order>();

const statusColors: Record<Order["status"], string> = {
  pending: "#ff9800",
  preparing: "#2196f3",
  delivering: "#9c27b0",
  delivered: "#4caf50",
};

export function Orders() {
  const queryClient = useQueryClient();
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Order["status"] }) =>
      updateOrderStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });

  const columns = [
    columnHelper.accessor("id", {
      header: "Order #",
      cell: (info) => `#${info.getValue()}`,
    }),
    columnHelper.accessor("customerName", {
      header: "Customer",
    }),
    columnHelper.accessor("address", {
      header: "Address",
    }),
    columnHelper.accessor("total", {
      header: "Total",
      cell: (info) => `$${info.getValue().toFixed(2)}`,
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => (
        <span
          style={{
            background: statusColors[info.getValue()],
            color: "white",
            padding: "0.25rem 0.5rem",
            borderRadius: "4px",
            fontSize: "0.8rem",
          }}
        >
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: "Created",
      cell: (info) => new Date(info.getValue()).toLocaleString(),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const order = row.original;
        const nextStatus: Record<Order["status"], Order["status"] | null> = {
          pending: "preparing",
          preparing: "delivering",
          delivering: "delivered",
          delivered: null,
        };
        const next = nextStatus[order.status];
        if (!next) return null;
        return (
          <button
            onClick={() => updateStatus.mutate({ id: order.id, status: next })}
            style={{
              background: "#d32f2f",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Mark {next}
          </button>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <div>Loading orders...</div>;

  if (orders.length === 0) {
    return (
      <div>
        <h2 style={{ marginBottom: "1rem" }}>My Orders</h2>
        <p>No orders yet. Place your first order!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: "1rem" }}>My Orders</h2>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "white",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} style={{ background: "#f5f5f5" }}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      borderBottom: "2px solid #e0e0e0",
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    style={{
                      padding: "1rem",
                      borderBottom: "1px solid #e0e0e0",
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
