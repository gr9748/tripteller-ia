
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageTransition from '@/components/PageTransition';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const PrivacyPolicy: React.FC = () => {
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
                  Privacy Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-blue dark:prose-invert max-w-none">
                <p>Last Updated: April 8, 2025</p>
                
                <h2>1. Introduction</h2>
                <p>
                  At TravelAI, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
                  disclose, and safeguard your information when you use our travel planning platform.
                </p>
                
                <h2>2. Information We Collect</h2>
                <p>We collect several types of information from and about users of our platform, including:</p>
                <ul>
                  <li>Personal information (email address, name)</li>
                  <li>Trip preferences and travel data</li>
                  <li>Usage information and browsing activity</li>
                  <li>Device information</li>
                </ul>
                
                <h2>3. How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul>
                  <li>Provide and maintain our service</li>
                  <li>Personalize your experience</li>
                  <li>Generate AI-powered travel recommendations</li>
                  <li>Improve our platform</li>
                  <li>Communicate with you about your account or trips</li>
                </ul>
                
                <h2>4. Data Security</h2>
                <p>
                  We implement appropriate security measures to protect your personal information. 
                  Your data is encrypted and stored securely. However, no method of transmission over 
                  the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
                </p>
                
                <h2>5. Third-Party Services</h2>
                <p>
                  We may employ third-party companies to facilitate our service, perform service-related tasks, 
                  or assist us in analyzing how our service is used. These third parties have access to your 
                  personal information only to perform these tasks on our behalf.
                </p>
                
                <h2>6. Contact Us</h2>
                <p>
                  If you have questions about this Privacy Policy, please contact us at privacy@travelai.example.com.
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

export default PrivacyPolicy;
