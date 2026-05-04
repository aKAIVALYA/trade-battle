import { getEma, getMacd, getMiddlePrice } from "./indicators";
import { CandlestickApi, IsomorphicFetchHttpLibrary, ServerConfiguration } from "./lighter-sdk-ts/generated";
const BASE_URL = "https://testnet.zklighter.elliot.ai"
const SOL_MARKET_ID = 0

async function getKlines(marketId: number) {
    const klinesApi = new CandlestickApi({
        baseServer: new ServerConfiguration<{  }>(BASE_URL, {  }),
        httpApi: new IsomorphicFetchHttpLibrary(),
        middleware: [],
        authMethods: {}
    });

    const klines = await klinesApi.candlesticks(SOL_MARKET_ID, '4h', Date.now() - 1000 * 60 * 60 * 24, Date.now(), 50, false);
    const midPrice = getMiddlePrice(klines.candlesticks);
    console.log(midPrice.slice(-10));
   const ema20s = getEma(midPrice, 20);
    console.log(ema20s.slice(-10));
    const macd = getMacd(midPrice);
    console.log(macd.slice(-10));
}

getKlines(SOL_MARKET_ID);