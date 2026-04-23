# Domain Framework: Tech Instagram Carousel Creation

## Research → News Selection

**Phase Goal:** Find high-quality tech news that resonates with Brazilian tech audience

**Process:**
1. Define research focus (topic area + time range)
2. Execute targeted web searches with tech keywords in Portuguese
3. Collect 5-8 relevant stories with complete metadata (source, date, author)
4. Evaluate each story across 4 dimensions:
   - Relevance to Innovation Latam audience
   - Virality potential (curiosity, emotion, surprise)
   - Educational value (actionable takeaways)
   - Recency (24-48h preferred, evergreen acceptable with justification)
5. Rank stories by combined score (relevance × potential × authority)
6. Present ranked list with summaries for user selection

**Decision Point:** User selects one news story to develop

## Angle Generation

**Phase Goal:** Generate 5 distinct emotional angles from selected news

**Process:**
1. Load selected news story with context
2. Generate 5 angles using different emotional triggers:
   - **Medo (fear):** Highlight risk or loss
   - **Oportunidade (opportunity):** Show competitive advantage or gain
   - **Educacional (educational):** Teach actionable knowledge
   - **Contrário (contrarian):** Challenge conventional wisdom
   - **Inspiracional (inspirational):** Show transformation or possibility
3. Each angle includes: title, emotional trigger, target audience reaction, carousel structure preview
4. Present all 5 angles for user selection

**Decision Point:** User selects one angle to develop

## Carousel Creation

**Phase Goal:** Write complete carousel with copy + structure optimized for Instagram

**Process:**
1. Load selected angle from checkpoint
2. Draft 3 hook options using different structural types:
   - Question (engages completion instinct)
   - Statistic (compelling numbers)
   - Contrarian statement (challenges conventional wisdom)
3. Select strongest hook based on scroll-stop test
4. Choose carousel format from 6 types:
   - Editorial (deep dive on single topic)
   - Listicle (numbered items)
   - Tutorial (step-by-step guide)
   - Mito vs Realidade (myth-busting)
   - Storytelling (narrative arc)
   - Problema→Solução (transformation)
5. Design structure: 8-10 slides following arc: Cover → Context → Content slides → Synthesis → CTA
6. Write each slide with 40-80 words, two-layer hierarchy (headline + supporting text)
7. Alternate background colors (light/dark/accent) for visual rhythm
8. Write caption: hook in first 125 chars, body with line breaks, closing question
9. Select 5-10 hashtags (mix niche/mid-range/broad, Portuguese)
10. Output complete carousel draft

**Decision Point:** User approves content before visual design

## Visual Design

**Phase Goal:** Create slide images in HTML/CSS and render via Playwright

**Process:**
1. Load carousel text from creator output
2. Load design system from visual-identity.md (Template C: Number Focus)
3. For each slide, create self-contained HTML with inline CSS following design system
4. Start HTTP server in output folder
5. Render slide 1 via Playwright: navigate → resize to 1080x1440 → screenshot
6. Verify slide 1 quality (font sizes, contrast, no clipping)
7. Batch-create remaining HTML slides using same design system
8. Render all slides sequentially via Playwright
9. Verify all images for consistency and quality
10. Stop HTTP server after completion

## Quality Review

**Phase Goal:** Evaluate complete carousel against quality criteria

**Process:**
1. Load quality criteria from pipeline/data/quality-criteria.md
2. Read complete carousel content (copy + slide descriptions + rendered images)
3. Score each criterion individually on 1-10 scale with written justification
4. Identify specific passages/slides for feedback (cite paragraph, slide number, or sentence)
5. Apply decision rules:
   - APPROVE if overall ≥7/10 AND no criterion <4/10
   - REJECT if overall <7/10 OR any criterion <4/10
6. Write structured review: verdict, scoring table, detailed feedback per criterion, required changes, suggestions
7. If REJECT: provide specific fixes with locations and examples, loop back to creator
8. If APPROVE: content proceeds to final approval checkpoint

**Decision Point:** User gives final approval before publishing
