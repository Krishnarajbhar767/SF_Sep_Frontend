// src/queryClient.ts
import { QueryClient } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import localforage from 'localforage';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            cacheTime: 0,           // no caching
            staleTime: 0,           // always fresh
            refetchOnMount: true,   // fetch every mount
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
        }
    }
});

persistQueryClient({
    queryClient,
    persister: createAsyncStoragePersister({ storage: localforage }),
});



