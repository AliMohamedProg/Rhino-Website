import * as React from 'react'

import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'placeholder:text-[#A6ACA2] focus-visible:border-[#7B3F32] focus-visible:ring-[#7B3F32]/20 aria-invalid:ring-red-500/20 aria-invalid:border-red-500 flex flex-col w-full rounded-xl border border-[#7B3F32]/15 bg-white px-4 py-3 text-sm text-[#2f2219] shadow-sm transition-all duration-300 outline-none focus-visible:ring-[4px] disabled:cursor-not-allowed disabled:opacity-50 min-h-24 hover:bg-white/90 focus:bg-white',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
