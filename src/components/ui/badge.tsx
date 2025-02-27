import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

export const variants = {
  variant: {
    default: 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
    secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'border-transparent bg-red-500 text-white shadow hover:bg-red-600',
    outline: 'text-gray-700 border-gray-300 hover:bg-gray-100',
    orange: 'border-orange-200 bg-orange-50 text-orange-600 shadow',
    red: 'border-red-200 bg-red-50 text-red-600 shadow',
    yellow: 'border-yellow-200 bg-yellow-50 text-yellow-600 shadow',
    green: 'border-emerald-200 bg-emerald-50 text-emerald-600 shadow',
    blue: 'border-blue-200 bg-blue-50 text-blue-600 shadow',
    purple: 'border-violet-200 bg-violet-50 text-violet-600 shadow',
    ghost: 'border-transparent bg-gray-100 text-gray-800 shadow hover:bg-gray-200'
  }
}

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants,
    defaultVariants: {
      variant: 'default'
    }
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
