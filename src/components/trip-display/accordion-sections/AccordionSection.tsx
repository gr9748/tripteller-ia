
import React from 'react';
import { 
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { LucideIcon } from 'lucide-react';

interface AccordionSectionProps {
  value: string;
  icon: LucideIcon;
  title: string;
  gradientFrom: string;
  gradientTo: string;
  hoverColor: string;
  darkHoverColor: string;
  children: React.ReactNode;
  borderClass?: string;
}

export const AccordionSection: React.FC<AccordionSectionProps> = ({
  value,
  icon: Icon,
  title,
  gradientFrom,
  gradientTo,
  hoverColor,
  darkHoverColor,
  children,
  borderClass = "border-primary/10"
}) => {
  return (
    <AccordionItem value={value} className={`border-b-2 ${borderClass}`}>
      <AccordionTrigger className="py-4 group">
        <div className="flex items-center">
          <div className={`bg-gradient-to-r from-${gradientFrom} to-${gradientTo} p-1.5 rounded-full text-white mr-2`}>
            <Icon className="h-5 w-5" />
          </div>
          <span className={`group-hover:text-${hoverColor} dark:group-hover:text-${darkHoverColor}`}>{title}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        {children}
      </AccordionContent>
    </AccordionItem>
  );
};
