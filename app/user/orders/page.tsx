import Pagination from "@/components/shared/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMyOrders } from "@/lib/actions/order.actions";
import { currencyFormat, formatDateTime, formatId } from "@/lib/utils";
import Link from "next/link";

const OrdersPage = async (props: {
  searchParams: Promise<{ page: string }>;
}) => {
  const { page } = await props.searchParams;

  const orders = await getMyOrders({ page: Number(page) || 1 });

  return (
    <div className="space-y-2">
      <h1 className="h2-bold">Orders</h1>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>TOTAL</TableHead>
              <TableHead>PAID</TableHead>
              <TableHead>DELIVERED</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.data.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{formatId(order.id)}</TableCell>
                <TableCell>
                  {formatDateTime(order.createdAt as Date).dateOnly}
                </TableCell>
                <TableCell>{currencyFormat(order.totalPrice)}</TableCell>
                <TableCell>
                  {order.isPaid && order.paidAt
                    ? formatDateTime(order.paidAt).dateTime
                    : "Not Paid"}
                </TableCell>
                <TableCell>
                  {order.isDelivered && order.deliveredAt
                    ? formatDateTime(order.deliveredAt).dateTime
                    : "Not Delivered"}
                </TableCell>
                <TableCell>
                  <Link href={`/order/${order.id}`}>
                  Details</Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {orders.totalPages > 1 && (
          <Pagination page={Number(page) || 1} totalPages={orders.totalPages} />
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
