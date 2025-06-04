import * as React from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';

export type TooltipProps = {
  text: string;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  delayDuration?: number;
};

const Tooltip = ({
  text,
  children,
  side = 'top',
  align = 'center',
  delayDuration = 200,
}: TooltipProps) => (
  <RadixTooltip.Provider>
    <RadixTooltip.Root delayDuration={delayDuration}>
      <RadixTooltip.Trigger asChild>
        {children}
      </RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side={side}
          align={align}
          className="z-50 rounded bg-black px-2 py-1 text-xs text-white shadow-lg"
        >
          {text}
          <RadixTooltip.Arrow className="fill-black" />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  </RadixTooltip.Provider>
);

export { Tooltip };