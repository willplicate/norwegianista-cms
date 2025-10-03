# Design System Specification
**Feature**: Cruise Blog CMS - Norwegianista
**Date**: 2025-10-01
**Source**: Existing design at sea-insights-lab.lovable.app

## Overview
The Norwegianista design follows a modern, content-focused approach with a nautical color scheme emphasizing deep navy blues and teals. The design prioritizes readability and visual hierarchy with large hero imagery and card-based content layouts.

## Color Palette

### Primary Colors
```css
--primary-navy: #1e3a5f;        /* Deep navy blue - headers, navigation */
--primary-teal: #00bcd4;        /* Bright teal - CTAs, accents */
--primary-teal-dark: #0097a7;   /* Darker teal - hover states */
```

### Secondary Colors
```css
--secondary-blue: #2c5f8d;      /* Mid-tone blue - backgrounds */
--secondary-light-blue: #4a7ba7; /* Light blue accents */
```

### Neutral Colors
```css
--white: #ffffff;
--gray-50: #f8f9fa;             /* Light background */
--gray-100: #e9ecef;            /* Borders, dividers */
--gray-200: #dee2e6;
--gray-600: #6c757d;            /* Body text secondary */
--gray-700: #495057;            /* Body text primary */
--gray-800: #343a40;
--gray-900: #212529;            /* Headings */
--black: #000000;
```

### Semantic Colors
```css
--success: #28a745;
--info: #17a2b8;
--warning: #ffc107;
--danger: #dc3545;
```

## Typography

### Font Families
```css
--font-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
                'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                sans-serif;
--font-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas,
             'Courier New', monospace;
```

### Font Sizes
```css
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */
--text-5xl: 3rem;        /* 48px */
```

### Font Weights
```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Line Heights
```css
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;
```

## Spacing System

### Scale (based on 4px base unit)
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

## Layout Structure

### Container Widths
```css
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;

/* Content max-width */
--content-width: 1200px;
```

### Grid System
```css
--grid-columns: 12;
--grid-gap: 1.5rem;     /* 24px */
--grid-gap-sm: 1rem;    /* 16px */
```

### Breakpoints
```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

## Components

### Header / Navigation

**Structure**:
- Fixed header with white background
- Logo on the left (teal circle with ship icon + "Voyage Insights" text)
- Horizontal navigation menu (center/right)
- Dropdown menus for main categories
- Search icon on far right

**Styles**:
```css
.header {
  background: var(--white);
  border-bottom: 1px solid var(--gray-100);
  padding: var(--space-4) var(--space-6);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.nav-link {
  color: var(--gray-700);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  padding: var(--space-2) var(--space-4);
  text-decoration: none;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: var(--primary-teal);
}

.dropdown-menu {
  background: var(--white);
  border: 1px solid var(--gray-100);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: var(--space-2);
  padding: var(--space-2);
  min-width: 200px;
}

.dropdown-item {
  color: var(--gray-700);
  padding: var(--space-2) var(--space-4);
  border-radius: 4px;
  transition: background 0.2s ease;
}

.dropdown-item:hover {
  background: var(--gray-50);
  color: var(--primary-teal);
}
```

### Hero Section

**Structure**:
- Full-width background image with overlay
- Centered content container
- Small category tag ("Featured Analysis")
- Large headline (H1)
- Descriptive subheading
- Two CTAs (primary + secondary)

**Styles**:
```css
.hero {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  padding: var(--space-24) var(--space-6);
  min-height: 500px;
  display: flex;
  align-items: center;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(30, 58, 95, 0.85) 0%,
    rgba(44, 95, 141, 0.75) 100%
  );
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 700px;
  color: var(--white);
}

.hero-tag {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--primary-teal);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-3);
}

.hero-title {
  font-size: var(--text-5xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  margin-bottom: var(--space-4);
  color: var(--white);
}

.hero-description {
  font-size: var(--text-lg);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-8);
  color: rgba(255, 255, 255, 0.9);
}

.hero-actions {
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
}
```

### Buttons

**Primary Button** (Teal):
```css
.btn-primary {
  background: var(--primary-teal);
  color: var(--white);
  padding: var(--space-3) var(--space-6);
  border-radius: 6px;
  font-weight: var(--font-semibold);
  font-size: var(--text-base);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}

.btn-primary:hover {
  background: var(--primary-teal-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 188, 212, 0.3);
}
```

**Secondary Button** (Outlined):
```css
.btn-secondary {
  background: transparent;
  color: var(--white);
  padding: var(--space-3) var(--space-6);
  border: 2px solid var(--white);
  border-radius: 6px;
  font-weight: var(--font-semibold);
  font-size: var(--text-base);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: var(--white);
  color: var(--primary-navy);
}
```

