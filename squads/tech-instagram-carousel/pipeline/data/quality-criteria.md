# Quality Criteria: Tech Instagram Carousel

## Content Quality

### Hook Effectiveness (Critical)
- [ ] Hook passes scroll-stop test: would stop you mid-scroll
- [ ] First 125 characters of caption work as standalone hook
- [ ] Opening slide creates curiosity gap or pattern interrupt
- [ ] No generic openers ("Você sabia que...", "No mundo de hoje...")

### Educational Value (Critical)
- [ ] Each slide advances narrative with new information
- [ ] Content is actionable: reader can apply learnings
- [ ] No filler slides or repetition between slides
- [ ] Clarity test: non-technical friend would understand

### Platform Optimization (Critical)
- [ ] 8-10 slides total (optimal range for Instagram carousels)
- [ ] 40-80 words per slide with two-layer hierarchy
- [ ] 5-10 hashtags in Portuguese (mix niche/mid-range/broad)
- [ ] No links in caption (Instagram doesn't make them clickable)

### Technical Accuracy (Blocking)
- [ ] All statistics have source attribution
- [ ] Claims are verifiable or qualified appropriately
- [ ] No outdated information (>30 days without evergreen justification)
- [ ] Domain vocabulary is professional and appropriate

### Brand Voice (Important)
- [ ] Tone matches Innovation Latam: professional yet accessible
- [ ] Uses first person when appropriate ("descobri", "testei", "aprendi")
- [ ] Conversational but authoritative (not hedging with "talvez", "pode ser")
- [ ] No jargon without context or simplification

### Engagement Design (Important)
- [ ] CTA is specific and actionable (not generic "curta e compartilhe")
- [ ] Caption ends with provocative question to drive comments
- [ ] Content passes anti-commodity check: can't be used inalterado by competitor
- [ ] Has unique angle or perspective differentiating from competitors

## Visual Quality

### Design System Consistency (Critical)
- [ ] All slides follow same design system (colors, fonts, spacing)
- [ ] Background colors alternate between slides (light/dark/accent)
- [ ] Font sizes meet platform minimums (hero 58px+, body 34px+, caption 24px+)
- [ ] Self-contained HTML: no external dependencies except Google Fonts @import

### Visual Hierarchy (Critical)
- [ ] Two-layer hierarchy visible: headline + supporting text
- [ ] Important text has WCAG AA contrast ratio 4.5:1 minimum
- [ ] Big numbers (when used) are visually dominant
- [ ] Layout uses Grid or Flexbox (not absolute positioning for primary structure)

### Technical Execution (Blocking)
- [ ] All HTML files render correctly at 1080x1440px viewport
- [ ] No text clipping or overflow
- [ ] No placeholder text (Lorem ipsum, "Texto aqui")
- [ ] All images generated successfully via Playwright

### Brand Consistency (Important)
- [ ] Innovation Latam branding present (logo or text)
- [ ] Visual style matches Template C: Number Focus specifications
- [ ] Design rationale documented for key choices

## Review Quality

### Completeness (Critical)
- [ ] All criteria scored with written justification
- [ ] Feedback cites specific passages, slides, or sentences
- [ ] Required changes separated from suggestions (non-blocking)
- [ ] Verdict (APPROVE/REJECT) matches scoring logic

### Actionability (Critical)
- [ ] Every rejection includes specific fix instructions
- [ ] Fixes include: what's wrong, where it is, how to correct
- [ ] Author can implement changes without guessing intent
- [ ] Revision count tracked (current revision number, max allowed)

### Balance (Important)
- [ ] At least one "Strength:" noted even in REJECT reviews
- [ ] Constructive tone: what works before what doesn't
- [ ] Based on criteria, not personal preference
- [ ] Consistent scoring standards across all reviews

## Thresholds

- **Overall Score:** Must be ≥7/10 to APPROVE
- **Individual Criteria:** No single criterion <4/10
- **Max Revisions:** 3 attempts before escalation
- **Hard Blockers:** Platform guidelines, technical accuracy, missing sources
