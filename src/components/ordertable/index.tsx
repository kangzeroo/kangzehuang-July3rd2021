import { css } from "@emotion/css";
import { IOrderRowHash, TAskOrBid } from "@/types/tickerFeed.type";

interface IOrderTable {
  title: string;
  rows: IOrderRowHash;
  maxPriceSize: number;
  askOrBid: TAskOrBid;
  ticker: string;
}
const OrderTable = ({
  title,
  rows,
  maxPriceSize,
  askOrBid,
  ticker,
}: IOrderTable) => {
  const askOrBidOptions = {
    ask: { key: "ask", color: "red" },
    bid: { key: "bid", color: "green" },
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr className={styles.title}>
          <th>{`${title}`}</th>
        </tr>
        <tr className={styles.heading}>
          <th className={styles.head}>Price</th>
          <th className={styles.head}>Size</th>
          <th className={styles.head}>Total</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(rows)
          .map((key) => rows[parseFloat(key)])
          .filter((k) => k)
          .map((row) => {
            const { price, size, total } = row;
            const colorSpriteWidth = total / maxPriceSize;
            return (
              <tr
                key={`${askOrBid}-${price}-${ticker}`}
                className={styles.ghostRow}
              >
                {askOrBid === askOrBidOptions.ask.key ? (
                  <tr className={styles.colorSprite}>
                    <td className={styles.uncolored(colorSpriteWidth)}></td>
                    <td
                      className={styles.colored(
                        colorSpriteWidth,
                        askOrBidOptions[askOrBid].color
                      )}
                    ></td>
                  </tr>
                ) : (
                  <tr className={styles.colorSprite}>
                    <td
                      className={styles.colored(
                        colorSpriteWidth,
                        askOrBidOptions[askOrBid].color
                      )}
                    ></td>
                    <td className={styles.uncolored(colorSpriteWidth)}></td>
                  </tr>
                )}
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
  colored: (showPercentage: number, color: string) => css`
    flex: ${showPercentage * 10};
    background-color: ${color};
  `,
  uncolored: (showPercentage: number) => css`
    flex: ${(1 - showPercentage) * 10};
  `,
};
export default OrderTable;
