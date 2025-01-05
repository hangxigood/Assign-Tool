interface LoadingErrorHandlerProps {
    isLoading: boolean;
    error: Error | null;
    children: React.ReactNode;
}

export function LoadingErrorHandler({ isLoading, error, children }: LoadingErrorHandlerProps) {
    if (error) {
        return <div className="text-red-500">Error loading work orders</div>;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
}
