# Wipinote™ — Premium Animated Website

Production-ready static site with **GSAP + ScrollTrigger + Lenis** animation stack.
No frameworks, no build step. Drop into GitHub Pages, Netlify, or Vercel and go live.

## Premium animation stack (loaded from CDN — no build)

| Library | Used for |
|---|---|
| **GSAP 3.12** | Hero entrance choreography, section reveals, parallax scroll-trigger |
| **ScrollTrigger** | Scroll-locked animations, parallax blobs, scrub-based motion |
| **Lenis 1.0** | Buttery smooth scrolling (Webflow/Apple-grade feel) |

All three load from CDN with `defer` — site works without them (graceful fallback to CSS animations).

## What's animated

- ✨ **Hero entrance** — staggered fade/slide on copy, CTAs, trust list, floating cards
- 🌀 **Mouse-parallax** on hero floating cards (depth follows cursor)
- 📜 **Scroll parallax** on hero blobs and floating cards
- 🎯 **Magnetic buttons** — every `.btn` and `.icon-btn` follows the cursor
- 📊 **Counters** — stats count up when in view
- 🎠 **Premium testimonial slider** — auto-play, dots, swipe-touch, prev/next
- 🌊 **Marquee** — seamless infinite trust bar
- 🪟 **Glass header** — backdrop-blur, scroll shadow on scroll
- 💫 **Animated logo mark** — gradient shift loop
- 🎁 **Email modal** — auto-fires after 18s, dismissed once
- 🍪 **Cookie banner** — slides in with spring easing
- 🛒 **Cart bounce** — badge scales on add-to-cart
- 🎨 **Mesh blob backgrounds** — floating gradient blobs (CSS keyframes)
- ⚡ **Reveal-on-scroll** — every card, stat, badge fades up as you scroll

## Premium design system

| Token | Value | Use |
|---|---|---|
| `--primary` | `#4C8BF5` | Sky Blue |
| `--secondary` | `#FFB84C` | Warm Mango |
| `--accent` | `#FF6F61` | Coral |
| `--grad-cta` | Blue → Purple → Coral | Primary CTA gradient |
| `--grad-text` | Blue → Coral | Heading gradient text |
| `--shadow-glow-blue` | Blue ambient glow | Primary buttons |
| `--shadow-xl` | Premium card depth | Hero floating cards |

Type: **Poppins** (display, 400–700) + **Inter** (body, 400–700).

## Structure

```
wipinote-site/
├── index.html           ✅ Batch 1 (this batch)
├── about.html           → Batch 2
├── books.html           → Batch 2
├── printables.html      → Batch 2
├── teachers.html        → Batch 3
├── parents.html         → Batch 3
├── blog.html            → Batch 3
├── contact.html         → Batch 3
├── privacy.html         → Batch 4
├── terms.html           → Batch 4
├── refunds.html         → Batch 4
├── shipping.html        → Batch 4
├── cookies.html         → Batch 4
└── assets/
    ├── css/style.css    ✅ Complete (covers all 13 pages, all components)
    ├── js/main.js       ✅ Complete (covers all 13 pages, all interactions)
    └── img/             (drop real images here)
```

## Deploy

**GitHub Pages**
1. Push folder contents to repo root.
2. Settings → Pages → Source = `main` / root.
3. Live at `https://<username>.github.io/<repo>/`.

**Netlify**
1. Drag folder onto [app.netlify.com/drop](https://app.netlify.com/drop).
2. Live in seconds. Add custom domain in settings.

## Hooks for real backends

| Feature | File | Hook |
|---|---|---|
| Newsletter | `assets/js/main.js` | `.js-newsletter` submit — POST to Mailchimp/ConvertKit/Buttondown |
| Contact | `assets/js/main.js` | `#contactForm` submit — POST to Formspree/Netlify Forms |
| Cart / checkout | `assets/js/main.js` | `[data-add-to-cart]` / `[data-buy-now]` — Stripe Checkout / Shopify Buy Button / Snipcart |

---

**Build status:** Batch 1 of 4 complete. Type "Next" to continue.
