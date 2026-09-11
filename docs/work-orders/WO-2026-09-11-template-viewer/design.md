# Template viewer design

## Information architecture

The catalog remains the browse and filter surface. `template.html?template=<id>` is the focused inspection surface for one normalized Template record.

The viewer order is:

1. identity and lifecycle state;
2. artifact preview state;
3. purpose, use-when, and provided structure;
4. applicability and relationships;
5. source, availability, verification, and revision;
6. library boundary and return path.

## Interaction states

| State | Expected behavior |
| --- | --- |
| Known Template | Render the selected record and update the document title. |
| No query | Explain how to choose a Template and link back to the catalog. |
| Unknown ID | Show a recoverable not-found message and return to the catalog. |
| Planned/unavailable artifact | Show the record metadata and a visible message that no artifact preview is available. |
| Long content | Keep text in readable blocks; allow normal page scrolling without horizontal overflow. |

## Responsive and accessibility rules

- Use a single-column reading order below 860px; secondary metadata follows the main preview and purpose.
- Keep the Template name, lifecycle status, and artifact-preview state visible before supporting relationships.
- Use real headings, a labeled navigation landmark, standard links, and `aria-live` for the viewer state.
- Make unavailable preview status legible through text and layout, not color alone.
- Preserve a keyboard path from the catalog link to the viewer content and back to the catalog.

## Boundary rule

The viewer presents normalized library metadata only. It may link to a declared source repository, but it must not iframe, download, execute, or synthesize content for an external Template artifact. A future renderable preview needs explicit source evidence and a separately reviewed data contract.
