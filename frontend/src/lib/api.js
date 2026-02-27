import { QueryClient, QueryCache } from '@tanstack/react-query';

export const API = import.meta.env.VITE_API_URL;

export const authFetch = async (path, options = {}) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API}${path}`, {
        ...options,
        headers: {
            ...(options.body ? { 'Content-Type': 'application/json' } : {}),
            'Authorization': `Bearer ${token}`,
            ...options.headers,
        },
    });
    if (!res.ok) {
        let message = `${res.status}`;
        try {
            const body = await res.json();
            message = body.message || body.error || message;
        } catch { /* ignore parse errors */ }
        const err = new Error(message);
        err.status = res.status;
        throw err;
    }
    return res.json();
};

export const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (error) => {
            if (error.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        },
    }),
    defaultOptions: {
        queries: {
            retry: (failureCount, error) => {
                if ([401, 403, 404].includes(error?.status)) return false;
                return failureCount < 2;
            },
            staleTime: 1000 * 60 * 5,
        },
    },
});
