# M/S. AZMIR ENTERPRIZE — Website Project Specification

**Project status:** A fresh Next.js app has been initialized. No website pages, reusable components, layout, or product data have been implemented yet.

**Goal:** Build a modern, trustworthy, responsive corporate website and construction-material catalogue for M/S. AZMIR ENTERPRIZE. Phase one is frontend-only, uses local typed data, and must be structured so a future API can replace the local data layer without rewriting the UI.

**Primary design reference:** https://greentouch.group/companies/corporation/

Use the reference for layout inspiration, navigation patterns, catalogue grouping, and content hierarchy. Do not copy its logo, text, images, project claims, certificates, testimonials, or branding.

---

## 1. Business and website goals

The website should help contractors, developers, engineers, procurement teams, retailers, and other buyers:
- Understand who M/S. AZMIR ENTERPRIZE is.
- Explore construction-material categories and their variants.
- Review product information and available images.
- Contact the company for enquiries and quotations.

Use the exact company display name **M/S. AZMIR ENTERPRIZE**. Confirm the spelling with the client before launch.

Do not invent the company's history, years in business, office address, contact details, delivery coverage, clients, projects, certifications, product specifications, prices, stock, or quality guarantees.

## 2. Product catalogue (client-confirmed)

The client confirmed the following catalogue. Data lives in `data/categories.ts`; names must still come from data, never hardcoded in UI components.

| Category | Products |
|---|---|
| Stone Chips & Aggregate | Pakur, Meghalaya, Dubai, Maddhapara, Bhutan Torsa stone chips; Boulder Stone; Singles Stone |
| Sand | Fine Aggregate (Sylhet, Durgapur, Panchagarh sand); Filling Sand |
| Bricks | Auto Bricks, Deshi Bricks, Block Bricks |
| Coal | Bangla, Indonesian, Indian Super, High Super |
| Iron Rod | BSRM, CSRM, KSRM, AKS, GPH, Bangla, Bikrampur |

**Transportation** is a service, not a product category. It has its own page at `/[lang]/transportation`, linked from the header, footer and the home "Who we are" section.

Product specifications, sizes, grades, prices and stock still need client confirmation before they are published. Brand names (BSRM, KSRM, etc.) appear as text only — no manufacturer logos.

### Temporary stand-in images
Until real product photos arrive, these reuse existing images (listed at the top of `data/categories.ts`):
- Deshi Bricks → `hero/brick-moulding.webp`; Block Bricks → `hero/brick-kiln.webp`
- Coal (category and all products) → `hero/brick-kiln.webp`
- Iron Rod (category and all products) → `hero/tipper-truck.webp`

### Adding a category (e.g. bitumen)
Adding a category is a data-only change:
1. Add an entry to `data/categories.ts` with a unique `id`/`slug`, localized `name`, `shortName`, `description`, `image`, `sortOrder` and its `variants`.
2. Choose a catalogue `layout`: `mosaic`, `panels`, `spotlight` or `showcase` (default).
3. Choose an `icon` key from `lib/products/category-icons.ts` (add a new key there if none fits).
4. Optionally map a hero photo in `data/photos.ts` → `getCategoryHeroPhoto`.

Navigation, the products catalogue, category pages, the home page, the transportation page and the sitemap all pick it up automatically.

## 3. Design direction

### Visual style
- Modern, elegant, confident, and professional.
- Construction-material supplier identity, not an ecommerce storefront.
- Strong typography, generous whitespace, clear content hierarchy, and large authentic photography.
- Subtle interactions; avoid excessive animation.
- Original AZMIR design inspired by the reference's clean corporate presentation.

### Colour tokens
Use the existing project palette as a centralized theme:

| Token | Value | Purpose |
|---|---|---|
| Primary | `#252A2D` | Main text, navigation, dark surfaces |
| Primary soft | `#3E4549` | Secondary dark surfaces |
| Accent | `#E87932` | Main CTA and active states |
| Accent soft | `#F2B17A` | Soft accent |
| Background | `#F7F5F0` | Page background |
| Surface | `#FFFFFF` | Cards and panels |
| Surface muted | `#EEEAE3` | Alternate sections |
| Text muted | `#667078` | Supporting copy |
| Border | `#DEDAD2` | Dividers and borders |
| Focus | `#1D70A2` | Keyboard focus |

