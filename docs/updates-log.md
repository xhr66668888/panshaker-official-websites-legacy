# Updates Log

## 2026-03-XX
- Fixed Synapse OS asset references and standardized screenshot filenames (English slugs).
- Added transparent favicon `assets/images/logo-transparent.png`.
- Introduced shared stylesheet `assets/styles/shared.css` and applied across pages.
- Expanded i18n coverage (nav/footer, home/about/careers/investors/profile pages) and refreshed translations (zh-CN, zh-TW, en, ja, ko).
- Updated branding from Panshaker LLC to Panshaker Inc in UI and docs.
- Refreshed DEVELOPMENT_GUIDE checklist and version notes.
- Fixed homepage Synapse OS image: replaced `<picture>` wrapper with plain `<img src="assets/images/restaurant.webp">` matching `product.jpg` pattern — `<picture>` with inline style caused zero-height rendering.
- Added official slogans to brand spec: 中文「烟火无界，至味如初。」 / EN "Timeless Flavor, Everywhere."
- Fixed duplicate © symbol in footer copyright across all 5 language packs.
- Adjusted hero title font sizes to `clamp()` for better English layout.
- Moved language switcher from fixed bottom-right globe icon into header nav bar as an inline dropdown.
