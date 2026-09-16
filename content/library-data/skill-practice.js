window.PersonaLibraryDataFragments = window.PersonaLibraryDataFragments || {};
Object.assign(window.PersonaLibraryDataFragments, {
  skillPractice: {
    'skill-requirement-to-evidence-mapping': {
      operation: {
        loop:['Read the original career sources and the actual target brief.','Separate requirements, candidate claims, editorial synthesis, and unanswered questions.','Map each important requirement to a source passage and preserve the claim’s meaning.','Compare proposed wording with its source before passing it to the writer.','Revise the map when evidence changes and reopen affected reviews.'],
        inputs:['Source documents with links, headings, and modification dates','Target description with completeness and access status','Candidate goals, constraints, and intended reader'],
        decisions:['Which evidence demonstrates the requirement and which is only adjacent','Whether a claim is supported, ambiguous, contradicted, or missing','Which gaps prevent tailoring and which allow useful provisional work'],
        outputs:['Claim ledger: source ID, passage, actor/action, scope, outcome, metric meaning, dates/location, uncertainty, and approved wording','Requirement-to-claim map with unresolved gaps','A source-grounded context brief for this application'],
        feedback:['Compare each edited action, attribution, metric, and causal link with the original.','Ask whether a reader can distinguish personal contribution from team output.','Check that new sources change the affected draft and its review status.'],
        boundaries:'Source-supported means reported in the source, not independently verified. Generated drafts cannot establish career facts. An incomplete posting supports provisional calibration, not a claim of complete tailoring.'
      },
      quality:{signals:['Each material claim has an original source and a defined contribution.','Metrics retain their measure, scope, and uncertainty.','The role map identifies relevant proof without inventing missing experience.'],checks:['Trace one strong claim and one ambiguous claim from source to final wording.','Compare verbs such as designed/built and contributed/led; reject unsupported upgrades.','Inspect the target source’s completeness before accepting a tailored label.'],watchFor:['A previous generated draft becomes the factual authority.','Two resume versions are treated as independent corroboration.','A source citation is used as proof that the edit preserved meaning.']}
    },
    'skill-persuasive-professional-writing': {
      operation: {
        loop:['Name the reader’s decision and the candidate’s proposed positioning.','Select the evidence that answers that decision.','Write a small sample with concrete contribution, scope, and context.','Compare the sample with the source and a fresh reader’s interpretation.','Remove repetition and revise the weakest inference before expanding the document.'],
        inputs:['Reader and role brief','Traceable claims and candidate voice references','Current wording and unresolved evidence gaps'],
        decisions:['Which contribution differentiates this candidate for this reader','What problem, decision, or constraint the source actually establishes','Whether a sentence earns its place or repeats another section'],
        outputs:['A summary and selected role entries for an editorial trial','Evidence-led wording with change rationale','A list of missing context that would strengthen the story'],
        feedback:['Ask a fresh reader to state the fit and identify two supporting contributions.','Mark statements that could describe almost any candidate.','Compare the summary, capabilities, and cover letter for repeated information.'],
        boundaries:'Factual integrity and chronology are prerequisites. A metric alone does not demonstrate judgment; missing decision context must be requested or left unstated. Candidate approval cannot be simulated by a persona.'
      },
      quality:{signals:['Positioning is specific enough to explain why this experience fits this reader.','Accomplishments distinguish action, scope, and contribution without overstating causality.','The letter adds useful context and the opening avoids repeated keyword lists.'],checks:['Show a before/after passage and explain the reader benefit and preserved meaning.','Ask what creates doubt or requires explanation; revise that passage.','Test the summary and two entries before applying the approach to a full resume.'],watchFor:['Generic praise replaces evidence.','Compression removes the method or scope that made the claim credible.','A compliant or shorter document is declared persuasive without reader evidence.']}
    },
    'skill-voice-preservation-and-ethical-editing': {
      operation: {
        loop:['Identify the author’s meaning, voice, and factual authority.','Compare the source with the proposed edit at the claim level.','Improve clarity while preserving actor, action, attribution, and uncertainty.','Show consequential changes and resolve material ambiguity with the author.','Record the accepted wording and reopen dependent artifacts when meaning changes.'],
        inputs:['Original passages','Edited passages and reasons for changes','Author preferences and unresolved factual questions'],
        decisions:['Whether the edit changes meaning or only expression','Whether a stronger verb or causal connection is actually supported','Which ambiguity needs author input before the claim can be used'],
        outputs:['Source-to-edit comparison','Supported wording and explicitly withheld or qualified claims','Author-owned decisions and unresolved questions'],
        feedback:['Read the source and edit side by side for verbs, metrics, locations, scope, and relationships.','Ask the author whether the text represents their contribution and voice.','Check summaries and letters for contradictions after a correction.'],
        boundaries:'An editor or candidate persona does not approve facts on the real person’s behalf. Do not invent a compromise between conflicting claims or silently downgrade a reported outcome into a hypothetical opportunity.'
      },
      quality:{signals:['Edits are clearer while preserving the source’s factual meaning.','Personal and team achievements remain distinguishable.','Uncertainty is explicit and author decisions are recorded honestly.'],checks:['Inspect whether designed became built, member became founder, or a metric changed its meaning.','Check that savings attributed to a tool were not reassigned to an unrelated interview activity.','Confirm that approval refers to the actual author and the reviewed version.'],watchFor:['Confident prose conceals an unsupported upgrade.','The editor removes important context to sound concise.','Silence or a persona’s agreement is reported as candidate sign-off.']}
    },
    'skill-editorial-content-shaping': {
      operation: {
        loop:['Identify the document’s reader, purpose, and source authority.','Assign each section a distinct question to answer.','Select and shape evidence while preserving source meaning.','Review a small content sample before committing to the full layout.','Revise repetition, ambiguity, and missing context based on reading evidence.'],
        inputs:['Source-grounded brief and claim ledger','Author voice and intended reader','Current outline and document constraints'],
        decisions:['Which information belongs in the opening versus supporting detail','What can be shortened without losing method, scope, or meaning','Whether a missing detail requires evidence rather than an editorial invention'],
        outputs:['A content outline with a purpose for each section','Edited sample and source comparison','A content budget that identifies retained and condensed evidence'],
        feedback:['Compare the summary and skill list for conceptual duplication.','Ask a reader what contribution and progression they understand.','Inspect whether each removed phrase was redundant or carried necessary context.'],
        boundaries:'Document design does not determine career facts or target strategy by itself. Changes to attribution, metrics, and causality require source support and appropriate author review.'
      },
      quality:{signals:['Each section contributes something useful to the reader’s decision.','Shortening preserves the details that make an accomplishment credible.','The document distinguishes evidence, interpretation, and unresolved context.'],checks:['Show the source and edited passage with the reason for each meaningful change.','Remove a repeated opening claim and check whether any unique information was lost.','Test a short sample before propagating the editorial approach.'],watchFor:['Polished language erases the original contribution.','Multiple sections repeat the same positioning in different words.','Page count drives content selection before relevance is understood.']}
    },
    'skill-content-density-and-scanability-judgment': {
      operation: {
        loop:['Define what the reader needs to notice, compare, and trust.','Budget space by evidence importance and reading depth.','Compose with approved realistic content at readable sizes.','Inspect complete rendered pages and test the intended reading path.','Adjust emphasis, grouping, and page breaks based on observed effort.'],
        inputs:['Approved content and reader task','Target medium, page geometry, and output formats','Full rendered pages and reading feedback'],
        decisions:['Which evidence deserves space and what can be condensed','Whether an extra page supports useful content or only a fixed template','Which local density or blank areas create unnecessary reading effort'],
        outputs:['A justified page and content budget','Readable hierarchy across the whole document','Page-specific review findings and revisions'],
        feedback:['Ask a reader to identify fit, contribution, and progression without explanation.','Inspect normal-size and grayscale output, including continuation pages.','Compare layout options using identical approved content.'],
        boundaries:'Whitespace, a two-page target, a small font, or absence of tables is not a quality score. Select length from useful evidence and legibility; a layout comparison must not silently compare different claims.'
      },
      quality:{signals:['Relevant evidence is easy to find without stripping necessary detail.','Role, organization, dates, and outcomes have distinct visual jobs.','Page balance and density serve the content at normal reading size.'],checks:['Locate crowded local areas inside an otherwise sparse page.','Check repeated mastheads, long pipe-separated lists, decorative markers, and arbitrary page breaks.','Record what a reader found or misunderstood and which layout change addresses it.'],watchFor:['A new palette is described as a new information structure.','Shortening and whitespace are mistaken for editorial quality.','Only the source editor is inspected, or simulated reading is reported as real feedback.']}
    },
    'skill-interface-hierarchy-and-visual-communication': {
      operation: {
        loop:['Notice what people need to notice and act on.','Frame the hierarchy against user consequence, content, and context.','Apply grouping, typography, spacing, contrast, scale, and position.','Check the result with realistic content, states, devices, and input modes.','Adjust when the visual, semantic, or interaction order does not match the intended task.'],
        inputs:['User goal and consequence','Content, states, and interaction priorities','Responsive, accessibility, and product constraints'],
        decisions:['What deserves prominence and what can recede','How information should be grouped and sequenced','Which tradeoffs preserve clarity when constraints compete'],
        outputs:['A clear visual and semantic hierarchy','An interface whose primary action is legible','Documented rationale for important emphasis and tradeoffs'],
        feedback:['Ask someone what they noticed first and what they would do next.','Compare visual, semantic, keyboard, responsive, and state-based order.','Test long content, narrow screens, zoom, and interrupted paths.'],
        boundaries:'It does not decide the product strategy or user priority on its own; it translates an agreed intent into an understandable, usable interface.'
      },
      quality:{signals:['The primary action is apparent without explanation.','Visual emphasis reflects user consequence, not personal taste.','The hierarchy remains clear on mobile and at different content lengths.','Semantic structure, keyboard order, and visual order agree.','Secondary information is available without competing with the main task.','The designer can explain the tradeoffs behind the composition.'],checks:['Ask a representative person to point to the next action and describe what they noticed first.','Compare the intended decision path with visual scanning, keyboard order, semantic structure, and responsive behavior.','Try realistic long, short, empty, error, and loading content across widths and zoom levels.'],watchFor:['Everything has equal emphasis or competing calls to action.','A polished composition hides state, content, accessibility, or recovery problems.','The rationale is only “it feels better” or relies on a reference without explaining the context.']}
    },
    'skill-document-information-architecture-and-reading-paths': {
      operation: {
        startsWith:'A document whose audience, purpose, or reading path is unclear.',
        loop:['Identify the audience, task, decision, and delivery medium.','Inventory and group source content by meaning rather than file order.','Establish headings, sequence, and levels of emphasis.','Test first scan and deeper retrieval with representative readers.','Adjust the structure when readers miss the intended signal.'],
        inputs:['Audience and task','Source content and constraints','Delivery medium and reading conditions'],
        decisions:['What the reader must understand or do first','Which content belongs together or should recede','Where ambiguity or missing evidence must remain visible'],
        outputs:['A usable outline and heading hierarchy','A documented reader path','A list of content risks and open questions'],
        feedback:['Ask a representative reader what they think the document is for.','Ask them to find the answer to the primary question without coaching.','Compare the intended reading path with actual scanning and retrieval.'],
        boundaries:'It does not invent missing subject-matter knowledge or decide the document’s policy; it makes the intended content easier to find and use.'
      },
      quality:{signals:['The reader can explain the document’s purpose and where to begin.','Headings and grouping reflect the reader’s task rather than the source file’s history.','Important evidence is findable without flattening useful depth.'],checks:['Run a timed first-scan and a task-based findability check.','Give the outline to someone outside the authoring group and ask them to predict the structure.'],watchFor:['The source order is preserved even when it does not support the reader.','A polished layout compensates for missing hierarchy or unclear content.']}
    },
    'skill-typography-grid-and-page-composition': {
      operation: {
        startsWith:'A document needs a visual system that supports legibility, tone, hierarchy, and repeatable production.',
        loop:['Name the reading conditions, content density, and tone the document must support.','Choose type, grid, spacing, and emphasis rules that serve those conditions.','Apply the system to representative pages and content lengths.','Inspect rhythm, contrast, page turns, and hierarchy in the rendered output.','Adjust the system before making local exceptions.'],
        inputs:['Reading task and audience','Content density and page constraints','Brand, medium, and accessibility requirements'],
        decisions:['What deserves visual emphasis','How much density the reading task can support','Which exceptions are necessary and which indicate a weak system'],
        outputs:['A coherent typographic and compositional system','Reusable page and paragraph rules','A rationale for important visual tradeoffs'],
        feedback:['Compare short, long, empty, and dense content in the same system.','Ask readers what they noticed first and whether the tone fits the context.','Inspect the rendered document at normal size, zoom, and print or viewport conditions.'],
        boundaries:'It does not choose visual style from taste alone or replace editorial judgment; it translates the reading task into a usable visual system.'
      },
      quality:{signals:['Visual emphasis supports the document’s purpose and audience.','Typography and spacing remain legible across realistic content and output conditions.','Repeated structures feel coherent without making meaningful differences disappear.'],checks:['Review representative pages side by side at normal reading size.','Test the longest headings, densest tables, and most important callouts.'],watchFor:['Decoration competes with evidence or makes the document feel more certain than it is.','Local page fixes accumulate because the underlying system is not doing enough work.']}
    },
    'skill-accessible-document-structure-and-export': {
      operation: {
        startsWith:'A document is being shared or exported and visual treatment may have obscured structure, contrast, order, or navigation.',
        loop:['Identify the delivery format, audience, assistive needs, and consequential tasks.','Inspect headings, reading order, links, tables, contrast, zoom, and text alternatives as relevant.','Run available automated checks and separate their results from human review.','Test the most consequential task with keyboard, assistive technology, or representative scenarios.','Record verified issues, untested areas, and the next safe correction.'],
        inputs:['Source and output formats','Document structure and delivery context','Accessibility requirements and available checks'],
        decisions:['Which accessibility risks are consequential in this document','What can be verified automatically and what needs human review','Whether a limitation requires correction, disclosure, or a different format'],
        outputs:['A structured and navigable document','An accessibility review with evidence','A clear record of untested conditions and remaining constraints'],
        feedback:['Check the document with zoom, keyboard, contrast, and assistive technology where available.','Compare visual order with structural and reading order.','Ask whether the primary task remains understandable and actionable.'],
        boundaries:'It does not claim conformance from an automated scan alone; it combines standards, manual inspection, and context-appropriate human evaluation.'
      },
      quality:{signals:['Headings, links, tables, and reading order remain meaningful in the delivered format.','The document is perceivable, operable, understandable, and robust for its intended context.','Known limitations and untested conditions are visible rather than implied away.'],checks:['Run the relevant automated and manual checks for the format.','Test the primary task in the delivery context, including zoom or alternate input when relevant.'],watchFor:['The source document is accessible while the export is not.','Passing a checker is treated as proof that people can complete the task.']}
    },
    'skill-cross-format-production-and-fidelity-qa': {
      operation: {
        startsWith:'A document must move from source to delivered format without losing meaning, structure, layout, or links.',
        loop:['Define the delivery contract and the source of truth.','Render the document into each required output format.','Inspect every page or view for content, hierarchy, breaks, links, and density.','Compare source and output to locate changes introduced by production.','Record defects by reader impact and verify the correction.'],
        inputs:['Source document and revision','Required output formats and environments','Representative content and fidelity criteria'],
        decisions:['Which output differences affect reader value','What needs correction before delivery','Which known limitations can be accepted and documented'],
        outputs:['Verified delivery formats','A source-to-output comparison','A prioritized fidelity and correction record'],
        feedback:['Inspect the rendered output rather than relying on the authoring view.','Compare page flow, links, headings, tables, and content against the source.','Re-render after correction and check the affected outputs again.'],
        boundaries:'It does not determine whether the content is strategically correct or factually true; it verifies that the approved content survives production and delivery.'
      },
      quality:{signals:['Delivered outputs preserve the approved content and intended reading path.','Defects are prioritized by reader consequence, not only visual difference.','Corrections are verified in the format and environment where the issue occurred.'],checks:['Render all required outputs and inspect each page or view.','Use representative edge cases such as long headings, tables, links, and page breaks.'],watchFor:['The source view is treated as proof of export quality.','A visual match hides missing content, broken links, or inaccessible structure.']}
    },
    'skill-divergent-concept-generation': {
      operation: {
        startsWith:'A creative brief has unresolved strategic choices or the first plausible idea is becoming the answer too early.',
        loop:['State the decision, audience promise, constraints, and assumptions.','Generate directions that differ in concept, audience promise, or consequence.','Describe the rationale and boundary behind each direction.','Compare the options using the same representative content and constraints.','Choose the next test or convergence condition.'],
        inputs:['Creative brief and decision owner','Audience or user evidence','Constraints, reference material, and quality signals'],
        decisions:['What counts as a meaningful difference','Which assumptions each direction makes','What evidence or experiment can distinguish the options'],
        outputs:['A set of distinct directions','Rationale and assumptions for each direction','A bounded next test or decision'],
        feedback:['Ask an uninvolved collaborator to explain how the directions differ.','Compare options with identical representative content and constraints.','Check that convergence follows a stated decision frame.'],
        boundaries:'It creates and compares options; it does not select the final direction without the decision owner and relevant evidence.'
      },
      quality:{signals:['Directions differ in concept, audience promise, or consequence rather than only surface treatment.','Each direction has a visible rationale, assumption, and boundary.','The comparison leaves a clear next test or decision.'],checks:['Use an uninvolved reviewer to describe the meaningful differences.','Check each option against the same brief and realistic content.'],watchFor:['The first idea is relabeled as the baseline.','Novelty or mood is treated as strategic difference.','The panel generates options without recording what would make one useful.']}
    },
    'skill-creative-critique-and-quality-calibration': {
      operation: {
        startsWith:'Creative feedback is vague, personal, inconsistent, or disconnected from the brief and audience consequence.',
        loop:['State the brief, audience, constraints, and quality criteria.','Collect observations separately from recommendations.','Connect high-priority feedback to consequence, evidence, or a stated criterion.','Compare lenses and preserve disagreement that affects the decision.','Prioritize a revision, decision, or next test.'],
        inputs:['Creative work or prototype','Brief, audience, and quality criteria','Distinct reviewer perspectives and relevant evidence'],
        decisions:['Which comments describe a consequence rather than a preference','Which disagreement is material to the decision','What change or test would resolve the highest-risk issue'],
        outputs:['An evidence-linked critique','A prioritized revision or decision list','Visible disagreement and open questions'],
        feedback:['Remove names from critique notes and check whether the reasoning still stands.','Ask which audience, evidence, or constraint supports each priority.','Compare the original and revised work for the stated consequence.'],
        boundaries:'It calibrates and prioritizes critique; it does not turn consensus, seniority, or personal taste into proof of quality.'
      },
      quality:{signals:['Feedback names a consequence or criterion instead of only a reaction.','Different quality lenses remain visible without one voice dominating.','The resulting priority changes the work, confidence, or next test.'],checks:['Ask reviewers to tie important comments to the brief or audience.','Inspect whether the revision addresses the stated consequence.'],watchFor:['Consensus is treated as proof.','A senior or articulate participant becomes the quality standard by default.','A polished surface hides an unresolved audience or feasibility problem.']}
    },
    'skill-narrative-synthesis-and-concept-articulation': {
      operation: {
        startsWith:'A panel has strong but scattered contributions and the team needs one direction that can travel into the next stage of work.',
        loop:['Separate shared signal, role-specific insight, disagreement, and open question.','Name the selected concept and the audience promise it makes.','Write the governing principles, rationale, constraints, and evidence.','Translate the direction into examples or a prototype.','Hand off the next test, owner, and revisit condition.'],
        inputs:['Panel contributions and critique record','Brief, audience, constraints, and decision rights','Evidence, examples, and implementation context'],
        decisions:['What is genuinely shared and what remains role-specific','Which tradeoffs define the selected direction','What the next team needs to act without guessing'],
        outputs:['A coherent creative direction','Rationale and governing principles','A handoff brief with next test and owner'],
        feedback:['Ask a partner outside the panel to explain the direction and rationale.','Compare the handoff with the original brief and critique record.','Check that unresolved questions remain visible.'],
        boundaries:'It makes a direction legible and actionable; it does not erase disagreement or invent evidence to make the story cleaner.'
      },
      quality:{signals:['A reader can explain the concept, audience promise, rationale, and next move.','Examples express the governing principles rather than only decorating the page.','Open questions and tradeoffs remain visible.'],checks:['Run a handoff comprehension check with someone outside the panel.','Trace each major claim back to a contribution, constraint, or evidence source.'],watchFor:['Synthesis becomes generic language that could describe any concept.','Disagreement is hidden to make the narrative feel decisive.','Examples are mistaken for a complete system.']}
    }
  }
});
