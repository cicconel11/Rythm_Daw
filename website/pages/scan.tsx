import { OnboardScan } from '@ui-kit/components/OnboardScan';
import { usePluginDownload } from '@shared/hooks/usePluginDownload';

export default function ScanPage() {
  const hook = usePluginDownload();
  return <OnboardScan {...hook} />;
}