Define semantic CSS variables in one place. If the initialized project already has a coherent theme, consolidate rather than layering conflicting styles.

### Typography
- English: Inter.
- Bengali: Noto Sans Bengali.
- Prefer `next/font` and configure font variables in the root layout.
- Ensure Bengali text renders clearly on Android and desktop.
- Use comfortable line-height and readable body sizes.

### Photography
Use client-approved photos of products, materials, loading, transport, worksite, office, and team only where those activities/facilities genuinely belong to AZMIR. Do not use Green Touch images. Temporary stock imagery must be replaceable and must not be presented as AZMIR's actual assets.

## 4. Navbar and dropdown — first priority

Build the shared layout before building individual pages.

### Desktop header
Suggested structure:
- Left: company logo/wordmark.
- Main navigation: Home, About Us, Products, Projects/Capabilities (only if confirmed), Gallery (only if real images exist), Contact.
- Right: clear Contact / Request a Quote CTA.
- Optional phone/email utility row only when client details are confirmed.

### Products dropdown
Create a wide, well-organized dropdown or mega-menu with three category groups:
- Stone — variants listed beneath it.
- Sand — variants listed beneath it.
- Bricks — variants listed beneath it.

The dropdown must be generated from the same product repository used by catalogue pages. Never maintain a second hardcoded list for navigation. Hide unpublished categories and variants.

### Interaction requirements
- Desktop dropdown opens on click. Hover can be an enhancement, never the only interaction.
- Close on outside click, Escape, and navigation selection.
- Keyboard accessible with visible focus.
- Use correct button semantics and `aria-expanded` / `aria-controls`.
- Ensure the dropdown is not clipped and has an appropriate stacking context.
- Use subtle transitions and avoid layout shifts.

### Mobile navigation
- Accessible menu button with `aria-expanded`.
- Drawer or full-width panel.
- Products expands as an accordion with category and variant links.
- Touch-friendly spacing.
- Close after navigation and on Escape.
- Prevent background scroll while an overlay drawer is open, if appropriate.
- Do not depend on hover.

### Responsive header
Test at 360px, 390px, 768px, 1024px, 1280px, and wide desktop. No horizontal overflow, logo/nav collision, or inaccessible controls.

## 5. Shared reusable layout components

Create these before page-specific sections:

| Component | Responsibility |
|---|---|
| `SiteHeader` | Shared responsive header |
| `DesktopNavigation` | Desktop links |
| `ProductsDropdown` | Data-driven category/variant menu |
| `MobileNavigation` | Mobile drawer and product accordion |
| `SiteFooter` | Company info, useful links, contact, copyright |
| `PageContainer` | Consistent max-width and horizontal padding |
| `SectionHeading` | Reusable eyebrow, heading, description |
| `PrimaryButton` | Main CTA |
| `SecondaryButton` | Secondary CTA |
| `Breadcrumbs` | Page hierarchy |
| `WhatsAppButton` | Optional, only after number is confirmed |
| `BackToTop` | Optional utility |

Use one root layout to provide fonts, global styles, header, footer, and metadata defaults on every page.

## 6. Sitemap

Use Next.js App Router.

Required phase-one routes:
- `/` — Home
- `/about` — About
- `/products` — Product categories
- `/products/stone` — Stone category
- `/products/sand` — Sand category
- `/products/bricks` — Bricks category
- `/products/[slug]` — Product variant detail
- `/contact` — Contact

Optional only if client supplies approved content:
- `/projects`
- `/gallery`
- `/privacy-policy`

Do not publish empty or fabricated projects/gallery pages.

### Language support
Bengali-first, English-ready. Recommended route convention: `/bn/...` and `/en/...`, or a deliberate default-locale approach. Choose one strategy and apply it consistently. Keep translations in dictionaries/data, set the correct document `lang`, and provide localized metadata. If complete translations are not ready, launch one complete language rather than a partially translated interface.

## 7. Page requirements

