import { motion } from 'motion/react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/layout/Footer';

const sections = [
  {
    title: 'Information We Collect',
    content: [
      'We collect information you provide directly when you use our services, such as your name, email address, and any messages you send through our contact form.',
      'We automatically collect certain technical information when you visit our website, including your IP address, browser type, operating system, referring URLs, and pages viewed. This data helps us understand how visitors interact with our site.',
      'We may use cookies and similar tracking technologies to enhance your browsing experience and gather usage analytics.',
    ],
  },
  {
    title: 'How We Use Your Information',
    content: [
      'To provide, maintain, and improve our services and website.',
      'To respond to your inquiries, comments, or questions submitted through our contact form.',
      'To send you updates, newsletters, or marketing communications that you have opted in to receive.',
      'To analyze website usage trends and optimize the user experience.',
      'To protect against fraud, unauthorized access, and other illegal activities.',
    ],
  },
  {
    title: 'Information Sharing',
    content: [
      'We do not sell, trade, or rent your personal information to third parties.',
      'We may share your information with trusted service providers who assist us in operating our website and conducting our business, provided they agree to keep your information confidential.',
      'We may disclose your information when required by law, regulation, or legal process, or when we believe disclosure is necessary to protect our rights or the safety of others.',
    ],
  },
  {
    title: 'Data Security',
    content: [
      'We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.',
      'While we strive to protect your personal data, no method of transmission over the internet or electronic storage is completely secure. We cannot guarantee absolute security.',
    ],
  },
  {
    title: 'Your Rights',
    content: [
      'You have the right to access, correct, or delete your personal information held by us.',
      'You may opt out of receiving marketing communications at any time by following the unsubscribe instructions included in our emails.',
      'You may request a copy of the personal data we hold about you by contacting us directly.',
    ],
  },
  {
    title: 'Third-Party Links',
    content: [
      'Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.',
    ],
  },
  {
    title: 'Changes to This Policy',
    content: [
      'We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically.',
    ],
  },
  {
    title: 'Contact Us',
    content: [
      'If you have any questions or concerns about this Privacy Policy, please contact us at shannon@h2hsocial.club.',
    ],
  },
];

export function PrivacyPage() {
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
            Privacy{' '}
            <span style={{ fontStyle: 'italic', fontWeight: 400 }}>Policy</span>
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
            How we collect, use, and protect your information.
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
