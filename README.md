# YZT Community Hub (35)

Build a full, production-quality website for a university student community called "YZT" (Yapay Zeka Topluluğu / Artificial Intelligence Community) at Kırıkkale University, in Turkish language, for the domain kkuyzt.com.

STACK — HARD REQUIREMENT

- Plain HTML + CSS, styled with Tailwind CSS utility classes only.

- Do NOT use React, Next.js, Vue, or any JS framework/component library.

- Vanilla JavaScript only, and only where truly needed (mobile nav toggle, slider/carousel, accordion, form validation, smooth scroll, countdown timer). Keep JS minimal and readable.

- Fully static, multi-page site (separate .html pages linked via a shared navbar/footer), not a single-page app.

- Fully responsive (mobile-first), fast-loading, no unnecessary heavy libraries.

IMAGES — HARD REQUIREMENT

- Do NOT generate any AI images or illustrations anywhere on the site (no hero art, no icons made of AI-generated imagery, no decorative AI photos).

- For every place a photo is needed (hero, event cards, team member photos, partner logos, Instagram feed section), insert a clean, correctly-sized placeholder (a neutral gray/tinted block or a simple <img> tag with a descriptive alt text and a clear placeholder src comment like <!-- REPLACE WITH REAL PHOTO -->), sized and cropped exactly as the real image will be, with proper aspect-ratio classes so no layout will break once real photos are dropped in.

- Real photos will be sourced manually afterward from the community's own Instagram account (instagram.com/kku_yzt) — design every image slot with that in mind (natural event/candid photography, not polished stock photography, not AI art).

- Icons (nav, UI elements) can use a simple icon set (e.g. Heroicons/Lucide via inline SVG) — that's fine, this restriction is about photographic/illustrative imagery only.

DESIGN DIRECTION — THIS IS THE MOST IMPORTANT PART

The site must look like it was designed by a real design studio for a serious student organization — NOT like a generic "AI-generated" template. Actively avoid every cliché associated with "AI" branding:

- No purple-to-blue gradients, no glowing neon edges, no glassmorphism-everywhere, no generic neural-network/circuit-board backgrounds, no floating robot/chip icons, no "futuristic" sci-fi fonts, no stock "AI brain" imagery.

- Instead: a confident, editorial, slightly minimal design system — think of a well-run student organization or a boutique tech studio, not a sci-fi movie poster. It should feel credible, warm, and human — built by students, for students — while still looking premium and modern.

COLOR THEME

- Primary accent: warm amber/gold (e.g. #F5A623 / #E8A33D range) — used consistently and sparingly for CTAs, links, active states, and key highlights. Do not use it as a background wash everywhere.

- Base palette: near-black (e.g. #16161A) for dark sections/text, and a warm off-white (e.g. #FAF8F5) for light sections — avoid pure black/pure white for a warmer, less clinical feel.

- No gradients as a primary design device; flat color with occasional very subtle, low-contrast tonal shifts is preferred.

- One accent color total — no rainbow palettes, no secondary neon colors competing with the amber.

TYPOGRAPHY & LAYOUT

- One distinctive display/heading font + one clean readable body font (Google Fonts). Strong hierarchy, generous line-height and spacing — no cramped sections.

- Subtle, tasteful motion only: fade/slide-in on scroll, gentle hover states, smooth transitions. Nothing gimmicky or overloaded.

- Real layout variety per section (don't repeat the same "icon + heading + paragraph in a card" pattern for every block) — mix full-width statements, asymmetric grids, image-led sections (with placeholders as described above), and simple stat rows.

SITE STRUCTURE (multi-page, shared navbar + footer)

1. Homepage (index.html)

   - Hero section: club name, short one-line mission statement, primary CTA ("Bize Katıl" / join) and secondary CTA ("Instagram'da Takip Et").

   - Image/photo slider placeholder for recent event highlights (correctly sized, ready for real Instagram photos).

   - "Past Events" preview strip (cards with date, title, short description, "Detay" link) — pull 4-5 sample entries with photo placeholders.

   - Three/four feature blocks linking to: About Us, Our Team, Events, Partners/Perks.

   - Countdown block for an upcoming flagship event (days/hours/min/sec).

   - Instagram feed teaser section (grid of placeholder squares) with a follow CTA linking to instagram.com/kku_yzt.

   - Footer with quick links, social icons, contact info, copyright.

2. Hakkımızda (about.html) — mission, story, what the community does (seminars, guest speakers, technical trips, workshops), values.

3. Takımımız (team.html) — board/team members grid: photo placeholder, name, role, department. Group by department (e.g. Dış İlişkiler, Teknik Ekip, Etkinlikler, Sosyal Medya) using clear section headers.

4. Etkinlikler (events.html) — full list/grid of past and upcoming events, each with a photo placeholder, date, tag/category, short description, and a detail link or modal.

5. İş Ortakları / Anlaşmalı Yerler (partners.html) — partner businesses/sponsors offering discounts to members, shown as a clean logo-placeholder/card grid.

6. Üyelik / Katıl (join.html) — simple membership application form (name, department, email, phone, why do you want to join — text area) with client-side validation and a styled success state. No backend required, just wire the form up cleanly.

7. İletişim (contact.html) — contact form + social links + location/meeting info.

CONTENT TONE

- All visible text in natural, contemporary Turkish — no stiff corporate phrasing, no awkward AI-sounding sentences. Short, confident, human copy.

- Use realistic placeholder content (sample event names, team roles, partner names) so the structure is obviously ready to be filled in — but everything should read like a real Turkish student community wrote it.

FUNCTIONALITY DETAILS

- Sticky/transparent-to-solid navbar on scroll, mobile hamburger menu with slide-in panel.

- Reusable, consistent components (buttons, cards, section headers) via repeated Tailwind class patterns.

- Accessible: proper heading hierarchy, alt text on all image placeholders, sufficient color contrast, keyboard-navigable menu.

- Clean 404 page consistent with the design system.

Deliver a cohesive design system across all pages (consistent spacing scale, color tokens, component styles) rather than pages that feel independently designed.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://kkuyzt.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/34d1e389-01b7-47de-9ddf-e045fd2560f1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
