# LeadTable Component - Implementation Guide

## Overview
Professional glass-morphism React component for displaying lead enrichment results in an organized, interactive table format.

**File**: `/frontend/src/components/LeadTable.tsx` (421 lines)

---

## Component Props

```typescript
interface LeadTableProps {
  jobId: string
  leads: Lead[]
  isLoading: boolean
}
```

### Props Description
- **jobId**: Unique identifier for the batch job (for reference)
- **leads**: Array of enriched lead objects with all data
- **isLoading**: Boolean to show loading state while fetching

---

## Lead Data Type

```typescript
interface Lead {
  company: string
  domain: string
  services: string[]
  pricing: string[]
  contacts: {
    emails: string[]
    phones: string[]
    social: {
      linkedin: string
      twitter: string
      instagram: string
      whatsapp: string
    }
  }
  tech_stack: string[]
  competitors_mentioned: string[]
  source_links: {
    services_found_on: string
    pricing_found_on: string
    contact_found_on: string
  }
  gaps: string[]
  value_prop: string
  score: number
  cached: boolean
}
```

---

## UI Design

### Glass Card Design
```
backdrop-blur-md bg-white/5 border border-white/10
hover:border-white/20 (on hover)
```
- Semi-transparent white background
- Blur effect for glass-morphism
- Subtle border
- Smooth hover transition

### Gradient Header Bar
```
bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500
```
- Decorative gradient at top
- Cyan → Purple → Pink

### Card Layout
- Stacked vertically with `gap-4`
- Responsive columns (hidden on smaller screens)
- Desktop: All columns visible
- Tablet: Hides Tech Stack, Gaps count
- Mobile: Shows only Company, Domain, Score

---

## Column Visibility

### Main Row (Always Visible)
1. **Expand Icon** - ChevronDown icon, rotates on expand
2. **Company + Domain** - White company name, cyan domain link
3. **Services** (Large screens) - Max 5 purple pills
4. **Pricing** (Medium+) - First pricing tier
5. **Tech Stack** (XL screens) - Max 3 blue pills
6. **Gaps** (Medium+) - Red badge with count
7. **Score Badge** - Colored (green/yellow/red) with label

### Breakpoints
```
lg: (1024px) - Show Services
md: (768px) - Show Pricing, Gaps count
xl: (1280px) - Show Tech Stack
```

---

## Score Badge Colors & Labels

