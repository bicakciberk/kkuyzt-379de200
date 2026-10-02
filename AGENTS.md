<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- Events, team members and social posts live in Lovable Cloud tables and are read via `getSiteData` (src/lib/site-data.functions.ts) + `siteDataQuery`; why: the admin panel edits them without code changes.
- Admin panel lives at the unguessable `/yzt-yonetim-k7x2` under `_authenticated` (redirects to `/auth`); public signup is disabled, so any signed-in user is an editor; why: small trusted team, no role system requested.
- Uploaded images go to the private `site-media` bucket, stored as `storage://path` and turned into signed URLs server-side; why: workspace blocks public buckets.
- Form submissions are saved to `applications`/`contact_messages` (anon insert only) alongside the Web3Forms email; panel activity is logged by the `log_panel_activity` DB trigger into read-only `activity_log`; why: trigger logging cannot be skipped or forged from the browser.
- YZT Kart applications live in `yzt_card_applications`, are emailed through the shared Web3Forms flow, and are status-managed only by signed-in panel users; why: submissions must reach both email and the operational inbox.
- Editable page texts and site settings (email, Instagram, address, slogan) live in key/value `site_content`, read via `useSiteText()` (src/lib/site-text.ts) with code defaults as fallback; why: one central source, editable from the panel.
- Daily AI facts live in `daily_facts`, rotate by the Europe/Istanbul calendar day and ordered pool index, and log panel edits via a database trigger; why: every visitor sees the same daily fact and editors can maintain the pool.
- Hakkımızda timeline milestones live in `timeline_milestones`, read through `getSiteData` and logged by a database trigger; why: editors can reorder and maintain the public history without code changes.
- Partners live in `partners` table via getSiteData, logged by DB trigger; why: editable from panel.
- Team leadership groups by role in `toTeam`; why: deputies appear once, next to the president.
- Use Newsreader only for hero, page, and major section headings; all cards and interface copy use Figtree, because the site should read like a restrained editorial publication rather than a template.
