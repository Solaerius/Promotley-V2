/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

const LOGO_URL = 'https://fmvbzhlqzzwzciqgbzgp.supabase.co/storage/v1/object/public/email-assets/logo.png'

export const SignupEmail = ({
  siteName,
  siteUrl,
  recipient,
  confirmationUrl,
}: SignupEmailProps) => (
  <Html lang="sv" dir="ltr">
    <Head />
    <Preview>Bekräfta din e-post – välkommen till Promotely!</Preview>
    <Body style={main}>
      <Container style={card}>
        {/* Gradient header band */}
        <Section style={headerBand}>
          <Img src={LOGO_URL} alt={siteName} width="120" height="auto" style={logoStyle} />
        </Section>

        {/* Content */}
        <Section style={content}>
          <Heading style={h1}>Hej! Kul att du är här 👋</Heading>
          <Text style={text}>
            Vi är glada att ha dig ombord! Du är bara ett steg ifrån att börja växa på sociala medier.
          </Text>
          <Text style={text}>
            Bekräfta din e-postadress (
            <Link href={`mailto:${recipient}`} style={link}>
              {recipient}
            </Link>
            ) så kör vi igång:
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={confirmationUrl}>
              Bekräfta & kom igång 🚀
            </Button>
          </Section>

          <Text style={muted}>
            Knappen fungerar inte? Kopiera den här länken till din webbläsare:
          </Text>
          <Text style={urlText}>{confirmationUrl}</Text>
        </Section>

        {/* Footer */}
        <Hr style={divider} />
        <Section style={footer}>
          <Img src={LOGO_URL} alt={siteName} width="80" height="auto" style={footerLogo} />
          <Text style={footerLinks}>
            <Link href={`${siteUrl}/help`} style={footerLink}>Hjälp</Link>
            {' · '}
            <Link href={`${siteUrl}/privacy`} style={footerLink}>Integritetspolicy</Link>
            {' · '}
            <Link href={`${siteUrl}/terms`} style={footerLink}>Villkor</Link>
          </Text>
          <Text style={footerAddress}>
            © {new Date().getFullYear()} Promotely · Stockholm, Sverige
          </Text>
          <Text style={footerDisclaimer}>
            Om du inte skapade ett konto hos oss kan du lugnt ignorera det här mejlet.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default SignupEmail

// ─── Styles ───────────────────────────────────────

const main = {
  backgroundColor: '#FFF8F5',
  fontFamily: "'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  padding: '40px 16px',
}

const card = {
  backgroundColor: '#ffffff',
  borderRadius: '20px',
  maxWidth: '480px',
  margin: '0 auto',
  boxShadow: '0 8px 40px rgba(53, 20, 29, 0.08), 0 1px 3px rgba(53, 20, 29, 0.04)',
  overflow: 'hidden' as const,
}

const headerBand = {
  background: 'linear-gradient(135deg, #EE593D 0%, #952A5E 100%)',
  padding: '32px 0 28px',
  textAlign: 'center' as const,
}

const logoStyle = {
  margin: '0 auto',
  display: 'block' as const,
}

const content = {
  padding: '36px 32px 28px',
}

const h1 = {
  fontSize: '22px',
  fontWeight: '700' as const,
  color: '#35141D',
  margin: '0 0 16px',
  lineHeight: '1.3',
}

const text = {
  fontSize: '15px',
  color: '#5C3D45',
  lineHeight: '1.7',
  margin: '0 0 18px',
}

const link = { color: '#952A5E', textDecoration: 'underline' }

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '28px 0',
}

const button = {
  background: 'linear-gradient(135deg, #EE593D 0%, #952A5E 100%)',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '600' as const,
  borderRadius: '16px',
  padding: '16px 36px',
  textDecoration: 'none',
  display: 'inline-block' as const,
}

const muted = {
  fontSize: '12px',
  color: '#9B8A8E',
  lineHeight: '1.5',
  margin: '0 0 4px',
}

const urlText = {
  fontSize: '11px',
  color: '#B8A5AA',
  lineHeight: '1.4',
  wordBreak: 'break-all' as const,
  margin: '0 0 8px',
}

const divider = {
  borderTop: '1px solid #F0E6E8',
  margin: '0 32px',
}

const footer = {
  padding: '24px 32px 32px',
  textAlign: 'center' as const,
}

const footerLogo = {
  margin: '0 auto 12px',
  display: 'block' as const,
  opacity: '0.6',
}

const footerLinks = {
  fontSize: '13px',
  color: '#9B8A8E',
  margin: '0 0 8px',
  lineHeight: '1.5',
}

const footerLink = {
  color: '#952A5E',
  textDecoration: 'none',
}

const footerAddress = {
  fontSize: '11px',
  color: '#B8A5AA',
  margin: '0 0 8px',
}

const footerDisclaimer = {
  fontSize: '11px',
  color: '#C8BCC0',
  margin: '0',
  fontStyle: 'italic' as const,
}