| Score | Color | Label | Glow |
|-------|-------|-------|------|
| 80-100 | Green (#22c55e) | Strong Lead | green-500/25 |
| 50-79 | Yellow (#eab308) | Warm Lead | yellow-500/25 |
| 0-49 | Red (#ef4444) | Weak Lead | red-500/25 |

**Styling**:
```
bg-{color}-500/20 
border border-{color}-500/50 
text-{color}-300 
shadow-lg shadow-{color}-500/25
```

---

## Badge Styles

### Services (Purple Pills)
```
bg-purple-500/20 border-purple-500/30 text-purple-200
```
- Max 5 shown in main row
- All shown in expanded view

### Tech Stack (Blue Pills)
```
bg-blue-500/20 border-blue-500/30 text-blue-200
```
- Max 3 in main row
- All in expanded view

### Contacts (Cyan Chips)
```
bg-cyan-500/20 border-cyan-500/30 text-cyan-200
```
- Emails and phones together
- Text-xs size

### Gaps (Red Badges)
```
bg-red-500/20 border-red-500/50 text-red-300
shadow-lg shadow-red-500/25
```
- Red glow effect
- Highlight important missing features

---

## Source Links

**Style**:
```
bg-white/5 text-cyan-400 text-xs
hover:bg-white/10
```

**Format**:
```
Found on: /services [external link icon]
Found on: /pricing [external link icon]
Found on: /contact [external link icon]
```

**Functionality**:
- Opens in new tab
- Shows under each relevant section
- Only shown if URL exists
- ExternalLink icon (lucide-react)

---

## Expanded Row (Click to Open)

When user clicks on a card, it expands to show:

### Background
```
bg-black/20 border-t border-white/5
```

### Content (In Order)
1. **Services** - Full list with source link
2. **Pricing** - All pricing tiers with source link
3. **Contacts** - All emails/phones + social links
   - LinkedIn (clickable)
   - Twitter (clickable)
   - Instagram (clickable)
   - WhatsApp (display only)
4. **Tech Stack** - Full tech list
5. **Competitors** - All competitors mentioned
6. **Value Proposition** - Italicized quote
7. **Gaps** - All identified gaps in red badges
8. **Full JSON** - Complete data dump in code block

### JSON Code Block
```
bg-black/60 p-3 rounded
text-xs text-gray-300
border border-white/10
max-h-64 overflow-auto
```

---

## Empty States

### No Leads
```
No leads found.
Upload a CSV to start.
```
- Centered text
- Gray coloring
- Shows when `leads.length === 0`

### Loading
```
Loading leads...
```
- Shows when `isLoading === true`
- Centered spinner text

---

## Cache Indicator

**When cached = true**:
```
✓ Served from cache — 0 credits used
```

**Style**:
```
bg-green-500/20 border-green-500/30
text-green-300 text-xs
```

**Position**: Under company name in main row

---

## Interactions

### Click to Expand
- Click anywhere on the card to expand/collapse
- ChevronDown icon rotates 180° when expanded
- Smooth animation with `transition-transform`
- Clicking expand icon doesn't navigate (stopPropagation)

### Domain Link
- Clicking domain opens in new tab
- Doesn't trigger card expand (stopPropagation)
- Cyan color indicates it's clickable

### External Links
- All URLs open in new tab
- ExternalLink icon indicates external
- Social media links in expanded view

---

## Responsive Design

### Mobile (< 768px)
- Only Company, Domain, Score visible
- No Services, Pricing, Tech, Gaps columns
- Full content in expanded view

### Tablet (768px - 1024px)
- Add Pricing, Gaps count
- Remove Tech Stack column
- Services remain hidden

### Desktop (1024px - 1280px)
- Add Services column
- Show Gaps count badge
- Tech Stack still hidden

### Large (1280px+)
- Show all columns
- Services, Pricing, Tech Stack, Gaps count
- Optimal layout

---

## Component State

```typescript
const [expandedId, setExpandedId] = useState<number | null>(null);
```

- Tracks which card is expanded
- Only one card open at a time
- Clicking same card closes it
- Clicking different card switches expansion

---

## Usage Example

```typescript
import LeadTable from '@/components/LeadTable';

export default function ResultsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const jobId = useSearchParams().get('jobId') || '1';

  useEffect(() => {
    // Fetch leads from API
    const fetchLeads = async () => {
      setIsLoading(true);
      const response = await fetch(`/api/job/${jobId}/leads`);
      const data = await response.json();
      setLeads(data.leads);
      setIsLoading(false);
    };
    
    fetchLeads();
  }, [jobId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Lead Intelligence Results</h1>
      <LeadTable jobId={jobId} leads={leads} isLoading={isLoading} />
    </div>
  );
}
```

---

## Styling Notes

### Colors Used
- **Cyan**: #06b6d4 (links, contacts)
- **Purple**: Services badges
- **Blue**: Tech Stack badges
- **Red**: Gaps badges
- **Green**: Cache indicator, Strong Lead
- **Yellow**: Warm Lead
- **Dark Gray**: Section headers, borders

### Tailwind Classes
- `backdrop-blur-md` - Glass effect
- `shadow-lg shadow-{color}-500/25` - Glow on badges
- `truncate` - Ellipsis for long text
- `hover:` - Smooth interactions
- `transition` - Smooth animations

### Responsive Classes
- `hidden lg:flex` - Hide on small, show on large
- `hidden md:block` - Hide mobile, show tablet+
- `hidden xl:flex` - Hide until extra large
- `gap-4`, `gap-2`, `gap-1` - Spacing

---

## Animation Details

### Expand Icon
```
transition-transform
rotate-180 (when expanded)
```

### Card Hover
```
hover:border-white/20
hover:bg-white/5 (on main row click area)
```

### Links
```
hover:underline (domain)
hover:bg-white/10 (source links)
```

---

## Accessibility

- Semantic HTML
- Clickable areas have proper hover states
- External links have `target="_blank" rel="noopener noreferrer"`
- Text has sufficient contrast
- Icons have proper sizing for readability

---

## Performance Optimizations

- Component uses `React.useState` (no unnecessary re-renders)
- Maps are keyed by index
- Event handlers use `stopPropagation`
- Lazy rendering of expanded content only when visible
- Conditional rendering of optional sections

---

## Known Limitations

- Only one card can be expanded at a time (by design)
- Services limited to 5 in main row (spec requirement)
- Tech Stack limited to 3 in main row (responsive)
- Gaps badge only shows count, not full list (in main row)

---

## Future Enhancements

1. **Multi-select**: Allow selecting multiple leads
2. **Sorting**: Sort by score, company name, etc.
3. **Filtering**: Filter by score range, gaps, etc.
4. **Search**: Find leads by company/domain
5. **Batch Actions**: Export selected leads to PDF
6. **Export**: Export individual lead as PDF
7. **Comparison**: Compare two leads side-by-side
8. **Favorites**: Star/bookmark important leads
9. **Notes**: Add custom notes to leads
10. **History**: Show crawl timestamp, previous scores

