import React from 'react'
import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  kind?: 'membership' | 'contact'
  fields?: { label: string; value: string }[]
}

const Email = ({ kind = 'contact', fields = [] }: Props) => {
  const title = kind === 'membership' ? 'Yeni üyelik başvurusu' : 'Yeni iletişim mesajı'
  return (
    <Html lang="tr" dir="ltr">
      <Head />
      <Preview>{title} · YZT web sitesi</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={eyebrow}>YZT · kkuyzt.com</Text>
          <Heading style={h1}>{title}</Heading>
          <Hr style={hr} />
          {fields.map((f) => (
            <Section key={f.label} style={{ marginBottom: '14px' }}>
              <Text style={label}>{f.label}</Text>
              <Text style={value}>{f.value || '—'}</Text>
            </Section>
          ))}
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: Email,
  subject: (d: Record<string, any>) =>
    d['kind'] === 'membership' ? `Yeni üyelik başvurusu: ${d['name'] ?? ''}` : `İletişim: ${d['subject'] ?? 'Yeni mesaj'}`,
  displayName: 'Form bildirimi',
  to: 'Kkuyapayzekatoplulugu71@gmail.com',
  previewData: {
    kind: 'membership',
    name: 'Ayşe Yılmaz',
    fields: [
      { label: 'Ad Soyad', value: 'Ayşe Yılmaz' },
      { label: 'E-posta', value: 'ayse@ornek.com' },
      { label: 'Neden katılmak istiyorsun?', value: 'Yapay zekâ projelerinde yer almak istiyorum.' },
    ],
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '28px 25px', borderTop: '4px solid #2C5F7C' }
const eyebrow = { fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase' as const, color: '#2C5F7C', margin: 0 }
const h1 = { fontFamily: 'Georgia, serif', fontSize: '26px', color: '#1c2a33', margin: '10px 0' }
const hr = { borderColor: '#d8dde0', margin: '18px 0' }
const label = { fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' as const, color: '#2C5F7C', margin: 0 }
const value = { fontSize: '15px', lineHeight: '22px', color: '#1c2a33', margin: '4px 0 0', whiteSpace: 'pre-wrap' as const }
