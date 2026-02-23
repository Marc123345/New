import { motion } from 'motion/react';
import { Linkedin, Twitter, Instagram } from 'lucide-react';
import { H2HLogo } from '../H2HLogo';

const SOCIAL_LINKS = [
  { label: 'LinkedIn', icon: Linkedin, href: '#' },
  { label: 'Twitter', icon: Twitter, href: '#' },
  { label: 'Instagram', icon: Instagram, href: '#' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function Footer() {
  return (
    <footer
      className="bg-[var(--color-background-light)] relative"
      style={{ padding: 'var(--space-16x) 0 var(--space-8x)' }}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-secondary)]/30 to-transparent" />

      <div className="container" style={{ padding: '0 var(--space-4x)' }}>
        <div className="max-w-7xl mx-auto">
          <div
            className="grid md:grid-cols-3"
            style={{
              gap: 'var(--space-16x)',
              marginBottom: 'var(--space-16x)'
            }}
          >
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              custom={0}
            >
              <div style={{ marginBottom: 'var(--space-6x)' }}>
                <H2HLogo height={48} />
              </div>
              <p
                className="text-[var(--color-text-dark)]/60 text-sm max-w-xs"
                style={{ lineHeight: 'var(--line-height-relaxed)' }}
              >
                Transforming businesses across Africa through award-winning digital innovation.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              custom={1}
            >
              <p
                className="text-xs tracking-[0.2em] text-[var(--color-text-dark)]/40"
                style={{
                  fontFamily: 'var(--font-stack-heading)',
                  marginBottom: 'var(--space-6x)'
                }}
              >
                CONNECT
              </p>
              <div className="space-y-4">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="group flex items-center gap-3 text-[var(--color-text-dark)]/80 hover:text-[var(--color-secondary)] transition-colors duration-300"
                    style={{ lineHeight: 'var(--line-height-normal)' }}
                  >
                    <link.icon className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative">
                      {link.label}
                      <span className="absolute left-0 -bottom-0.5 w-full h-px bg-[var(--color-secondary)] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                    </span>
                  </a>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              custom={2}
            >
              <p
                className="text-xs tracking-[0.2em] text-[var(--color-text-dark)]/40"
                style={{
                  fontFamily: 'var(--font-stack-heading)',
                  marginBottom: 'var(--space-6x)'
                }}
              >
                CONTACT
              </p>
              <a
                href="mailto:hello@h2h.digital"
                className="group block text-[var(--color-text-dark)]/80 hover:text-[var(--color-secondary)] transition-colors duration-300"
                style={{
                  lineHeight: 'var(--line-height-normal)',
                  marginBottom: 'var(--space-2x)'
                }}
              >
                <span className="relative">
                  hello@h2h.digital
                  <span className="absolute left-0 -bottom-0.5 w-full h-px bg-[var(--color-secondary)] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </span>
              </a>
              <p
                className="text-[var(--color-text-dark)]/60 text-sm"
                style={{ lineHeight: 'var(--line-height-normal)' }}
              >
                Lagos, Nigeria
              </p>
            </motion.div>
          </div>

          <div
            className="border-t border-[var(--color-text-dark)]/10 flex flex-wrap justify-between items-center gap-4"
            style={{ paddingTop: 'var(--space-8x)' }}
          >
            <p
              className="text-[var(--color-text-dark)]/40 text-xs tracking-widest"
              style={{ fontFamily: 'var(--font-stack-heading)' }}
            >
              &copy; 2026 H2H DIGITAL HOME
            </p>
            <div className="flex items-center" style={{ gap: 'var(--space-8x)' }}>
              <a
                href="#"
                className="text-[var(--color-text-dark)]/40 text-xs tracking-widest hover:text-[var(--color-text-dark)]/80 transition-colors duration-300"
                style={{ fontFamily: 'var(--font-stack-heading)' }}
              >
                PRIVACY
              </a>
              <a
                href="#"
                className="text-[var(--color-text-dark)]/40 text-xs tracking-widest hover:text-[var(--color-text-dark)]/80 transition-colors duration-300"
                style={{ fontFamily: 'var(--font-stack-heading)' }}
              >
                TERMS
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
