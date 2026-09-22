# YZT Website Plan

## Goal
Build a polished Turkish website for Kırıkkale Üniversitesi Yapay Zeka Topluluğu at kkuyzt.com, with a warm editorial identity, accessible navigation, realistic community copy, and image slots ready for real Instagram photography.

## Pages
- **Ana Sayfa:** mission-led opening, join and Instagram actions, event photo carousel, recent event preview, section links, live countdown, Instagram placeholder grid, shared footer.
- **Hakkımızda:** story, mission, activities, and values using varied editorial layouts.
- **Takımımız:** board and department-based member groups with portrait placeholders and role/department details.
- **Etkinlikler:** upcoming and past event catalogue with categories, dates, photo placeholders, and accessible detail dialogs.
- **İş Ortakları:** logo-ready partner cards, member benefit details, and clear placeholder partner names.
- **Üyelik:** validated membership form with inline errors and a finished success state; no data submission backend.
- **İletişim:** contact form, Instagram/email links, and campus meeting information.
- **404:** compact branded missing-page experience with a return action.

## Shared Experience
- Sticky header that changes from transparent to solid after scrolling.
- Keyboard-accessible mobile menu and visible focus states.
- Shared navigation and footer on every page, with correct active states.
- Minimal JavaScript only for navigation, carousel, countdown, dialogs, reveal motion, and form validation.
- Every photo/logo/feed location uses a neutral, fixed-aspect placeholder with descriptive Turkish alternative text; no generated imagery.
- Responsive layouts tested on mobile and desktop, with reduced-motion support.

## Visual Direction
- Warm off-white and near-black foundation with amber as the only accent.
- Distinctive editorial display type paired with a highly readable sans-serif body face.
- Flat color, fine rules, strong typography, asymmetry, restrained card use, and natural-photo-ready crops.
- No gradients, neon, glass effects, AI motifs, decorative blobs, stock photography, or generated art.

## Technical Notes
- This workspace’s runtime is fixed to TanStack Start, so the site will be implemented as separate file-based routes rather than standalone `.html` files. The user-facing result remains a fast, static-style multi-page website with minimal client behavior and no backend.
- Styling will use Tailwind utility classes backed by one semantic token system in the global stylesheet.
- Each page receives unique Turkish title, description, Open Graph metadata, and canonical content hierarchy.
- Shared pieces will be small reusable site components to keep every route visually consistent.

## Verification
- Check current build/runtime logs before changes.
- Verify navigation, mobile menu, carousel, countdown, event dialogs, and both forms in the browser.
- Check 1280px desktop and representative mobile layouts for overflow, overlap, image ratios, and text fit.
- Confirm the final build signal is clean and all routes render.
