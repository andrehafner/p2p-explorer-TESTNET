import { IEnvironment } from './environment';

export const environmentProd: IEnvironment = {
    environments: [
        {
            name: '_name_',
            url: '_api_',
        },
        {
            name: 'Mainnet',
            url: 'https://explorer.ergoplatform.com',
        },
    ],
    isLoggerEnabled: false,
};
