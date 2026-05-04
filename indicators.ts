// @params{period} - the period for which ema is calculated, e.g. 20 for 20-period ema.
import type { Candlestick, Candlesticks } from "./lighter-sdk-ts/generated";


export function getEma(prices: number[], period: number): number[] {
    const multiplier = 2 / (period + 1);

    if (prices.length< period){
        throw new Error("not enough price provided")
    }

    let sma = 0;
    for(let i=0; i< period; i++){
        sma += (prices[i] ?? 0);
    }

    sma /= period;
    
    const emas = [sma];


   for (let i = period; i < prices.length; i++) {
        const ema = (emas[emas.length - 1] ?? 0) * (1 - multiplier) + (prices[i] ?? 0) * multiplier;
        emas.push(ema);
    }

    return emas;
    
}

export function getMiddlePrice(candlesticks: Candlestick[] ){
    return candlesticks.map(({ open, close })=>Number(((open + close ) /2).toFixed(2)));
}

// macd => ema26 - ema14
export function getMacd(prices: number[]){
   const ema26 = getEma(prices, 26);
   let ema12 = getEma(prices, 12); 

   ema12 = ema12.slice(-ema26.length);

    console.log(ema12.length, ema26.length);
    const macd = ema12.map((_, index) => (ema12[index] ?? 0) - (ema26[index] ?? 0));
    return macd
}