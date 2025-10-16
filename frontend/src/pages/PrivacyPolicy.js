import React from 'react';
import styled from 'styled-components';

const PolicyContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 20px;
`;

const PolicyTitle = styled.h1`
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
`;

const PolicyContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const Section = styled.section`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  color: #667eea;
  margin-bottom: 1rem;
`;

const SectionText = styled.p`
  line-height: 1.6;
  color: #34495e;
  margin-bottom: 1rem;
`;

const List = styled.ul`
  margin-left: 2rem;
  margin-bottom: 1rem;
`;

const ListItem = styled.li`
  margin-bottom: 0.5rem;
  color: #34495e;
`;

const LastUpdated = styled.p`
  text-align: center;
  color: #7f8c8d;
  font-style: italic;
  margin-top: 2rem;
`;

const PrivacyPolicy = () => {
  return (
    <PolicyContainer>
      <PolicyTitle>Privacy Policy</PolicyTitle>
      
      <PolicyContent>
        <Section>
          <SectionTitle>Introduction</SectionTitle>
          <SectionText>
            Welcome to our Privacy Policy. This policy outlines how we collect, use, and protect your personal information 
            when you use our e-commerce platform. We are committed to protecting your privacy and ensuring the security 
            of your personal data.
          </SectionText>
        </Section>

        <Section>
          <SectionTitle>Information We Collect</SectionTitle>
          <SectionText>
            We collect several types of information to provide and improve our services:
          </SectionText>
          <List>
            <ListItem>Personal Information: Name, email address, shipping address, phone number</ListItem>
            <ListItem>Payment Information: Credit card details, billing address</ListItem>
            <ListItem>Technical Information: IP address, browser type, device information</ListItem>
            <ListItem>Usage Information: Pages visited, products viewed, purchase history</ListItem>
            <ListItem>Cookies and Tracking Technologies</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>How We Use Your Information</SectionTitle>
          <SectionText>
            We use your information for various purposes, including:
          </SectionText>
          <List>
            <ListItem>Processing and fulfilling your orders</ListItem>
            <ListItem>Providing customer support</ListItem>
            <ListItem>Sending transactional emails and order updates</ListItem>
            <ListItem>Personalizing your shopping experience</ListItem>
            <ListItem>Improving our products and services</ListItem>
            <ListItem>Marketing and promotional communications (with your consent)</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>Information Sharing</SectionTitle>
          <SectionText>
            We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, 
            except in the following circumstances:
          </SectionText>
          <List>
            <ListItem>Service providers who assist in operating our platform</ListItem>
            <ListItem>Payment processors for transaction processing</ListItem>
            <ListItem>Shipping companies for order delivery</ListItem>
            <ListItem>Legal requirements or law enforcement requests</ListItem>
            <ListItem>Business transfers or mergers</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>Data Security</SectionTitle>
          <SectionText>
            We implement appropriate security measures to protect your personal information against unauthorized access, 
            alteration, disclosure, or destruction. These include SSL encryption, secure servers, and regular security 
            audits.
          </SectionText>
        </Section>

        <Section>
          <SectionTitle>Your Rights</SectionTitle>
          <SectionText>
            You have the right to:
          </SectionText>
          <List>
            <ListItem>Access and update your personal information</ListItem>
            <li>Request deletion of your personal data</li>
            <li>Opt-out of marketing communications</li>
            <li>Restrict processing of your information</li>
            <li>Data portability</li>
          </List>
        </Section>

        <Section>
          <SectionTitle>Cookies Policy</SectionTitle>
          <SectionText>
            We use cookies to enhance your experience on our website. Cookies help us remember your preferences, 
            analyze website traffic, and personalize content. You can control cookie settings through your browser preferences.
          </SectionText>
        </Section>

        <Section>
          <SectionTitle>Changes to This Policy</SectionTitle>
          <SectionText>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the 
            new policy on this page and updating the "Last Updated" date.
          </SectionText>
        </Section>

        <Section>
          <SectionTitle>Contact Us</SectionTitle>
          <SectionText>
            If you have any questions about this Privacy Policy or our data practices, please contact us at:
          </SectionText>
          <SectionText>
            Email: privacy@example.com<br />
            Phone: 1-800-123-4567<br />
            Address: 123 Privacy Street, Security City, SC 12345
          </SectionText>
        </Section>

        <LastUpdated>
          Last Updated: January 15, 2024
        </LastUpdated>
      </PolicyContent>
    </PolicyContainer>
  );
};

export default PrivacyPolicy;