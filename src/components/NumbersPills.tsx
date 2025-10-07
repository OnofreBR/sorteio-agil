import clsx from 'clsx';

interface NumbersPillsProps {
  numbers: string[];
  variant?: 'default' | 'secondary';
  size?: 'sm' | 'md';
  ariaLabel?: string;
}

const sizeClasses: Record<NonNullable<NumbersPillsProps['size']>, string> = {
  sm: 'w-10 h-10 text-sm',
  md: 'w-12 h-12 text-base md:w-14 md:h-14 md:text-lg',
};

const NumbersPills = ({ numbers, variant = 'default', size = 'md', ariaLabel }: NumbersPillsProps) => {
  if (!numbers.length) return <p className="text-sm text-muted-foreground">—</p>;

  return (
    <ul className="flex flex-wrap gap-2" aria-label={ariaLabel}>
      {numbers.map((value, index) => (
        <li
          key={`${value}-${index}`}
          className={clsx(
            'flex items-center justify-center rounded-full font-semibold shadow-md transition-transform duration-150 hover:scale-105',
            sizeClasses[size],
            variant === 'default'
              ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white'
              : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white',
          )}
        >
          {value}
        </li>
      ))}
    </ul>
  );
};

export default NumbersPills;

