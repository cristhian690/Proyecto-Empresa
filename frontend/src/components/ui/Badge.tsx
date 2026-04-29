import { cn } from '../../lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'purple'
  className?: string
}

const variants = {
  blue:   'bg-blue-100 text-blue-800 border border-blue-200',
  green:  'bg-green-100 text-green-800 border border-green-200',
  yellow: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  red:    'bg-red-100 text-red-800 border border-red-200',
  gray:   'bg-gray-100 text-gray-700 border border-gray-200',
  purple: 'bg-purple-100 text-purple-800 border border-purple-200',
}

export default function Badge({
  children,
  variant = 'blue',
  className,
}: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold',
      variants[variant],
      className
    )}>
      {children}
    </span>
  )
}