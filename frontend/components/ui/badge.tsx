import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-xl border px-2.5 py-1 text-xs font-semibold tracking-wide w-fit whitespace-nowrap shrink-0 [&>svg]:size-3.5 gap-1.5 [&>svg]:pointer-events-none focus-visible:border-[#7B3F32] focus-visible:ring-[#7B3F32]/20 focus-visible:ring-[3px] transition-all duration-300 overflow-hidden shadow-sm',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-gradient-to-r from-[#7B3F32] to-[#9e5948] text-white [a&]:hover:opacity-90 shadow-sm',
        secondary:
          'border-transparent bg-gray-100 text-gray-800 [a&]:hover:bg-gray-200',
        destructive:
          'border-transparent bg-red-100 text-red-800 [a&]:hover:bg-red-200',
        outline:
          'text-[#7B3F32] border-[#7B3F32]/20 bg-white/50 backdrop-blur-sm [a&]:hover:bg-[#7B3F32]/5',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
