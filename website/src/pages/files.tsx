import { useTransfers, useTransferActions } from "@shared/hooks";
import { ErrorBoundary } from "react-error-boundary";

export default function Files() {
  const { data: transfers, isLoading } = useTransfers();
  const { accept, decline, download } = useTransferActions();

  return (
    <ErrorBoundary fallback={<div>Error loading transfers</div>}>
      {isLoading ? (
        <Skeleton />
      ) : (
        <div>
          {transfers?.map((t) => (
            <TransferItem
              key={t.id}
              transfer={t}
              onAccept={() => accept.mutate({ id: t.id })}
              onDecline={() => decline.mutate({ id: t.id })}
              onDownload={() => download.mutate(t.id)}
            />
          ))}
        </div>
      )}
    </ErrorBoundary>
  );
}