### Home
Suggested order:
1. Shared header.
2. Hero: verified business headline, concise supporting copy, Explore Products CTA, Contact/Request Quote CTA, relevant image.
3. Company introduction.
4. Three category cards (only confirmed/published categories).
5. Why work with us (verifiable strengths only).
6. Supply process/capabilities (only confirmed).
7. Featured products.
8. Project/gallery section (only if real approved assets exist).
9. Enquiry CTA.
10. Shared footer.

### About
Company introduction, business focus, mission/values if supplied, sourcing/supply process if confirmed, real company photos, contact CTA. Do not invent company history or leadership details.

### Products overview
Show published categories, relevant image, concise description, and category link. No cart or checkout.

### Category page
Breadcrumbs, category title, introduction, category image if available, variant cards from data, and enquiry CTA.

### Product detail
Product name, image/gallery, descriptions, confirmed attributes, related products, and enquiry CTA. Show only confirmed size, grade, origin, colour, application, packaging, etc. No price or stock unless client maintains accurate values.

### Contact
Confirmed phone, WhatsApp, email, address, hours, and enquiry method. If there is no backend, use an honest WhatsApp/email handoff. Never display a fake “message sent” success state.

## 8. Suggested project structure

Adapt to the existing generated project. Do not create duplicate `app/` and `src/app/` trees.

```text
src/
  app/
    layout.tsx
    page.tsx
    globals.css
    about/page.tsx
    products/page.tsx
    products/[category]/page.tsx
    products/[slug]/page.tsx
    contact/page.tsx
  components/
    layout/
      site-header.tsx
      desktop-navigation.tsx
      products-dropdown.tsx
      mobile-navigation.tsx
      site-footer.tsx
      page-container.tsx
      breadcrumbs.tsx
    home/
      hero-section.tsx
      company-intro.tsx
      product-category-section.tsx
      why-choose-us.tsx
      supply-process.tsx
      featured-products.tsx
      enquiry-cta.tsx
    products/
      product-category-card.tsx
      product-card.tsx
      product-grid.tsx
      product-gallery.tsx
      product-attributes.tsx
      related-products.tsx
    ui/
      button.tsx
      section-heading.tsx
  config/
    site.ts
  data/
    categories.ts
    products.ts
    company.ts
  dictionaries/
    bn.json
    en.json
  lib/
    products/product-repository.ts
    products/product-utils.ts
    i18n/get-dictionary.ts
    seo/metadata.ts
    utils.ts
  types/
    product.ts
    company.ts
public/
  images/
    brand/
    products/
    company/
    projects/
```

Keep page files small and compose them from reusable sections. Server Components by default; use `"use client"` only for interactive navigation, filters, gallery modal, etc. Use semantic HTML and TypeScript strict mode.

## 9. Product data contract

Use typed, data-driven categories and variants. Example:

```ts
export type ProductAttribute = {
  label: string;
  value: string;
};

export type ProductVariant = {
  id: string;
  slug: string;
  name: { bn: string; en: string };
  shortDescription?: { bn: string; en: string };
  description?: { bn: string; en: string };
  image?: string;
  gallery?: string[];
  attributes?: ProductAttribute[];
  isPublished: boolean;
  featured?: boolean;
  sortOrder: number;
};

export type ProductCategory = {
  id: string;
  slug: string;
  name: { bn: string; en: string };
  description?: { bn: string; en: string };
  image?: string;
  isPublished: boolean;
  sortOrder: number;
  variants: ProductVariant[];
};
```

All example variants must initially use `isPublished: false`. A category should appear only when it is published and has at least one published variant. Product attributes are optional and must not be fabricated.

### Repository abstraction
Pages/components must not import raw arrays directly. Use repository methods such as:

```ts
export interface ProductRepository {
  getPublishedCategories(locale: "bn" | "en"): Promise<ProductCategory[]>;
  getCategoryBySlug(slug: string, locale: "bn" | "en"): Promise<ProductCategory | null>;
  getProductBySlug(slug: string, locale: "bn" | "en"): Promise<ProductVariant | null>;
  getFeaturedProducts(locale: "bn" | "en"): Promise<ProductVariant[]>;
}
```

Implement with local TypeScript/JSON data for phase one. Later, replace the repository implementation with API/database calls without rewriting UI components. Navbar and catalogue must call the same data layer.

## 10. Central site configuration

