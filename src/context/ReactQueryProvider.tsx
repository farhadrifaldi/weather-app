'use client';

import { PropsWithChildren, ReactElement } from 'react';
import { App } from 'antd';
import {
    QueryCache,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { MessageInstance } from 'antd/es/message/interface';

// import { parseGraphQLErrorMsg } from '../utils/gqlUtils';
// import { isDev } from '../utils/envUtils';

function getQueryClient(message: MessageInstance): QueryClient {
    return new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                refetchOnWindowFocus: false,
            },
        },
        queryCache: new QueryCache({
            onError: (): void => {
                // const errMessage = parseGraphQLErrorMsg(error);
                message.error("test");
            },
        }),
    });
}

export function ReactQueryProvider(p: PropsWithChildren): ReactElement {
    const { message } = App.useApp();

    return (
        <QueryClientProvider client={getQueryClient(message)}>
            {p.children}
        </QueryClientProvider>
    );
}
