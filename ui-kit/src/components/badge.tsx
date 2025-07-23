import { cn } from '../lib/utils';
export function Badge({ variant, className = '', ...rest }: BadgeProps & {className?:string}) {
  return (
    <span
      {...rest}
      className={cn(
        'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium',
        variant === 'secondary' ? 'bg-gray-100 text-gray-800' : 'bg-blue-600 text-white',
        className
      )}
    />
  );
} 