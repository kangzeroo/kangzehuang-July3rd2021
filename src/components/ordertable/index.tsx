import { TOrderRow } from "@/types/tickerFeed.type";

interface IOrderTable {
  title: string;
  rows: TOrderRow[];
}
const OrderTable = ({ title, rows }: IOrderTable) => {
  return (
    <table>
      <tr>
        <th>{title}</th>
      </tr>
      <tr>
        <th>Price</th>
        <th>Size</th>
        <th>Total</th>
      </tr>
      {rows.map((row) => {
        const { price, size, total } = row;
        return (
          <tr>
            <td>{price}</td>
            <td>{size}</td>
            <td>{total}</td>
          </tr>
        );
      })}
    </table>
  );
};
export default OrderTable;
