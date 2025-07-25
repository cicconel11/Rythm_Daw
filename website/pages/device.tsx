import { DeviceConnect } from '@ui-kit/components/DeviceConnect';
import { useDeviceCode } from '@shared/hooks/useDeviceCode';

export default function DevicePage() {
  const hook = useDeviceCode();
  return <DeviceConnect {...hook} />;
}
