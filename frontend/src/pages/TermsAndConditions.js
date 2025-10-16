import React from 'react';
import styled from 'styled-components';

const TermsContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 20px;
`;

const TermsTitle = styled.h1`
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
`;

const TermsContent = styled.div`
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

const SubSection = styled.div`
  margin: 1rem 0;
  padding-left: 1rem;
  border-left: 3px solid #e3f2fd;
`;

const SubSectionTitle = styled.h3`
  color: #2c3e50;
  margin-bottom: 0.5rem;
`;

const LastUpdated = styled.p`
  text-align: center;
  color: #7f8c8d;
  font-style: italic;
  margin-top: 2rem;
`;

const TermsAndConditions = () => {
  return (
    <TermsContainer>
      <TermsTitle>Terms and Conditions</TermsTitle>
      
      <TermsContent>
        <Section>
          <SectionTitle>1. Acceptance of Terms</SectionTitle>
          <SectionText>
            By accessing and using our e-commerce platform, you accept and agree to be bound by the terms 
            and provision of this agreement. If you do not agree to abide by the above, please do not use 
            this service.
          </SectionText>
        </Section>

        <Section>
          <SectionTitle>2. User Accounts</SectionTitle>
          <SectionText>
            To access certain features of our platform, you must register for an account. When you register 
            you agree to:
          </SectionText>
          <List>
            <ListItem>Provide accurate, current, and complete information</ListItem>
            <ListItem>Maintain and update your account information</ListItem>
            <ListItem>Keep your password secure and confidential</ListItem>
            <ListItem>Accept responsibility for all activities under your account</ListItem>
            <ListItem>Notify us immediately of any unauthorized use</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>3. Products and Services</SectionTitle>
          <SectionText>
            We strive to provide accurate descriptions of our products. However, we do not warrant that 
            product descriptions, colors, information, or other content of the products are accurate, 
            complete, reliable, current, or error-free.
          </SectionText>
          
          <SubSection>
            <SubSectionTitle>Product Availability</SubSectionTitle>
            <SectionText>
              All products are subject to availability. We reserve the right to discontinue any products 
              at any time. We may limit quantities available for purchase.
            </SectionText>
          </SubSection>
          
          <SubSection>
            <SubSectionTitle>Pricing</SubSectionTitle>
            <SectionText>
              Prices are subject to change without notice. We are not responsible for typographical errors. 
              All prices are displayed in the currency specified on the platform.
            </SectionText>
          </SubSection>
        </Section>

        <Section>
          <SectionTitle>4. Orders and Payment</SectionTitle>
          <SectionText>
            By placing an order, you offer to purchase the products specified in your order. We reserve 
            the right to accept or decline your order for any reason.
          </SectionText>
          
          <SubSection>
            <SubSectionTitle>Payment Methods</SubSectionTitle>
            <SectionText>
              We accept various payment methods as specified on our platform. Payment information is 
              processed securely through our payment partners.
            </SectionText>
          </SubSection>
          
          <SubSection>
            <SubSectionTitle>Order Confirmation</SubSectionTitle>
            <SectionText>
              You will receive an order confirmation email once your order is successfully placed. This 
              confirmation does not guarantee product availability.
            </SectionText>
          </SubSection>
        </Section>

        <Section>
          <SectionTitle>5. Shipping and Delivery</SectionTitle>
          <SectionText>
            We ship products according to the shipping method selected during checkout. Delivery times 
            are estimates and cannot be guaranteed.
          </SectionText>
          <List>
            <ListItem>Risk of loss passes to you upon delivery</ListItem>
            <ListItem>We are not responsible for shipping delays</ListItem>
            <ListItem>International orders may be subject to customs fees</ListItem>
            <ListItem>Some products may have shipping restrictions</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>6. Returns and Refunds</SectionTitle>
          <SectionText>
            Our return policy allows you to return products within 30 days of delivery. Products must be 
            unused, in original packaging, and in resalable condition.
          </SectionText>
          
          <SubSection>
            <SubSectionTitle>Non-Returnable Items</SubSectionTitle>
            <List>
              <ListItem>Customized or personalized products</ListItem>
              <ListItem>Perishable goods</ListItem>
              <ListItem>Digital downloads</ListItem>
              <ListItem>Intimate apparel</ListItem>
            </List>
          </SubSection>
        </Section>

        <Section>
          <SectionTitle>7. Intellectual Property</SectionTitle>
          <SectionText>
            All content on this platform, including logos, images, text, graphics, and software, is the 
            property of our company or our content suppliers and is protected by intellectual property laws.
          </SectionText>
        </Section>

        <Section>
          <SectionTitle>8. User Conduct</SectionTitle>
          <SectionText>
            You agree not to use our platform to:
          </SectionText>
          <List>
            <ListItem>Violate any applicable laws or regulations</ListItem>
            <ListItem>Infringe on intellectual property rights</ListItem>
            <ListItem>Upload malicious code or viruses</ListItem>
            <ListItem>Interfere with or disrupt the platform</ListItem>
            <ListItem>Harass, abuse, or harm other users</ListItem>
            <ListItem>Send unsolicited communications</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>9. Privacy</SectionTitle>
          <SectionText>
            Your privacy is important to us. Please review our Privacy Policy, which also governs your 
            use of our platform, to understand our practices.
          </SectionText>
        </Section>

        <Section>
          <SectionTitle>10. Limitation of Liability</SectionTitle>
          <SectionText>
            In no event shall our company, its directors, employees, partners, agents, suppliers, or 
            affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, 
            including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
          </SectionText>
        </Section>

        <Section>
          <SectionTitle>11. Indemnification</SectionTitle>
          <SectionText>
            You agree to indemnify and hold our company and its affiliates harmless from any claim or 
            demand, including reasonable attorneys' fees, made by any third-party due to or arising out 
            of your breach of these terms or the documents they incorporate by reference.
          </SectionText>
        </Section>

        <Section>
          <SectionTitle>12. Termination</SectionTitle>
          <SectionText>
            We may terminate or suspend your account and bar access to the service immediately, without 
            prior notice or liability, under our sole discretion, for any reason whatsoever and without 
            limitation.
          </SectionText>
        </Section>

        <Section>
          <SectionTitle>13. Changes to Terms</SectionTitle>
          <SectionText>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
            If a revision is material, we will try to provide at least 30 days notice prior to any new 
            terms taking effect.
          </SectionText>
        </Section>

        <Section>
          <SectionTitle>14. Contact Information</SectionTitle>
          <SectionText>
            If you have any questions about these Terms and Conditions, please contact us at:
          </SectionText>
          <SectionText>
            Email: legal@example.com<br />
            Phone: 1-800-123-4567<br />
            Address: 123 Legal Street, Compliance City, CC 12345
          </SectionText>
        </Section>

        <LastUpdated>
          Last Updated: January 15, 2024
        </LastUpdated>
      </TermsContent>
    </TermsContainer>
  );
};

export default TermsAndConditions;