import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-[#A6ACA2] selection:bg-[#7B3F32] selection:text-white bg-white hover:bg-white/90 focus:bg-white backdrop-blur-sm border-[#7B3F32]/15 h-11 w-full min-w-0 rounded-xl border px-4 py-2 text-sm text-[#2f2219] shadow-sm transition-all duration-300 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:border-[#7B3F32] focus-visible:ring-[#7B3F32]/20 focus-visible:ring-[4px]',
        'aria-invalid:ring-red-500/20 aria-invalid:border-red-500',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
