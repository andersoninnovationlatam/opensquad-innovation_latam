# Anti-Patterns: Tech Instagram Carousel

## Content Creation Anti-Patterns

### Never Do

**1. Generic Openers**
- **What:** Starting with "Você sabia que...", "No mundo de hoje...", "A tecnologia está..."
- **Why harmful:** These are scroll triggers — 70-80% of users scroll past in first 2-3 seconds
- **What happens:** Immediate engagement drop, algorithm deprioritizes your content
- **Fix:** Use specific hooks: questions, statistics, contrarian statements, curiosity gaps

**2. Information Overload Per Slide**
- **What:** Cramming multiple concepts or >80 words into a single slide
- **Why harmful:** Creates cognitive overload, users skip slides without reading
- **What happens:** Completion rate drops below 40%, algorithm reduces reach
- **Fix:** One concept per slide, 40-80 words max, use visual hierarchy

**3. Weak or Missing Hook in Caption**
- **What:** Starting caption with context instead of value ("Este post vai falar sobre...")
- **Why harmful:** Caption is cut at 125 characters in feed — if first line doesn't hook, they don't click "...mais"
- **What happens:** 60% lower engagement rate on identical content with weak vs strong hook
- **Fix:** Front-load value in first 125 chars, make it work as standalone hook

**4. Using CTAs Generic**
- **What:** "Curta e compartilhe", "Double tap if you agree", "Segue para mais"
- **Why harmful:** Generic CTAs signal low-effort content, algorithm learned to deprioritize them
- **What happens:** Comment rate drops 40%, reach decreases
- **Fix:** Specific actionable CTAs: "Comenta 'GUIA' que eu mando o PDF", "Qual mito te surpreendeu? Comenta o número"

**5. Missing Source Attribution**
- **What:** Citing statistics or claims without source ("estudos mostram que...", "especialistas dizem...")
- **Why harmful:** Destroys credibility, violates platform guidelines on misinformation
- **What happens:** Users comment challenging claims, algorithm flags as controversial, reach drops
- **Fix:** Always cite: "segundo pesquisa da GitHub (2026)", "Harvard publicou estudo mostrando"

**6. Jargon Without Context**
- **What:** Using technical terms without explanation ("leverage synergies", "disruptive innovation")
- **Why harmful:** Alienates 70-80% of audience who aren't domain experts
- **What happens:** High bounce rate (users swipe away mid-carousel), low completion
- **Fix:** Define at point of use or use simpler analogies

**7. Over-Polished Content**
- **What:** Highly edited, generic stock photos, perfect templates that look like ads
- **Why harmful:** 2026 algorithm change penalizes lack of authenticity
- **What happens:** Algorithm labels as "promotional content", reduces organic reach by 60%
- **Fix:** Balance professional design with authentic voice, use real examples not generic templates

**8. Too Many Hashtags**
- **What:** Using 15-30 hashtags (old Instagram strategy pre-2024)
- **Why harmful:** 2026 algorithm update penalizes hashtag spam, reduces reach
- **What happens:** Post is flagged as low-quality, shown to fewer non-followers
- **Fix:** Use 5-10 strategic hashtags (mix niche/mid-range/broad) in Portuguese

**9. Links in Caption**
- **What:** Writing "link na bio" or pasting URLs in caption
- **Why harmful:** Instagram doesn't make caption links clickable — wasted characters, signals external redirect
- **What happens:** Users get frustrated, algorithm deprioritizes posts with URLs
- **Fix:** Direct users to link in bio ONLY if necessary, or use CTA that stays on platform

**10. Feature-Focused Instead of Outcome-Focused**
- **What:** Listing what a tool does instead of what the user achieves ("ChatGPT tem Code Interpreter")
- **Why harmful:** Users care about results, not features — feature lists don't trigger action
- **What happens:** Low save rate, low shares (not personally relevant)
- **Fix:** Lead with outcome: "Como analisar 1000 linhas de dados em 2 minutos sem escrever código"

## Design Anti-Patterns

### Never Do

**1. Font Sizes Below Platform Minimums**
- **What:** Using body text <34px, headlines <58px, captions <24px on 1080x1440 viewport
- **Why harmful:** Text becomes unreadable on mobile, users skip slide
- **What happens:** Completion rate plummets, users complain in comments about readability
- **Fix:** Follow minimum specs: hero 180px, headline 58px, body 34px, caption 24px

**2. Designing Without Design System First**
- **What:** Creating slides ad-hoc without establishing consistent colors, fonts, spacing
- **Why harmful:** Causes visual inconsistency between slides, looks amateur
- **What happens:** Unprofessional appearance, lower trust, users question content quality
- **Fix:** Document design system before creating first slide: colors, typography, spacing, layout rules

**3. Using External Dependencies in HTML**
- **What:** Linking to external CSS files, JavaScript libraries, or images hosted elsewhere
- **Why harmful:** Creates fragility — if external resource fails, slide breaks; also slows rendering
- **What happens:** Rendering fails, blank slides, missed deadlines
- **Fix:** Self-contained HTML with inline CSS, no external deps except Google Fonts @import

