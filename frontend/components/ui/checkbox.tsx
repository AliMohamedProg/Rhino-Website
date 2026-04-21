'use client'

import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { CheckIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer hover:border-[#7B3F32]/50 data-[state=checked]:bg-[#7B3F32] data-[state=checked]:text-white data-[state=checked]:border-[#7B3F32] focus-visible:border-[#7B3F32] focus-visible:ring-[#7B3F32]/20 aria-invalid:ring-red-500/20 aria-invalid:border-red-500 size-5 shrink-0 rounded-md border border-[#7B3F32]/20 shadow-sm transition-all outline-none focus-visible:ring-[4px] disabled:cursor-not-allowed disabled:opacity-50 overflow-hidden bg-white',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
