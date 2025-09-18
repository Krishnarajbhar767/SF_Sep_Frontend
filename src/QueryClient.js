// src/queryClient.ts
import { QueryClient } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import localforage from 'localforage';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 10,
            cacheTime: 1000 * 60 * 30,
        },
    },
});

persistQueryClient({
    queryClient,
    persister: createAsyncStoragePersister({ storage: localforage }),
});



