# Panshaker Legacy Website Notes

## Temporary Hide: Management Team Section

As of 2026-03-07, the management team section on `about.html` is intentionally hidden.

### Current implementation
- File: `about.html`
- Section id: `about-management-team`
- Hidden via inline style: `display: none;`

## How to re-enable in the future

1. Open `about.html`.
2. Find the section with `id="about-management-team"`.
3. Remove `display: none;` from the inline `style` attribute.
4. Save and verify the section is visible on `/about.html`.

## Optional: Restore more team cards

Only the founder card is active right now.
The co-founder and CTO cards are preserved in HTML comments.

To re-enable them:
1. In `about.html`, locate the commented `<div class="team-card">` blocks below the founder card.
2. Uncomment the card blocks you want to show.
3. Make sure linked profile pages still exist (`profile_sun.html`, `profile_unknown.html`).

## Note about homepage image usage

The homepage `Business Delivery` block currently uses the same visual asset as the old management section background:
- `assets/images/managementteam.webp`
- `assets/images/managementteam.jpg`
