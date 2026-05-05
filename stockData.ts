import { getEma, getMacd, getMiddlePrice } from "./indicators";
import { CandlestickApi, IsomorphicFetchHttpLibrary, ServerConfiguration } from "./lighter-sdk-ts/generated";
const BASE_URL = "https://testnet.zklighter.elliot.ai"
const SOL_MARKET_ID = 0

 const klinesApi = new CandlestickApi({
        baseServer: new ServerConfiguration<{  }>(BASE_URL, {  }),
        httpApi: new IsomorphicFetchHttpLibrary(),
        middleware: [],
        authMethods: {}
    });

   export async function getIndicators(duration: "5m" | "4h", marketId: number){
    const klines = await klinesApi.candlesticks(SOL_MARKET_ID, '4h', Date.now() - 1000 * 60 * 60 * (duration === "5m" ? 2 : 96), Date.now(), 50, false);
    const midPrice = getMiddlePrice(klines.candlesticks);
    const macd = getMacd(midPrice).slice(-10);
    const ema20s = getEma(midPrice, 20);

    return{
        midPrice: midPrice.slice(-10),
        macd : macd.slice(-10),
        ema20s: ema20s.slice(-10)
    }
    }

