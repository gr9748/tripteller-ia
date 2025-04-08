
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageTransition from '@/components/PageTransition';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const TermsOfService: React.FC = () => {
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
                  Terms of Service
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-blue dark:prose-invert max-w-none">
                <p>Last Updated: April 8, 2025</p>
                
                <h2>1. Acceptance of Terms</h2>
                <p>
                  By accessing or using TravelAI, you agree to be bound by these Terms of Service and all 
                  applicable laws and regulations. If you do not agree with any of these terms, you are 
                  prohibited from using this service.
                </p>
                
                <h2>2. User Accounts</h2>
                <p>
                  When you create an account with us, you must provide accurate and complete information. 
                  You are responsible for maintaining the confidentiality of your account credentials and 
                  for all activities that occur under your account.
                </p>
                
                <h2>3. Service Description</h2>
                <p>
                  TravelAI provides an AI-powered travel planning platform that helps users discover and 
                  organize trips. Our service uses artificial intelligence to recommend destinations, 
                  accommodations, and activities based on user preferences.
                </p>
                
                <h2>4. User Content</h2>
                <p>
                  Any content you submit to the platform remains your property, but you grant us a license 
                  to use it for providing and improving our services. You are solely responsible for any 
                  content you submit.
                </p>
                
                <h2>5. Limitation of Liability</h2>
                <p>
                  TravelAI shall not be liable for any indirect, incidental, special, consequential, or 
                  punitive damages resulting from your use or inability to use the service, or from any 
                  content or services obtained through the platform.
                </p>
                
                <h2>6. Changes to Terms</h2>
                <p>
                  We reserve the right to modify these terms at any time. Your continued use of the platform 
                  following any changes constitutes your acceptance of the revised terms.
                </p>
                
                <h2>7. Contact Us</h2>
                <p>
                  If you have questions about these Terms, please contact us at legal@travelai.example.com.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </main>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default TermsOfService;
