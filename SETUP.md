# Desert Digital Marketing Site — Setup & Deployment

## Project Overview
A high-fidelity React marketing website for Desert Digital, a Phoenix-based web development studio. Built with Vite, responsive design, Netlify Forms integration, and lightning strike animation.

## What's Included

### ✅ Completed
- **Responsive single-page site** with all 8 sections:
  - Sticky nav with logo and CTA button
  - Hero section with lightning strike animation + stats
  - Services (4-up grid)
  - Case study / Projects (Sadie's Pet Care)
  - Pricing (3 tiers with highlight)
  - Process (4-step workflow)
  - Contact form with validation
  - Footer with contact info

- **Design fidelity**: All colors, typography, spacing, and animations match the design spec
  - Near-black background (#0D0D0F)
  - Acid-green accents (#C9F04B)
  - JetBrains Mono + Inter typography
  - Clamp-based responsive scaling
  - Hairline borders and effects

- **Form handling**: Netlify Forms ready
  - Client-side validation (name, email)
  - Success confirmation card
  - Hidden form in HTML for Netlify detection

- **Production ready**: Optimized build, deployed via Netlify

## Local Development

```bash
npm install       # Install dependencies (already done)
npm run dev       # Start dev server (http://localhost:5173)
npm run build     # Build for production
```

## Deployment to Netlify

1. **Initialize git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Desert Digital marketing site"
   ```

2. **Push to GitHub**:
   - Create a new repo on GitHub
   - Add it as remote: `git remote add origin <repo-url>`
   - Push: `git push -u origin main`

3. **Connect to Netlify**:
   - Go to https://app.netlify.com
   - Click "New site from Git"
   - Select your GitHub repo
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Deploy!

4. **Netlify Forms**:
   - Form submissions will auto-appear in Netlify dashboard
   - No backend code needed for basic form handling
   - To add email notifications: go to Netlify site settings → Forms → add notification

## What to Update Before Launch

**Content (placeholders to replace)**:
- [ ] Sadie's Pet Care screenshot (currently placeholder) → replace with real screenshot
- [ ] Contact info: `hello@desertdigital.dev` → your email
- [ ] Phone: `(602) 555-0142` → your phone
- [ ] Pricing: `$2,500+`, `$6,000+`, `$150/mo+` → actual pricing
- [ ] Social links: Instagram, LinkedIn URLs

**Images**:
- ✅ `neon-night.jpg` (hero background) — included
- ✅ `prism.jpg` (contact form decoration) — included
- ⚠️ Verify image licenses for production (both from Unsplash)

**Domain**:
- [ ] Custom domain setup in Netlify
- [ ] SSL certificate (auto-enabled)

## Form Submission Flow

When a visitor submits the contact form:
1. Client-side validation (name, email)
2. If valid, POST to Netlify Forms endpoint
3. Success → confirmation card shows "Received, {firstName}"
4. Submission appears in Netlify dashboard
5. (Optional) Email notification to you

## Customization Notes

### Future Modifications
- All styling uses inline styles (easy to adjust)
- Design tokens in color values (#0D0D0F, #C9F04B, etc.) throughout
- Typography scales via `clamp()` for responsive behavior
- Grids use `repeat(auto-fit, minmax(...))` to collapse on mobile

### Adding Backend Email
If you want emails sent automatically, create a Netlify serverless function:
```javascript
// netlify/functions/contact.js
exports.handler = async (event) => {
  const { name, email, message } = JSON.parse(event.body);
  // Send email via service (SendGrid, Postmark, etc.)
  return { statusCode: 200 };
};
```

## Questions?
Refer to the design reference: `/design_handoff_desert_digital_site/README.md`

---

Built with React + Vite. Ready to customize and deploy. 🚀
