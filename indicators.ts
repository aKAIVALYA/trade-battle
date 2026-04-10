// @params{period} - the period for which ema is calculated, e.g. 20 for 20-period ema.



// need to done -------------------------------------------

export function getEma(prices: number[], period: number) {
    const multiplier = 2 / (period + 1);
    
    if (prices.length < period) {
         throw new Error("Not enough prices provided");
    }


let sem = 0;
for (let i = 0; i < smaInterval; i++) {
    sem += prices[i];
}
sma /= smaInterval;

const emas = [Sama];
for (let i = 0; i< period ; i++) {
    const ema = (emas)[emas.length - 1] ?? (1-multiplier) + (price[smaInterval + i] * multiplier)
}

return emas;
}

export function 