### Article Cards

**Structure**:
- Image thumbnail on top (16:9 aspect ratio)
- Category badge overlay on image
- Content area with padding
- Category tag (small, teal)
- Article title (H3)
- Excerpt text
- Metadata row (author, date, read time)

**Styles**:
```css
.article-card {
  background: var(--white);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.article-card-image {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.article-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.article-card:hover .article-card-image img {
  transform: scale(1.05);
}

.article-card-badge {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  background: rgba(255, 255, 255, 0.95);
  color: var(--gray-700);
  padding: var(--space-1) var(--space-3);
  border-radius: 4px;
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.article-card-content {
  padding: var(--space-6);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.article-card-category {
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--primary-teal);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-2);
}

.article-card-title {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-snug);
  color: var(--gray-900);
  margin-bottom: var(--space-3);
}

.article-card-title:hover {
  color: var(--primary-teal);
}

.article-card-excerpt {
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  color: var(--gray-600);
  margin-bottom: var(--space-4);
  flex: 1;
}

.article-card-meta {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  font-size: var(--text-xs);
  color: var(--gray-600);
  padding-top: var(--space-3);
  border-top: 1px solid var(--gray-100);
}

.article-card-meta-item {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}
```

### Article Grid

**Structure**:
- 3-column grid on desktop
- 2-column on tablet
- 1-column on mobile
- Equal height cards

**Styles**:
```css
.article-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-8);
  margin: var(--space-12) 0;
}

@media (max-width: 1024px) {
  .article-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .article-grid {
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }
}
```

### Section Headers

**Styles**:
```css
.section {
  padding: var(--space-16) var(--space-6);
  max-width: var(--content-width);
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: var(--space-12);
}

.section-title {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  color: var(--gray-900);
  margin-bottom: var(--space-3);
}

.section-subtitle {
  font-size: var(--text-lg);
  color: var(--gray-600);
  max-width: 700px;
  margin: 0 auto;
}
```

### Newsletter Signup Section

**Structure**:
- Teal/blue gradient background
- White text
- Email input + Subscribe button inline
- Full-width section

**Styles**:
```css
.newsletter-section {
  background: linear-gradient(
    135deg,
    var(--primary-teal) 0%,
    var(--secondary-blue) 100%
  );
  padding: var(--space-16) var(--space-6);
  text-align: center;
}

.newsletter-title {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--white);
  margin-bottom: var(--space-3);
}

.newsletter-description {
  font-size: var(--text-lg);
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: var(--space-8);
}

.newsletter-form {
  display: flex;
  gap: var(--space-3);
  max-width: 500px;
  margin: 0 auto;
  flex-wrap: wrap;
}

.newsletter-input {
  flex: 1;
  min-width: 250px;
  padding: var(--space-3) var(--space-4);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  color: var(--white);
  font-size: var(--text-base);
}

.newsletter-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.newsletter-input:focus {
  outline: none;
  border-color: var(--white);
  background: rgba(255, 255, 255, 0.2);
}

.newsletter-button {
  padding: var(--space-3) var(--space-6);
  background: var(--white);
  color: var(--primary-teal);
  border: none;
  border-radius: 6px;
  font-weight: var(--font-semibold);
  cursor: pointer;
  transition: all 0.2s ease;
}

.newsletter-button:hover {
  background: var(--gray-100);
  transform: translateY(-1px);
}
```

### Footer

**Structure**:
- Dark navy background
- 4-column layout (logo + 3 link columns)
- Logo on left
- Link categories (Categories, Resources, Follow)
- Copyright notice at bottom

**Styles**:
```css
.footer {
  background: var(--primary-navy);
  color: var(--white);
  padding: var(--space-16) var(--space-6) var(--space-8);
}

.footer-content {
  max-width: var(--content-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: var(--space-8);
  margin-bottom: var(--space-12);
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-6);
  }
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.footer-logo {
  width: 32px;
  height: 32px;
}

.footer-brand-text {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
}

.footer-tagline {
  color: rgba(255, 255, 255, 0.7);
  font-size: var(--text-sm);
}

.footer-column-title {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-4);
  color: rgba(255, 255, 255, 0.9);
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-link {
  color: rgba(255, 255, 255, 0.7);
  font-size: var(--text-sm);
  text-decoration: none;
  padding: var(--space-2) 0;
  display: block;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: var(--primary-teal);
}

.footer-bottom {
  text-align: center;
  padding-top: var(--space-8);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.6);
  font-size: var(--text-sm);
}
```

## Blog Post Layout

