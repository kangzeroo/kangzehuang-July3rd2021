import { css } from "@emotion/css";
import { TOrderRow } from "@/types/tickerFeed.type";

interface IOrderTable {
  title: string;
  rows: TOrderRow[];
  maxPriceSize: number;
}
const OrderTable = ({ title, rows, maxPriceSize }: IOrderTable) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr className={styles.title}>
          <th>{`${maxPriceSize} - ${title}`}</th>
        </tr>
        <tr className={styles.heading}>
          <th className={styles.head}>Price</th>
          <th className={styles.head}>Size</th>
          <th className={styles.head}>Total</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => {
          const { price, size, total } = row;
          const colorSpriteWidth = total / maxPriceSize;
          return (
            <tr className={styles.ghostRow}>
              <div className={styles.colorSprite}>
                <div className={styles.colored(colorSpriteWidth)}></div>
                <div className={styles.uncolored(colorSpriteWidth)}></div>
              </div>
              <tr className={styles.row}>
                <td className={styles.cell}>{price}</td>
                <td className={styles.cell}>{size}</td>
                <td className={styles.cell}>{total}</td>
              </tr>
            </tr>
          );
        })}
      </tbody>
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
    top: 0;
    position: absolute;
    width: 100%;
  `,
  cell: css`
    text-align: right;
    width: 100%;
  `,
  ghostRow: css`
    position: relative;
    display: flex;
  `,
  colorSprite: css`
    width: 100%;
    height: 100%;
    /* position: absolute; */
    display: flex;
    min-height: 20px;
    height: 100%;
  `,
  colored: (showPercentage: number, color = "red") => css`
    flex: ${showPercentage * 10};
    background-color: ${color};
  `,
  uncolored: (showPercentage: number) => css`
    flex: ${(1 - showPercentage) * 10};
  `,
};
export default OrderTable;
