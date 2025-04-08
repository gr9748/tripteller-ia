
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import PageTransition from '@/components/PageTransition';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Faq: React.FC = () => {
  const faqs = [
    {
      question: "How does TravelAI create trip plans?",
      answer: "TravelAI uses advanced artificial intelligence to analyze your preferences, budget, and travel dates to create personalized trip recommendations. Our system considers factors like popular attractions, local hidden gems, seasonal events, and your specified interests to build a comprehensive travel itinerary."
    },
    {
      question: "Is my personal information secure?",
      answer: "Yes, we take data security very seriously. All personal information is encrypted using 256-bit encryption and stored securely. We never share your personal information with third parties without your explicit consent. Our platform complies with GDPR and other privacy regulations."
    },
    {
      question: "Can I modify a trip plan after it's generated?",
      answer: "Currently, you cannot directly edit a generated plan within the platform. However, you can create a new plan with adjusted preferences. We're working on adding editing capabilities in a future update."
    },
    {
      question: "How accurate are the hotel and restaurant recommendations?",
      answer: "Our recommendations are based on current data sources and reviews. While we strive for accuracy, we recommend verifying availability and details directly with the establishments before making reservations, especially during peak travel seasons."
    },
    {
      question: "What should I do if I encounter a technical issue?",
      answer: "If you experience any technical issues, please refresh your browser first. If the problem persists, you can contact our support team through the help section. Please include details about the issue and any error messages you received to help us resolve it quickly."
    }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 container mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-400 dark:to-indigo-400">
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-lg font-medium text-blue-700 dark:text-blue-400">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </motion.div>
        </main>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Faq;
