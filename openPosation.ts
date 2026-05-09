import { AccountApi, AccountPosition, ApiKeyAuthentication, IsomorphicFetchHttpLibrary, OrderApi, ServerConfiguration } from "./lighter-sdk-ts/generated";

const BASE_URL = "https://mainnet.zklighter.elliot.ai"
const ACCOUNT_INDEX = 283587

export async function getOpenPositions(apiKey: string) {
    const accountApi = new AccountApi({
        baseServer: new ServerConfiguration<{  }>(BASE_URL, {  }),
        httpApi: new IsomorphicFetchHttpLibrary(),
        middleware: [],
        authMethods: {
            apiKey: new ApiKeyAuthentication(apiKey)
        }
    });

    const currentOpenOrders = await accountApi.accountWithHttpInfo(
        'index',
        ACCOUNT_INDEX.toString()
    );

    console.log(currentOpenOrders.data.accounts[0]?.positions);
    return currentOpenOrders.data.accounts[0]?.positions.map((AccountPosition) =>({
        symbol: AccountPosition.symbol,
        positions: AccountPosition.position,
        sign : AccountPosition.sign == 1 ? 'long' : 'short',
        unrealizedPnl: AccountPosition.unrealizedPnl,
        realizedPnl: AccountPosition.realizedPnl,
        liquidationPrice : AccountPosition.liquidationPrice,
    }));
}