Keep the company name, description, locale, and contact values in one config file. Example:

```ts
export const siteConfig = {
  name: "M/S. AZMIR ENTERPRIZE",
  shortName: "AZMIR ENTERPRIZE",
  description: "Construction material supplier in Bangladesh.",
  defaultLocale: "bn",
  supportedLocales: ["bn", "en"],
  contact: {
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
  },
  social: {
    facebook: "",
    linkedin: "",
  },
};
```

Empty contact fields are intentional placeholders. Never invent phone numbers, addresses, or social profiles.

## 11. Technical stack and implementation constraints

- Use the installed Next.js App Router version if compatible; check the current stable release at implementation time.
- Inspect `package.json` and lockfile before adding/upgrading dependencies.
- TypeScript strict mode.
- Use the existing Tailwind setup if present; do not unnecessarily replace it.
- Lucide React for icons.
- Inter + Noto Sans Bengali.
- `next/image` for images.
- Zod/React Hook Form only if a form is actually required.
- No backend, database, CMS, authentication, cart, checkout, payment, or order tracking in phase one.
- Avoid experimental/canary dependencies unless explicitly approved.

## 12. SEO

- Page-specific metadata using Next.js Metadata API.
- Unique title and description for each route.
- Descriptive URLs and product slugs.
- Sitemap and robots.
- Open Graph metadata and social preview image.
- Accurate image alt text.
- Organization/LocalBusiness structured data only with verified details.
- Natural Bengali and English keywords relevant to the actual products and service area.
- No keyword stuffing or duplicated generic product copy.
- Add canonical and hreflang only when the production domain and language pages are ready.

## 13. Accessibility, responsive quality, and performance

- Semantic `header`, `nav`, `main`, `section`, and `footer`.
- One clear `h1` per page and logical heading order.
- Keyboard-accessible dropdown and mobile menu.
- Visible focus styles and accessible names for icon-only buttons.
- Sufficient contrast and comfortable touch targets.
- Respect reduced-motion settings.
- Correct image dimensions/aspect ratios to avoid layout shift.
- Test Bengali text wrapping and font rendering.
- No horizontal overflow.
- Prefer Server Components and optimized images.
- Lazy-load below-the-fold imagery where appropriate.
- Avoid autoplay video, unnecessary animation libraries, and excessive third-party scripts.
- Run Lighthouse before launch.

## 14. Phase-one scope

**Included:** shared layout, responsive navbar/dropdown, mobile menu, footer, Home, About, Products overview, category pages, product detail pages, Contact, local typed data, bilingual-ready structure, SEO basics, responsive/accessibility QA, and real contact handoff if details are supplied.

**Excluded:** backend/database, admin/CMS, user accounts, ecommerce, payment, inventory management, order tracking, quotation automation, and fabricated business evidence.

## 15. Claude Code implementation milestones

### Milestone 0 — Inspect the initialized project
1. Inspect repository, `package.json`, lockfile, app directory, styling, and current files.
2. Run the starter app and verify it works.
3. Identify existing conventions and dependencies.
4. Propose exact files to create/modify.
5. Do not overwrite working configuration unnecessarily.

**Acceptance:** Current app runs and an implementation plan is presented before large changes.

### Milestone 1 — Foundation
1. Configure Inter and Noto Sans Bengali.
2. Add global theme tokens.
3. Configure root metadata.
4. Create PageContainer, buttons, and SectionHeading.
5. Verify Bengali and English rendering.

### Milestone 2 — Shared layout and navigation
1. Build SiteHeader and SiteFooter.
2. Build desktop navigation and ProductsDropdown.
3. Build mobile navigation and product accordion.
4. Connect menu to the product data source.
5. Test keyboard, click, touch, Escape, outside click, and responsive behavior.

**Acceptance:** Header/footer appear on every route; dropdown is accessible; adding a product in data updates the menu automatically.

### Milestone 3 — Catalogue data and reusable product components
1. Add product types and unpublished draft data.
2. Add repository functions.
3. Build category cards, product cards, product grid, category page, and detail page.
4. Ensure unpublished items never appear publicly.
5. Ensure navbar and catalogue use the same repository.

