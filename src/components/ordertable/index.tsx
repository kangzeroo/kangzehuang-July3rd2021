import { css } from "@emotion/css";
import { TOrderRow } from "@/types/tickerFeed.type";

interface IOrderTable {
  title: string;
  rows: TOrderRow[];
}
const OrderTable = ({ title, rows }: IOrderTable) => {
  return (
    <table className={styles.table}>
      <tr className={styles.title}>
        <th>{title}</th>
      </tr>
      <tr className={styles.heading}>
        <th className={styles.head}>Price</th>
        <th className={styles.head}>Size</th>
        <th className={styles.head}>Total</th>
      </tr>
      {rows.map((row) => {
        const { price, size, total } = row;
        return (
          <tr className={styles.row}>
            <td className={styles.cell}>{price}</td>
            <td className={styles.cell}>{size}</td>
            <td className={styles.cell}>{total}</td>
          </tr>
        );
      })}
    </table>
  );
};
const styles = {
  table: css`
    color: white;
    width: 100%;
    text-align: right;
    display: flex;
    flex-direction: column;
  `,
  title: css`
    display: flex;
    flex-direction: column;
  `,
  heading: css`
    font-weight: 400;
    display: flex;
  `,
  head: css`
    border-bottom: 1px solid white;
    font-weight: 200;
    width: 100%;
  `,
  row: css`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  `,
  cell: css`
    text-align: right;
    width: 100%;
  `,
};
export default OrderTable;