### Article Header
```css
.article-header {
  max-width: 800px;
  margin: 0 auto var(--space-12);
  padding-top: var(--space-12);
}

.article-breadcrumb {
  font-size: var(--text-sm);
  color: var(--gray-600);
  margin-bottom: var(--space-4);
}

.article-category-tag {
  display: inline-block;
  background: var(--gray-100);
  color: var(--primary-teal);
  padding: var(--space-1) var(--space-3);
  border-radius: 4px;
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-4);
}

.article-title {
  font-size: var(--text-5xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  color: var(--gray-900);
  margin-bottom: var(--space-4);
}

.article-meta {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  font-size: var(--text-sm);
  color: var(--gray-600);
  margin-bottom: var(--space-6);
}
```

### Article Body
```css
.article-body {
  max-width: 800px;
  margin: 0 auto;
  font-size: var(--text-lg);
  line-height: var(--leading-relaxed);
  color: var(--gray-700);
}

.article-body h2 {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--gray-900);
  margin-top: var(--space-12);
  margin-bottom: var(--space-4);
}

.article-body h3 {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--gray-900);
  margin-top: var(--space-8);
  margin-bottom: var(--space-3);
}

.article-body p {
  margin-bottom: var(--space-6);
}

.article-body img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin: var(--space-8) 0;
}

.article-body blockquote {
  border-left: 4px solid var(--primary-teal);
  padding-left: var(--space-6);
  margin: var(--space-8) 0;
  font-style: italic;
  color: var(--gray-600);
  background: var(--gray-50);
  padding: var(--space-6);
  border-radius: 4px;
}

.article-body ul,
.article-body ol {
  margin-bottom: var(--space-6);
  padding-left: var(--space-6);
}

.article-body li {
  margin-bottom: var(--space-2);
}
```

### Sidebar (for blog layout)
```css
.article-sidebar {
  background: var(--white);
  border: 1px solid var(--gray-100);
  border-radius: 12px;
  padding: var(--space-6);
  position: sticky;
  top: 100px;
}

.sidebar-stat {
  text-align: center;
  padding: var(--space-4);
}

.sidebar-stat-value {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  color: var(--primary-teal);
  display: block;
  margin-bottom: var(--space-2);
}

.sidebar-stat-label {
  font-size: var(--text-sm);
  color: var(--gray-600);
}

.sidebar-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-4);
}

.sidebar-tag {
  background: var(--gray-100);
  color: var(--gray-700);
  padding: var(--space-1) var(--space-3);
  border-radius: 4px;
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}
```

## Interactive Elements

### Hover States
- Cards: translateY(-4px) + enhanced shadow
- Images: scale(1.05) transform
- Links: color change to teal
- Buttons: translateY(-1px) + shadow

### Focus States
```css
:focus-visible {
  outline: 2px solid var(--primary-teal);
  outline-offset: 2px;
}
```

### Transitions
```css
/* Default transition for most elements */
transition: all 0.2s ease;

/* Image transforms */
transition: transform 0.3s ease;

/* Shadow changes */
transition: box-shadow 0.3s ease;
```

## Shadows

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 2px 8px rgba(0, 0, 0, 0.08);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
--shadow-xl: 0 12px 40px rgba(0, 0, 0, 0.15);
```

## Border Radius

```css
--radius-sm: 4px;
--radius-md: 6px;
--radius-lg: 8px;
--radius-xl: 12px;
--radius-full: 9999px;
```

## Implementation Notes

### Framework Recommendation
Based on the design, recommend using:
- **Tailwind CSS** for utility-first styling with custom theme configuration
- **React** with Next.js for component architecture
- **shadcn/ui** or **Headless UI** for accessible component primitives

### Custom Theme Configuration (Tailwind)
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          navy: '#1e3a5f',
          teal: '#00bcd4',
          'teal-dark': '#0097a7',
        },
        secondary: {
          blue: '#2c5f8d',
          'light-blue': '#4a7ba7',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      maxWidth: {
        content: '1200px',
      },
    },
  },
};
```

### Responsive Design
- Mobile-first approach
- Breakpoints at 640px, 768px, 1024px, 1280px
- Hero section reduces padding and font sizes on mobile
- Article grid collapses to 2 columns then 1 column
- Footer grid adjusts to 2 columns then stacks

### Performance Considerations
- Use next/image for optimized image loading
- Lazy load article cards below the fold
- Optimize hero images (WebP format, proper sizing)
- Consider skeleton loaders for content loading states

## CMS Admin Interface Design

For the admin CMS (not shown in screenshots), recommend:
- Similar color palette but lighter overall (more white space)
- Sidebar navigation on left
- Main content area with tables/forms
- Modal dialogs for article editing
- Toast notifications for actions
- Consistent with public site branding but more functional/utilitarian

---

**Design System Complete**
All visual specifications extracted and documented for implementation.
