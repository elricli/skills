---
name: prototype
description: "Build UI wireframes and product prototypes as multiple page artboards on one navigable canvas. Use for /prototype, 原型图, 多页面原型, 画布原型, wireframes, screen flows, or comparing UI layouts before implementation."
disable-model-invocation: true
---

# Prototype

Deliver one canvas containing the product's different pages as separate artboards. The reviewer should see the page structure and flow together, then zoom into any page. Use this format for UI prototypes unless the user requests another format.

The artifact settles product and design questions. Keep its code disposable; carry approved decisions into the real implementation.

## Preserve the canvas UI

Use [the supplied canvas reference](references/canvas-reference.png) as the visual specification for everything outside the page interiors. Keep its title bar, project menu, Export and window controls, Page 1 selector, floating presentation/settings/zoom controls, canvas heading, artboard labels/actions, plain gray background, and bottom tool palette. Match their positions, spacing, sizes, type, colors, borders, icons, radii, and shadows. Replace page content inside `.screen-inner`; keep the surrounding canvas UI fixed unless the user requests a change to it.

The user explicitly removed the reference's Ask Claude button. Omit the button, its popover, and its event handlers. Compact and recenter the remaining tool palette. This is the approved `remove-ask-claude` exception in the comparison metadata; it does not authorize other canvas UI changes.

Inspect the reference before changing the template. Do not substitute a dot grid, a permanent page-index row, another toolbar layout, or a restyled canvas. Those change the requested deliverable even when the pages themselves are correct.

## Shape the canvas

- Read the requested scope, references, earlier approvals, and the repo's design rules first. Infer a small page inventory from the task. Ask only about a product choice that materially changes the result and cannot be inferred.
- Give each page a stable ID, descriptive name, and viewport size. Include the pages needed to explain the requested flow. Separate important states such as empty results or a confirmation into labeled artboards when they need review.
- Arrange the main flow left to right, related states underneath, and alternative directions in labeled groups. Keep distinct pages visible together; a tab or variant switcher alone does not deliver the canvas.
- Draw recognizable page UI at the requested fidelity, with meaningful sample content and consistent navigation. Boxes labeled "list page" or "detail page" explain a sitemap, not the page design. A static screenshot collage loses the ability to inspect and revise the UI.
- Match the supplied reference's density, framing, and fidelity. When direction is open, derive it from the repo's design sources or explore a few relevant alternatives. Once direction is set, build it without another moodboard approval step.

## Build the artifact

Use an isolated scratch directory outside production source, following the project's convention or `<Project>-prototypes/<topic>-<date>/`. Keep later rounds in sibling directories, with a suffix for multiple rounds on the same date. Preserve approved pages and features in each new round.

For an HTML deliverable, copy [assets/canvas.html](assets/canvas.html) into the scratch directory. It contains the reference canvas UI and editable example pages. Replace the sample page interiors with the requested product UI. Adjust artboard dimensions, names, and grouping to the requested pages while retaining the canvas controls and their styling. Retain the reference names and positions when verifying the canvas shell against the supplied screenshot.

The canvas needs:

- All in-scope page artboards mounted together in an overview, with enough space between them to distinguish each page.
- Panning, zoom controls, a fit-all action, and a readable view of an individual page. Scale the canvas without squeezing desktop pages into mobile layouts.
- A page index that focuses the corresponding artboard. Use labeled connectors when the flow is ambiguous.
- The interactions needed to evaluate the design. A main action can focus its destination artboard; forms and state changes can use local mock data. Make the main path understandable without a backend.

The starter uses `data-go` on the Page 1 dropdown entries and in-page buttons to focus an artboard by ID. Add each page as an `.artboard` inside `#world`, with a `.page-label` and a `.screen` containing `.screen-inner`. Set `--frame-width` and `--frame-height` on each artboard. Keep page content in `.screen-inner`; the canvas handles navigation independently.

Prefer a self-contained HTML file that opens directly. Use a local server or a heavier stack only when the prototype needs it and the environment permits it. Do not add backend integration or production scaffolding to explain a layout.

## Verify and hand off

Open the artifact with an available browser or rendering tool. Check the overview and inspect each page at a readable scale. Exercise panning, zoom, fit-all, page-index navigation, and the main user path. Check for clipped content, overlapping artboards, and canvas gestures swallowing normal page interactions. If browser verification is unavailable, report that limitation explicitly.

For canvas UI changes, capture the initial view at the size and device scale in [references/canvas-baseline.json](references/canvas-baseline.json). Compare it with the unchanged reference using `uv run --with pillow python scripts/compare_canvas.py <actual.png> --output <comparison-dir> --approved-change remove-ask-claude`, with paths resolved from this skill. The comparison excludes the two page interiors and the explicitly approved toolbar change. Also check that the removed button and popover are absent and the remaining tools are centered. Keep the source image and original page exclusion rectangles fixed. Record any further user-approved exception by name and scope before comparing. Inspect the generated difference image and per-region report. Any nonzero difference outside those areas remains a failed pixel-exact check; report the residual instead of calling the result pixel-exact. Do not replace native canvas controls with screenshot slices or relax the comparison to make it pass.

Deliver the editable artifact and its path, with an overview image and useful page closeups when the environment supports them. Screenshots supplement the canvas. Name the pages, describe which interactions are mocked, and identify any open design decision. Recommend a direction when alternatives were requested.

When the user approves implementation, stop extending the prototype. Carry the chosen pages, states, and interactions into the project's implementation workflow, preserving any decisions/features record it already uses.
