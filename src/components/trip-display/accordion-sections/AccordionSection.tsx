
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
  // Create className for the icon gradient background
  const iconBgClass = `bg-gradient-to-br from-${gradientFrom} to-${gradientTo} p-2 rounded-full text-white mr-3 shadow-sm`;

  return (
    <AccordionItem value={value} className={`border-b-2 ${borderClass} mb-3`}>
      <AccordionTrigger className="py-4 group">
        <div className="flex items-center">
          <div className={iconBgClass}>
            <Icon className="h-5 w-5" />
          </div>
          <span className={`text-lg font-medium group-hover:text-${hoverColor} dark:group-hover:text-${darkHoverColor}`}>
            {title}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-2">
        {children}
      </AccordionContent>
    </AccordionItem>
  );
};