### Milestone 4 — Pages
Build Home, About, Products, category, product detail, and Contact pages from reusable sections. Use placeholders only for missing client content and do not present placeholders as facts.

### Milestone 5 — SEO and QA
Add metadata, sitemap, robots, alt text, accessibility checks, route/link checks, responsive tests, lint, type-check, and production build. Fix all errors before completion.

## 16. Client information required before launch

### Company
- Confirm exact legal/display spelling.
- Logo (SVG/PNG).
- Approved company introduction and history.
- Phone, WhatsApp, email, address, business hours.
- Social links.

### Products
- Confirm which categories AZMIR actually supplies: Stone, Sand, Bricks.
- Confirm exact variant names.
- Confirm origin/source if it will be displayed.
- Confirm sizes, grades, specifications, applications, and packaging.
- Supply approved product photos.
- Confirm which items must remain private/unlisted.
- Confirm whether prices should be displayed (default: no).

### Operations and credibility
- Delivery areas.
- Minimum order quantity, if applicable.
- Transport/loading capability, if applicable.
- Supply process.
- Real project references and publication permission.
- Certificates/documents and permission to display.

## 17. Initial prompt for Claude Code

Copy this prompt after placing this README in the project root:

```text
Read the complete README.md before making any changes. It is the specification for the M/S. AZMIR ENTERPRIZE corporate website.

I have only initialized a Next.js app. No website features have been implemented.

Start with Milestone 0 only:
1. Inspect the current repository, package.json, lockfile, installed Next.js version, app structure, and styling setup.
2. Run the starter app and verify it works.
3. Tell me what is already configured.
4. Propose the exact files you will create or modify.
5. Identify dependency changes and explain why.
6. Do not implement pages or overwrite working configuration yet.

After I approve the plan, work one milestone at a time.

Important requirements:
- Build reusable shared layout first: SiteHeader, desktop navigation, Products dropdown, mobile navigation, SiteFooter, PageContainer, SectionHeading, and buttons.
- Navbar should be inspired by the Green Touch Corporation reference, but branding, design details, text, and assets must be original.
- Products dropdown has three data-driven category groups: Stone, Sand, Bricks, with variants nested under them.
- Dropdown and catalogue pages must use one shared product repository. Never hardcode product variants separately in the navbar.
- Product names in README are reference examples only. Keep all categories/variants unpublished until the client confirms them.
- Bengali-first with English-ready architecture; use Inter and Noto Sans Bengali.
- Use the existing project setup and palette where possible.
- Phase one is frontend-only with local typed data. Do not add backend, database, CMS, authentication, cart, or checkout.
- Server Components by default; client components only for interactions.
- Never invent company details, contact info, products, specifications, prices, delivery areas, projects, certificates, or testimonials.
- Keep the code modular, responsive, accessible, and SEO-friendly.
- At the end of each milestone, run relevant checks and summarize files changed, behavior implemented, and remaining issues.
```

## 18. Definition of done

- [ ] Company name and logo are client-approved.
- [ ] Shared header/footer appear on all pages.
- [ ] Desktop dropdown works by click and keyboard.
- [ ] Mobile menu and product accordion work by touch and keyboard.
- [ ] Menu and catalogue use the same product data.
- [ ] Only client-confirmed categories and variants are published.
- [ ] Unverified product entries remain hidden.
- [ ] All required routes work.
- [ ] Responsive layouts have no horizontal overflow.
- [ ] Bengali and English typography render correctly.
- [ ] Contact information is confirmed.
- [ ] No fabricated project, certification, testimonial, stock, or company claim.
- [ ] Metadata, sitemap, robots, and image alt text are implemented.
- [ ] Lint, type-check, and production build pass.

## 19. References

- Design/content reference: https://greentouch.group/companies/corporation/
- Next.js docs: https://nextjs.org/docs
- Next.js App Router: https://nextjs.org/docs/app
- Next.js Metadata: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
- Tailwind CSS: https://tailwindcss.com/docs
- Lucide: https://lucide.dev/icons

---

**Final direction:** Build a trustworthy, elegant, Bengali-first corporate website for **M/S. AZMIR ENTERPRIZE**. Prioritize reusable layout and an accessible dropdown navbar. Keep the three-category catalogue data-driven and do not publish unverified information.
