import { motion } from 'motion/react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/layout/Footer';

const sections = [
  {
    title: 'Acceptance of Terms',
    content: [
      'By accessing or using the H2H Social website and services, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.',
      'We reserve the right to update or modify these terms at any time without prior notice. Your continued use of the site after any changes constitutes acceptance of the revised terms.',
    ],
  },
  {
    title: 'Services',
    content: [
      'H2H Social provides digital marketing, branding, web development, and related consultancy services. The specific scope, deliverables, and timelines for any engagement will be outlined in a separate agreement or proposal.',
      'We reserve the right to modify, suspend, or discontinue any part of our services at any time, with or without notice.',
    ],
  },
  {
    title: 'Intellectual Property',
    content: [
      'All content on this website, including but not limited to text, graphics, logos, images, and software, is the property of H2H Social or its content suppliers and is protected by applicable intellectual property laws.',
      'You may not reproduce, distribute, modify, or create derivative works from any content on this website without our express written permission.',
      'Upon full payment for services rendered, ownership of deliverables will transfer to the client as specified in the applicable project agreement.',
    ],
  },
  {
    title: 'User Conduct',
    content: [
      'You agree to use our website and services only for lawful purposes and in accordance with these terms.',
      'You may not use our services in any way that could damage, disable, overburden, or impair our servers or networks.',
      'You may not attempt to gain unauthorized access to any part of our services, other accounts, computer systems, or networks connected to our servers.',
    ],
  },
  {
    title: 'Payment Terms',
    content: [
      'Payment terms for services will be outlined in individual project proposals or contracts. Unless otherwise agreed, invoices are due within 14 days of receipt.',
      'Late payments may incur additional charges as specified in the applicable agreement.',
      'We reserve the right to suspend services for accounts with outstanding balances.',
    ],
  },
  {
    title: 'Limitation of Liability',
    content: [
      'H2H Social shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our website or services.',
      'Our total liability for any claim arising from or related to our services shall not exceed the amount paid by you for the specific service giving rise to the claim.',
      'We do not guarantee that our website will be available at all times or that it will be free from errors or viruses.',
    ],
  },
  {
    title: 'Confidentiality',
    content: [
      'Both parties agree to maintain the confidentiality of any proprietary or sensitive information shared during the course of an engagement.',
      'This obligation of confidentiality shall survive the termination of any agreement between the parties.',
    ],
  },
  {
    title: 'Termination',
    content: [
      'Either party may terminate a service agreement with written notice as specified in the applicable contract.',
      'Upon termination, you remain responsible for any fees owed for services already rendered.',
      'We reserve the right to terminate or suspend your access to our website at our sole discretion, without notice, for conduct that we believe violates these terms or is harmful to other users.',
    ],
  },
  {
    title: 'Governing Law',
    content: [
      'These Terms and Conditions shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria.',
      'Any disputes arising under or in connection with these terms shall be subject to the exclusive jurisdiction of the courts of Lagos, Nigeria.',
    ],
  },
  {
    title: 'Contact Us',
    content: [
      'If you have any questions about these Terms and Conditions, please contact us at shannon@h2hsocial.club.',
    ],
  },
];

export function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-background-light)' }}>
      <Navigation />

      <main className="flex-1">
        <div
          className="container mx-auto px-6 md:px-12"
          style={{
            paddingTop: 'clamp(100px, 12vw, 140px)',
            paddingBottom: 'clamp(48px, 8vw, 96px)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              display: 'inline-block',
              marginBottom: '16px',
              padding: '6px 16px',
              border: '2px solid var(--color-secondary)',
              boxShadow: '4px 4px 0 var(--color-secondary)',
            }}
          >
            <span
              style={{
                fontSize: '0.68rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-stack-heading)',
                color: 'var(--color-secondary)',
              }}
            >
              Legal
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              fontWeight: 900,
              fontFamily: 'var(--font-stack-heading)',
              color: 'var(--color-text-dark)',
              lineHeight: 1,
              letterSpacing: '-0.03em',
              marginBottom: '14px',
            }}
          >
            Terms &{' '}
            <span style={{ fontStyle: 'italic', fontWeight: 400 }}>Conditions</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            style={{
              fontSize: 'clamp(0.9rem, 1.2vw, 1.05rem)',
              lineHeight: 1.7,
              opacity: 0.6,
              fontFamily: 'var(--font-stack-body)',
              maxWidth: '560px',
              marginBottom: '8px',
            }}
          >
            The rules and guidelines that govern your use of our services.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              fontSize: '0.8rem',
              fontFamily: 'var(--font-stack-heading)',
              letterSpacing: '0.1em',
              marginBottom: 'clamp(32px, 6vw, 64px)',
            }}
          >
            Effective Date: March 1, 2026
          </motion.p>

          <div className="max-w-3xl space-y-10">
            {sections.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.06 }}
              >
                <h2
                  style={{
                    fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
                    fontWeight: 700,
                    fontFamily: 'var(--font-stack-heading)',
                    color: 'var(--color-text-dark)',
                    letterSpacing: '0.04em',
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                  }}
                >
                  {section.title}
                </h2>
                <div className="space-y-3">
                  {section.content.map((paragraph, j) => (
                    <p
                      key={j}
                      style={{
                        fontSize: '0.95rem',
                        lineHeight: 1.75,
                        color: 'rgba(232,226,255,0.7)',
                        margin: 0,
                      }}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
