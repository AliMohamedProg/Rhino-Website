import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-[#7B3F32] to-[#9e5948] hover:from-[#5f3026] hover:to-[#8e4f3f] text-white shadow-md hover:shadow-lg border-0 transition-all duration-300',
        destructive: 'bg-red-50 text-red-600 hover:bg-red-100/80 hover:text-red-700 shadow-sm border-0 transition-all font-semibold',
        outline: 'border-[#7B3F32]/15 bg-white/50 backdrop-blur-sm shadow-sm hover:bg-[#7B3F32]/5 hover:border-[#7B3F32]/30 text-[#7B3F32] font-semibold transition-all',
        secondary: 'bg-[#f6eee8] text-[#7B3F32] hover:bg-[#efe3d9] shadow-sm font-semibold transition-all',
        ghost: 'hover:bg-[#7B3F32]/5 hover:text-[#7B3F32] text-foreground transition-all duration-200',
        link: 'text-[#7B3F32] underline-offset-4 hover:underline transition-all',
      },
      size: {
        default: 'h-11 px-5 py-2 has-[>svg]:px-4 rounded-xl',
        sm: 'h-9 rounded-lg gap-1.5 px-3 has-[>svg]:px-2.5 text-xs font-semibold',
        lg: 'h-12 rounded-xl px-8 has-[>svg]:px-5 text-base font-bold',
        icon: 'size-11 rounded-xl',
        'icon-sm': 'size-9 rounded-lg',
        'icon-lg': 'size-12 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
