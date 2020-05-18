import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NASDAQ_INDEX_HISTORY_URL =
  'https://financialmodelingprep.com/api/v3/historical-price-full/index/%5EIXIC';

const CounterPanel = () => {
  const [daysSinceLastRedFlag, setDaysSinceLastRedFlag] = useState('');

  useEffect(() => {
    axios.get(NASDAQ_INDEX_HISTORY_URL).then((response) => {
      const historicalData = response.data.historical;

      const redFlags = historicalData
        .map((day, index) => {
          const previousDay =
            index + 1 < historicalData.length
              ? historicalData[index + 1]
              : undefined;

          const changeFromPreviousDay =
            previousDay &&
            Math.floor(
              ((day.close - previousDay.close) / previousDay.close) * 100 * 100
            ) / 100;

          return {
            ...day,
            changeFromPreviousDay,
          };
        })
        .filter((day) => day.changeFromPreviousDay <= -3);

      const daysSinceLastRedFlag =
        redFlags.length &&
        Math.floor(
          (Date.now() - new Date(redFlags[0].date)) / (1000 * 3600 * 24)
        );

      setDaysSinceLastRedFlag(daysSinceLastRedFlag);
    });
  });

  return (
    <div>
      <h3>Last red flag</h3>
      <span>{daysSinceLastRedFlag} days ago</span>
    </div>
  );
};

export default CounterPanel;