**4. Absolute Positioning for Primary Layout**
- **What:** Using `position: absolute` for main content structure instead of Flexbox/Grid
- **Why harmful:** Brittle, breaks across different viewport sizes, hard to maintain
- **What happens:** Content overlaps, text clips, design breaks when copy changes length
- **Fix:** Use Flexbox or Grid for structure, reserve absolute positioning for decorative overlays only

**5. Skipping Visual Verification of First Slide**
- **What:** Batch-rendering all slides without checking first slide quality
- **Why harmful:** If design system has error, you render 8-10 broken slides
- **What happens:** Massive rework, missed deadlines, wasted rendering time
- **Fix:** Always render and verify slide 1 before batch-creating remaining slides

**6. Using Low Contrast Text**
- **What:** Light gray text on white background, dark gray on black (contrast ratio <4.5:1)
- **Why harmful:** Fails WCAG accessibility standards, hard to read on mobile in sunlight
- **What happens:** Users skip slides, complain about readability, exclude visually impaired users
- **Fix:** Verify all text meets WCAG AA minimum contrast ratio of 4.5:1

**7. Placeholder Text in Deliverables**
- **What:** Leaving "Lorem ipsum", "Texto aqui", "[Insert stat]" in final HTML
- **Why harmful:** Signals incomplete work, destroys credibility, wastes rendering
- **What happens:** Review rejects, client/user loses trust, rework required
- **Fix:** All text must be final content from brief before rendering

**8. Including Slide Counters**
- **What:** Adding "1/8", "Slide 3 of 9" text to carousel slides
- **Why harmful:** Instagram has native dot navigation, counters are redundant and cluttered
- **What happens:** Visual noise, looks amateur, wastes prime real estate
- **Fix:** Remove slide counters entirely, trust platform's native navigation

## Review Anti-Patterns

### Never Do

**1. Approving Without Complete Read**
- **What:** Skimming content and giving APPROVE without thorough review
- **Why harmful:** Misses errors, weak sections, inconsistencies — quality drops
- **What happens:** Publish broken content, damage brand reputation, lose audience trust
- **Fix:** Read every word, view every slide before scoring

**2. Vague Feedback**
- **What:** "This needs work", "Not quite right", "Improve the flow"
- **Why harmful:** Author doesn't know what to fix or how to fix it
- **What happens:** Author guesses, makes wrong changes, wastes revision cycle
- **Fix:** Cite specific passage/slide, explain what's wrong, provide concrete fix

**3. Rejecting Without Actionable Fixes**
- **What:** Pointing out problems without explaining how to solve them
- **Why harmful:** Author can't proceed, gets stuck, deadline slips
- **What happens:** Frustration, delays, eventually author gives up or ships subpar work
- **Fix:** Every rejection includes: what's wrong, where it is, how to correct with example

**4. Inflating Scores to Avoid Conflict**
- **What:** Giving 7-8/10 to work that's actually 4-5/10 to avoid difficult conversation
- **Why harmful:** Poor quality content ships, damages brand, degrades standards over time
- **What happens:** Audience disengages, algorithm penalizes low-quality content, growth stops
- **Fix:** Score honestly against criteria, not against desire to please

**5. Personal Preference Over Criteria**
- **What:** Rejecting because "I would write it differently" instead of checking objective criteria
- **Why harmful:** Introduces bias, inconsistent standards, author can't predict what will pass
- **What happens:** Author loses confidence, quality becomes subjective lottery
- **Fix:** Follow rubric strictly, separate personal taste from objective quality criteria

**6. Rushing Reviews Under Deadline Pressure**
- **What:** Skipping sections, not verifying claims, giving shallow feedback due to time pressure
- **Why harmful:** Surface review misses fundamental issues, poor quality ships
- **What happens:** Post-publish errors, corrections, apologies, audience trust damaged
- **Fix:** Better to delay review than ship broken content — quality first always

## Always Do (Positive Practices)

**1. Front-Load Value**
- Do: Put strongest hook in first 125 characters of caption and first slide
- Why: Captures attention before "...mais" cut and before first swipe

**2. Alternate Background Colors**
- Do: Light → Dark → Accent → Dark → Light pattern across slides
- Why: Creates visual rhythm, prevents slide fatigue, guides eye through content

**3. Cite Specific Locations in Feedback**
- Do: "In slide 3, the headline 'Como usar IA'..." or "Caption paragraph 2 starting with 'Eu descobri'..."
- Why: Author knows exactly where to make changes, no guessing

**4. Test Hook with Scroll-Stop Test**
- Do: Read hook while scrolling fast — does it stop you mid-scroll?
- Why: Real user behavior is fast scrolling, hook must interrupt pattern

**5. Apply Anti-Commodity Check**
- Do: Ask "Could a competitor use this unchanged?" If yes, add specificity
- Why: Generic content has no unique value, specific content builds authority

**6. Verify All Claims Have Sources**
- Do: Every statistic and study mentioned includes source and date
- Why: Builds credibility, prevents misinformation flags, establishes authority

**7. Document Design Rationale**
- Do: Explain why you chose specific colors, fonts, layouts
- Why: Helps maintain consistency, allows team to learn design thinking

**8. Recognize Strengths Even in Rejections**
- Do: Include at least one "Strength:" item in every review
- Why: Shows thorough review, maintains morale, guides author on what to keep
