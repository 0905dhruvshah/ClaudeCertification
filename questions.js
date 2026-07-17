const QUESTIONS = [
  {
    "question": "After the web search agent and document analysis agent complete their\ntasks, the coordinator invokes the synthesis agent. However, the synthesis\nagent responds that it cannot complete the task because no research findings\nwere provided. What is the most likely cause of this issue?",
    "options": {
      "A": "The synthesis agent needs tools that can fetch results directly from the other agents' conversation\nhistories.",
      "B": "The synthesis agent's context window is not large enough to hold the combined outputs from both\nprevious agents.",
      "C": "The subagents need to share a single API connection to enable automatic context sharing between\ninvocations.",
      "D": "The coordinator did not include the outputs from the previous agents in the synthesis agent's\nprompt."
    },
    "answer": "D",
    "justification": "The synthesis agent can only act on the information provided in its prompt. If prior outputs are not\npassed, it will report missing research findings."
  },
  {
    "question": "When researching \"renewable energy adoption,\" the web search agent\nreturns recent statistics (2024: 35% adoption) while the document analysis\nagent extracts data from internal reports (2022: 18% adoption). The synthesis\nagent incorrectly flags these as contradictory sources rather than recognizing\nthe data shows growth over time. What change would best enable the\nsynthesis agent to correctly interpret such temporal differences?",
    "options": {
      "A": "Require subagents to include publication or data collection dates in their structured outputs.",
      "B": "Instruct the synthesis agent to always treat the most recent data as authoritative and place older\nfindings in a separate historical appendix.",
      "C": "Add a conflict resolution agent that automatically discards older data when newer data exists for the\nsame metric.",
      "D": "Configure the web search agent to only return results from the past 6 months."
    },
    "answer": "A",
    "justification": "Providing timestamps allows the synthesis agent to understand that the figures refer to different points\nin time, enabling it to interpret the data as a trend (growth) rather than a contradiction."
  },
  {
    "question": "Users report that final reports sometimes lack depth on specific subtopics.\nInvestigation shows that the document analysis agent frequently identifies\ngaps—for instance, noting \"the retrieved sources discuss API authentication\nbut lack details on token refresh patterns\"—but under the current strict\npipeline, this insight isn't actionable since search has already completed.\nWhat is the most effective architectural change?",
    "options": {
      "A": "Have the analysis agent report specific gaps to the coordinator, which triggers targeted\nsearches and re-invokes analysis until sufficient.",
      "B": "Add a research planning agent before the search phase that decomposes topics into specific\nsub-questions.",
      "C": "Have the synthesis agent attach confidence scores to each section and flag areas with insufficient\ncoverage for manual review.",
      "D": "Have the coordinator review analysis output for gap indicators and re-invoke search with\ngap-informed queries when gaps are detected."
    },
    "answer": "A",
    "justification": "This introduces a dynamic, agentic loop (reflection pattern) into the workflow. The document analysis\nagent is the expert that identifies exactly what is missing, and by reporting gaps to the coordinator, the\ncoordinator can route the workflow back to search with a targeted query, then re-invoke analysis to close the\nloop."
  },
  {
    "question": "Your multi-agent research pipeline crashed after processing 12 of 28\ndocuments. The web search agent had identified relevant sources, the\ndocument analyzer had partially complete results, and the synthesizer had\nbegun pattern identification. You need to resume processing without\nrepeating work or losing fidelity of prior findings. What state management\napproach best balances information fidelity with context efficiency when\nrestoring agent state?",
    "options": {
      "A": "Have each agent persist a structured export to a known location. On resume, the coordinator\nloads the manifest and injects relevant state into agent prompts.",
      "B": "Persist the coordinator's conversation log containing all task delegations and responses, providing\nthis to agents when resuming.",
      "C": "Have each agent maintain its own persistent state file and reload it independently at the start of each\nsession.",
      "D": "Index all agent outputs in a shared vector store. When resuming, each agent queries the store using\nsemantic search to retrieve relevant prior findings."
    },
    "answer": "A",
    "justification": "This provides high information fidelity (structured, complete outputs) while maintaining context\nefficiency (only relevant pieces are re-injected into prompts). The coordinator remains in control of what each\nagent needs, avoiding unnecessary bloat and duplication."
  },
  {
    "question": "The synthesis agent completes its initial pass but flags that three key\nresearch questions remain unanswered because the web search and\ndocument analysis agents didn't find relevant information on those specific\nsubtopics. The coordinator currently proceeds directly to report generation,\nproducing reports with incomplete coverage. What change would most\neffectively improve research completeness?",
    "options": {
      "A": "Have the coordinator evaluate synthesis output for gaps, then re-delegate to web search and\ndocument analysis with targeted queries before invoking synthesis again.",
      "B": "Increase the initial breadth of queries sent to web search and document analysis to reduce the\nprobability of missing relevant information.",
      "C": "Have the report generation agent note which research questions couldn't be answered, so users\nunderstand the limitations of the final output.",
      "D": "Give the synthesis agent direct access to web search tools so it can autonomously fill knowledge\ngaps without returning control to the coordinator."
    },
    "answer": "A",
    "justification": "This introduces an iterative feedback loop, where identified gaps are actively addressed. The\ncoordinator maintains control and ensures completeness before final report generation."
  },
  {
    "question": "When analyzing complex legal cases that cite multiple precedents, the\ndocument analysis subagent processes each sequentially. A landmark case\nciting 12 precedents takes over 3 minutes to analyze completely. What's the\nmost effective way to reduce this latency while preserving the coordinator's\nability to monitor and debug the system?",
    "options": {
      "A": "Enable the document analysis subagent to spawn its own specialized subagents dynamically when it\nencounters cases with many citations.",
      "B": "Implement a message queue where precedent analysis tasks are processed asynchronously by a\npool of worker agents.",
      "C": "Create a recursive agent hierarchy where analysis agents subdivide work among child agents until\nreaching single-precedent granularity.",
      "D": "Have the coordinator spawn parallel document analysis subagents, each handling a subset of\nprecedents, then aggregate results before synthesis."
    },
    "answer": "D",
    "justification": "This enables parallel processing to reduce latency while keeping orchestration centralized. The\ncoordinator retains full visibility, making monitoring and debugging easier."
  },
  {
    "question": "Introduction monitoring shows the research phase takes longer than\nexpected. Analysis reveals the coordinator invokes the web search subagent,\nwaits for its response, then invokes the document analysis subagent and\nwaits again. These tasks are independent - neither requires the other's output.\nHow should you modify the system to run these subagents concurrently?",
    "options": {
      "A": "Switch both subagents to use a Haiku tier model instead to reduce their individual execution time.",
      "B": "Create an async orchestration layer outside the agent that spawns parallel threads, each running a\nseparate coordinator subagent pair, then aggregates results.",
      "C": "Add detailed instructions to the coordinator's system prompt explaining the performance benefits of\nparallel execution and requesting it invoke both subagents at the same time.",
      "D": "Structure the coordinator to emit both Task tool calls (for web search and document analysis)\nin a single response message rather than across separate conversation turns."
    },
    "answer": "D",
    "justification": "Issuing both tool calls in one response enables true parallel execution, since the system can run them\nconcurrently instead of waiting for one to finish before starting the other."
  },
  {
    "question": "Production reviews reveal inconsistent handling of uncertainty in final\nreports. Sometimes conflicting subagent findings are synthesized into a\nsingle confident statement, other times reports over-hedge with excessive\nqualifications (becoming unhelpful). When the web search agent returns\n\"Industry analysts estimate $50B market size\" and the document analysis\nagent returns \"peer-reviewed study estimates $35B (95% CI),\" the coordinator\neither picks one arbitrarily or produces vague statements like \"the market is\n$35B-$50B depending on factors.\" What systematic approach best addresses\nthis?",
    "options": {
      "A": "Configure subagents to only report findings meeting a high confidence threshold, filtering uncertain\ninformation before it reaches the coordinator.",
      "B": "Add a verification subagent that cross-references findings across sources, only passing claims to\nsynthesis that are corroborated by at least two independent sources.",
      "C": "Instruct the synthesis agent to structure reports with explicit sections distinguishing\nwell-established findings from contested ones, preserving original source characterization and\nmethodological context.",
      "D": "Implement a confidence calibration layer that normalizes subagent uncertainty expressions to\nstandardized probability scores (0.0-1.0), then weight-average findings by their calculated reliability scores\nto produce a statistically grounded synthesis."
    },
    "answer": "C",
    "justification": "This directly addresses inconsistent handling of uncertainty by making it explicit and structured,\nallowing users to understand both consensus and disagreement without losing context."
  },
  {
    "question": "In production, you observe that simple fact-checking queries (e.g., \"What year\nwas the Paris Climate Agreement signed?\") traverse all four subagents\nsequentially, consuming 40+ seconds. While this might be acceptable for\ncomplex comparative research, simple queries don't benefit from the full\npipeline. Your query distribution is diverse and evolving as users discover\nnew applications. What's the most effective approach to optimize for varying\nquery complexity?",
    "options": {
      "A": "Implement pattern-based routing that categorizes queries by structure (single-fact vs. comparative\nvs. analytical) and maps each category to a predefined subagent combination.",
      "B": "Train a query complexity classifier on labeled historical data to predict optimal subagent\ncombinations, retraining periodically as query patterns evolve.",
      "C": "Have the coordinator analyze each query and dynamically decide which subagents to invoke\nbased on its assessment of query requirements.",
      "D": "Create a fast-path for factual questions that bypasses subagents entirely, routing all other queries\nthrough the complete pipeline to ensure research thoroughness."
    },
    "answer": "C",
    "justification": "This provides flexible, real-time routing without rigid rules or heavy ML infrastructure. The coordinator\ncan tailor execution paths to query complexity efficiently."
  },
  {
    "question": "A user is expanding the research system beyond its single web search agent\nby adding specialized data sources: a financial API agent that returns\nstructured JSON with margins and growth rates; a news monitoring agent\nthat returns prose summaries of recent developments; and a patent analysis\nagent that returns structured lists of technology filings. The synthesis agent\ncombines these into executive briefings. Currently, it converts everything to\nbullet points, causing financial comparisons to lose tabular clarity and news\nsummaries to lose narrative flow. What change would most improve briefing\nquality?",
    "options": {
      "A": "Update the synthesis agent to render each content type appropriately—financial data as\ntables, news as prose, and technical lists as structured points.",
      "B": "Add a format conversion layer between subagents and synthesis that transforms all outputs to a\ncommon intermediate representation (such as Markdown) to facilitate more flexible rendering.",
      "C": "Standardize all subagent outputs to JSON with fields for every data type to ensure programmatic\nconsistency across the pipeline.",
      "D": "Standardize all subagent outputs to prose summaries with a uniform character to maintain a\nconsistent executive voice regardless of the source material."
    },
    "answer": "A",
    "justification": "This preserves the natural structure and strengths of each data type, improving clarity, readability, and\nusefulness of the final briefing."
  },
  {
    "question": "The coordinator agent has AgentDefinitions configured for all four specialized\nsubagents, each with appropriate descriptions, prompts, and tool restrictions.\nDuring testing, you notice the coordinator correctly reasons about when to\ndelegate—it generates messages like \"I'll ask the web search agent to find\nsources on this topic\"—but no subagent execution ever occurs. The\ncoordinator then proceeds as if the delegation happened and continues with\nincomplete information. Logs show no errors. What is the most likely cause?",
    "options": {
      "A": "Subagent context isolation means task descriptions from the coordinator don't automatically reach\nsubagents; you need to configure explicit context forwarding in Claude AgentOptions.",
      "B": "The coordinator's max_tokens setting is too low, causing the Task tool invocation to be truncated\nbefore the subagent type parameter can be specified.",
      "C": "The coordinator's allowedTools configuration doesn't include \"Task\", so while it can reason\nabout delegation, it cannot invoke the tool required to spawn subagents.",
      "D": "The AgentDefinitions are configured correctly, but the coordinator's system prompt doesn't explicitly\nlist the available subagent types, preventing the model from knowing they can be invoked."
    },
    "answer": "C",
    "justification": "The coordinator can plan and describe delegation, but without the Task tool enabled, it cannot\nactually execute subagent calls—resulting in no errors but no execution."
  },
  {
    "question": "In production, final reports frequently contain claims without proper source\nattribution. Investigation shows that while the web search and document\nanalysis agents correctly attach citations to their outputs, the synthesis agent\nloses track of which sources support which conclusions when combining\nfindings. What's the most effective architectural change?",
    "options": {
      "A": "Add a verification step where the report generator uses semantic similarity matching against original\nsources to reconstruct which claims came from which documents.",
      "B": "Have the coordinator inject source identifier prefixes into text before each handoff, then parse these\nprefixes at report generation to reconstruct citations.",
      "C": "Maintain complete transcripts of all subagent interactions and add a citation-resolution agent to\nanalyze logs and determine attributions before report generation.",
      "D": "Require all subagents to output structured claim-source mappings that the synthesis agent\nmust preserve and merge when combining findings from multiple sources."
    },
    "answer": "D",
    "justification": "This ensures end-to-end attribution fidelity by keeping claim-to-source relationships explicit and\nstructured throughout the pipeline, preventing loss during synthesis."
  },
  {
    "question": "After the web search and document analysis subagents complete their tasks,\nthe coordinator needs to spawn the synthesis subagent to synthesize the\nfindings. What is the correct approach for providing the synthesis subagent\nwith the information it needs?",
    "options": {
      "A": "Provide the subagent with tool definitions that allow it to request outputs from other subagents via\ncallbacks.",
      "B": "Include the complete findings from both subagents directly in the synthesis subagent's prompt.",
      "C": "Pass reference identifiers and configure the subagent with read access to a shared memory\nstore where other subagents deposited their results.",
      "D": "Spawn the subagent with only a brief task description, relying on automatic context inheritance from\nthe coordinator."
    },
    "answer": "C",
    "justification": "This is the most scalable and production-ready approach. It preserves information fidelity while\navoiding context bloat, allowing the synthesis agent to retrieve exactly what it needs."
  },
  {
    "question": "The web search agent has gathered several relevant sources for a research\ntopic. The document analysis agent now needs to examine these sources.\nHow does information flow between these two specialized subagents?",
    "options": {
      "A": "The coordinator agent receives the web search agent's output and includes relevant findings\nin the prompt when invoking the document analysis agent.",
      "B": "The agents communicate through an event-driven message queue, with the document analysis\nagent subscribing to web search completion events.",
      "C": "The web search agent directly invokes the document analysis agent, using the discovered sources\nas parameters.",
      "D": "Both agents access a shared memory store where the web search agent writes findings and the\ndocument analysis agent reads them."
    },
    "answer": "A",
    "justification": "This follows the standard orchestration pattern where the coordinator manages all data flow, explicitly\npassing outputs between subagents."
  },
  {
    "question": "After the web search agent finds 25 sources (120K tokens of raw content), the\ndocument analysis agent extracts key insights (15K tokens), and the\nsynthesis agent produces a coherent narrative draft (3K tokens), the\ncoordinator must pass context to the report generation agent for the final\noutput with proper source citations. What context-passing strategy provides\nthe best balance of completeness and efficiency?",
    "options": {
      "A": "Pass only the synthesis draft and have a separate post-processing pipeline match claims to sources\nand insert citations after the report is generated.",
      "B": "Pass the full accumulated context from all prior agents.",
      "C": "Pass the synthesis draft along with a structured source index that maps key claims to their\nsource URLs and relevant excerpts.",
      "D": "Pass a condensed summary of all prior stages that preserves the main findings and attributes them\nto sources by name only."
    },
    "answer": "C",
    "justification": "This provides the best balance of completeness and efficiency—retaining precise attribution while\nkeeping context size manageable."
  },
  {
    "question": "Your search products tool queries an external catalog API that returns\npaginated results (50 items per request). Production logs show queries\nfrequently match 200+ products, and the design that auto-fetches all pages\ncauses 15-20 second delays. How should you redesign the pagination\nhandling?",
    "options": {
      "A": "Create separate 'search products' and 'fetch more results' tools for pagination.",
      "B": "Implement server-side relevance ranking and return only the top 50 most relevant items.",
      "C": "Add a max pages parameter (default: 2) that controls how many pages are fetched internally.",
      "D": "Return the first page with total match count and cursor for additional pages."
    },
    "answer": "D",
    "justification": "This enables lazy loading and explicit control, allowing the agent to fetch more results only when\nneeded—balancing performance and completeness."
  },
  {
    "question": "Your search Flights tool calls an external airline API that occasionally returns\na 503 Service Unavailable error. What is the most effective way to handle this\nerror in your tool implementation?",
    "options": {
      "A": "Return an empty flight list as if the search succeeded but found no matching flights.",
      "B": "Log the error internally and return an empty response, letting the model continue without the flight\ndata.",
      "C": "Return an error message in the tool result explaining the service is temporarily unavailable.",
      "D": "Automatically retry the request up to five times with exponential backoff before returning\nresults to the agent."
    },
    "answer": "D",
    "justification": "This is the most effective approach—handles transient failures gracefully, improves reliability, and\nonly surfaces errors if retries fail."
  },
  {
    "question": "Your MCP server implements a check_availability tool that queries an external\ncalendar API. During testing, you encounter three error conditions: (1) the\ntool is called with a malformed request, missing the required user_email\nparameter; (2) the calendar API returns a 404 because the specified user\ndoesn't exist in the calendar system; (3) the calendar API returns a 503\nbecause the service is temporarily unavailable. How should each error be\nreported according to MCP's error handling design?",
    "options": {
      "A": "Report all three as tool results with isError: true.",
      "B": "Report errors 1 and 2 as JSON-RPC protocol errors, report error 3 as a tool result with isError: true.",
      "C": "Report error 1 as a JSON-RPC protocol error, report errors 2 and 3 as tool results with isError:\ntrue.",
      "D": "Report all three as JSON-RPC protocol errors."
    },
    "answer": "C",
    "justification": "Error 1 (malformed request) is a JSON-RPC protocol error (invalid input). Error 2 (user not found) is a\ntool result with isError: true (valid execution, meaningful failure). Error 3 (service unavailable) is a tool result with\nisError: true (transient external failure)."
  },
  {
    "question": "Your documents (query) tool returns results as \"Found 3 documents: Q2\nBudget Proposal, Q2 Budget Forecast, Annual Review\". You want the agent to\nreliably reference and act on specific documents across multi-step workflows.\nWhat return format would best enable these multi-step workflows?",
    "options": {
      "A": "URLs that users can click to open the document in their browser.",
      "B": "Structured data containing document IDs and metadata for each result.",
      "C": "A JSON array of document titles extracted from the search results.",
      "D": "More detailed human-readable descriptions including the size and authors."
    },
    "answer": "B",
    "justification": "This enables the agent to programmatically reference specific documents (via IDs) across multiple\nsteps, making workflows like follow-up queries or document retrieval precise and reliable."
  },
  {
    "question": "Your agent has access to 50+ specialized API connectors for different\nexternal services. As the connector library grew, tool selection accuracy\ndropped to 58%. You design a search_connectors(description) tool that finds\nmatching connectors, but in testing agents frequently skip searching and call\nconnectors directly (often incorrectly), or select wrong connectors from the\nfiltered results. How should you design the tool composition pattern to\naddress both issues?",
    "options": {
      "A": "Design connectors with built-in compatibility validation that return descriptive errors for mismatched\nrequests.",
      "B": "Design a find_and_execute(description, params) composite tool that searches and immediately\nexecutes the best matching connector.",
      "C": "Enhance all connector descriptions with detailed usage samples, edge cases, and input\nrequirements. Add few-shot examples showing the correct search-then-use workflow.",
      "D": "Design search_connectors to dynamically add matched connectors to the agent's available\ntools. Connectors start unavailable and persist once discovered."
    },
    "answer": "D",
    "justification": "This enforces the search-first pattern by limiting available tools initially and reducing the decision\nspace, improving both discovery and correct selection."
  },
  {
    "question": "Your publish article tool calls an external CMS API that occasionally returns\ntransient errors (network timeouts, 503s) and non-transient errors (403\npermission denied, 422 validation failure). Currently, every error is returned\ndirectly to the agent, which leads to the agent retrying non-transient errors\nand wasting turns on failures that will never succeed. How should you\npartition error-handling responsibility between the tool implementation and\nthe agent?",
    "options": {
      "A": "Handle all errors inside the tool: Implement retries with exponential backoff for every error type, and\nonly surface a failure to the agent after a fixed number of retry attempts have been exhausted.",
      "B": "Handle transient errors (timeouts, 503s) with automatic retries inside the tool implementation,\nand surface non-transient errors (permission denied, validation failures) to the agent with\ndescriptive messages so it can take corrective action.",
      "C": "Surface all errors to the agent immediately with detailed context, and let the agent decide which\nerrors to retry and how many times, keeping the tool implementation stateless and simple.",
      "D": "Implement a universal error handler that catches all exceptions and returns a generic\ntool-unavailable message, shielding the agent from error complexity."
    },
    "answer": "B",
    "justification": "This cleanly separates responsibility: the tool handles recoverable/transient issues automatically,\nwhile the agent receives actionable errors it can fix (permissions, input validation)."
  },
  {
    "question": "Your remove_team_member tool uses a dry_run boolean parameter for\npreviewing impacts before execution. Production monitoring shows the agent\nbypasses the preview step in 15% of calls by calling with dry_run=false\ndirectly. You need to ensure every removal is preceded by a preview that the\nuser explicitly confirms. What is the most reliable approach?",
    "options": {
      "A": "Add server-side validation that permits dry_run=false only when a dry_run=true call with identical\nparameters occurred within the past 60 seconds.",
      "B": "Replace with two tools: preview_remove_member returns impact details and a single-use\nconfirmation token; execute_remove_member requires that token, binding execution to the\nspecific previewed action.",
      "C": "Annotate the tool as requiring confirmation and configure the orchestration layer to prompt the user\nfor approval before forwarding any calls to annotated tools.",
      "D": "Add detailed instructions and few-shot examples to the tool description requiring the agent to always\ncall with dry_run=true first and wait for user confirmation before calling with dry_run=false."
    },
    "answer": "B",
    "justification": "This enforces the correct workflow at the system level by requiring a valid preview step and tying\nexecution to an explicit confirmation, making bypass impossible."
  },
  {
    "question": "Your expense reimbursement agent processes employee requests using a\nprocess_reimbursement tool. Company policy requires that reimbursements\nabove $500 must be approved before funds are disbursed. The agent handles\nhundreds of requests daily, and you need the threshold enforcement to be\ntamper-proof regardless of how the agent is prompted. What ensures the $500\napproval threshold cannot be bypassed?",
    "options": {
      "A": "The process_reimbursement tool accepts an approved_by_manager parameter. The system prompt\ninstructs the agent to only set this to true after confirming that a manager approved the request. A nightly\naudit script reviews all reimbursements where approved_by_manager was set to true.",
      "B": "Provide two tools: auto_reimburse (hard-coded limit of $500) and manager_approval. Include\ndetailed system prompt instructions telling the agent to check the amount and use the appropriate tool.\nAdd a PostToolUse hook that logs which tool was called for auditing.",
      "C": "The process_reimbursement tool accepts amount and details, and internally enforces the\nthreshold; amounts under $500 are auto-disbursed and the tool returns a success confirmation.\nAmounts over $500 cause the tool to create a pending approval request and return a status\nindicating manager review is pending.",
      "D": "Implement the threshold check in a PreToolUse hook that inspects the amount parameter before\nprocess_reimbursement executes. If the amount exceeds $500, the hook modifies the context to add a\nrequires_approval flag, which the tool checks before disbursing."
    },
    "answer": "C",
    "justification": "This enforces the rule inside the tool itself, making it impossible to bypass regardless of how the agent\nis prompted."
  },
  {
    "question": "Your order management system requires tools for three distinct operations:\nissuing refunds (requires amount and reason), canceling orders (requires\nreason), and reshipping orders (requires shipping address). Each operation\nshares an order_id parameter but has different additional requirements. You\nnotice during testing that with your current unified tool design, the agent\nfrequently omits required parameters or includes irrelevant ones. What\ndesign change will most effectively improve parameter accuracy?",
    "options": {
      "A": "Split into three separate tools (e.g., issue_refund, cancel_order, reship_order), each defining\nonly the parameters required for that specific operation.",
      "B": "Keep one unified tool with all parameters marked optional, but add few-shot examples in the system\nprompt showing correct parameter combinations for each operation.",
      "C": "Keep one unified tool but add JSON Schema if-then-else conditionals to enforce that parameters like\namount are required only when the operation type is refund.",
      "D": "Keep one unified tool with a nested operation object parameter whose internal structure varies by\noperation type, documented in the tool description."
    },
    "answer": "A",
    "justification": "This reduces ambiguity and ensures the agent only sees relevant parameters per operation, leading\nto much higher accuracy."
  },
  {
    "question": "Your portfolio_value tool returns the total value of a user's investment\nportfolio. You're deciding between returning a structured JSON object with\nexplicit fields versus returning information as a formatted text string. What is\nthe primary advantage of using structured output with defined fields?",
    "options": {
      "A": "Structured JSON consumes significantly fewer tokens than natural language, substantially reducing\nAPI costs.",
      "B": "The agent can reliably extract specific values without parsing free-form text, reducing errors\nin subsequent operations.",
      "C": "Structured JSON is processed deterministically by the model, significantly improving accuracy when\nextracting values.",
      "D": "JSON schemas automatically validate that the underlying API returned correct data before the agent\nprocesses it."
    },
    "answer": "B",
    "justification": "Structured output provides clear, predictable fields, making it easy for the agent to use the data\naccurately in downstream steps."
  },
  {
    "question": "Your scheduling agent uses get_available_slots(date, provider_id) to retrieve\nopen appointment times, then book_appointment(provider_id, slot_time,\npatient_id) to reserve a slot. Tickets show that 15% of booking attempts fail\nwith a slot-no-longer-available error because another user booked the slot\nbetween the availability check and the booking call. How should you redesign\nthese tools?",
    "options": {
      "A": "Modify book_appointment to return detailed failure information including currently available\nalternative slots when the requested slot is unavailable, enabling the agent to retry with a different time.",
      "B": "Keep both tools but add retry logic to the agent's system prompt, instructing it to call\nget_available_slots again and select a different time if booking fails.",
      "C": "Add a hold_slot(provider_id, slot_time) tool that creates a 60 second temporary reservation, requiring\nthe agent to call it between checking availability and booking.",
      "D": "Combine both tools into a single find_and_book_appointment that atomically checks\navailability and books, returning either the confirmed booking or available alternatives."
    },
    "answer": "D",
    "justification": "This eliminates the race condition by making the operation atomic, ensuring consistency and\nreliability."
  },
  {
    "question": "Your agent has a log_workout tool that accepts exercise_type, value, and\nmeasurement. Production monitoring shows the agent frequently passes\nmismatched combinations, using reps for cardio exercises like running, or\nmiles for strength exercises like bench press. Your exercises naturally divide\ninto two categories: cardio (measured in time or distance) and strength\n(measured in reps and sets). 23% of tool calls have invalid combinations.\nWhat approach would most effectively reduce these errors?",
    "options": {
      "A": "Implement server-side validation returning descriptive errors for invalid combinations, allowing the\nagent to retry with corrections.",
      "B": "Add enum constraints on measurement limiting values to minutes, miles, reps, or sets to prevent\narbitrary measurement strings.",
      "C": "Add explicit examples to the tool description showing valid combinations for each exercise category.",
      "D": "Split into log_cardio_workout (with duration_minutes or distance_miles parameters) and\nlog_strength_workout (with reps and sets parameters)."
    },
    "answer": "D",
    "justification": "This enforces correctness at the schema level by eliminating invalid parameter combinations entirely,\nsignificantly reducing errors."
  },
  {
    "question": "Your MCP server includes archive_file(file_id) and delete_file(file_id) tools.\nProduction logs show the agent calls delete_file when users ask to remove\nold backups, but policy requires archiving backup files. Both tools currently\nhave minimal descriptions: Archives a file and Deletes a file. Which change\nmost directly improves tool selection?",
    "options": {
      "A": "Add a confirmation step that requires users to type a confirmation phrase before delete_file executes.",
      "B": "Implement server-side validation that rejects delete_file calls for files tagged as backups, returning an\nerror message suggesting archive_file.",
      "C": "Expand tool descriptions to clarify use cases, adding guidance like do not use for backup\nfiles to delete_file.",
      "D": "Add few-shot examples to the system prompt demonstrating that requests involving backup or old\nshould use archive_file."
    },
    "answer": "C",
    "justification": "Clear, specific descriptions directly influence the agent's tool selection reasoning, making it less likely\nto choose the wrong tool."
  },
  {
    "question": "Your CRM agent's delete_contact tool handles requests like delete the\nduplicate entry for Acme Corp. The database contains similarly named\nrecords, and analytics show 8% of deletions are reversed within 24 hours due\nto misidentified records. Users have also complained that the current\nmulti-step confirmation flow adds too much friction to routine cleanup tasks.\nWhich approach most effectively reduces the error rate while maintaining\nworkflow efficiency?",
    "options": {
      "A": "Present matched records with differentiating fields and require single-click confirmation of\nthe intended target before executing deletion.",
      "B": "Require users to supply the exact record ID from the CRM interface rather than using natural\nlanguage references to contact names.",
      "C": "Deploy automated duplicate detection that identifies and merges probable duplicates, removing the\nneed for manual deletion requests.",
      "D": "Implement soft-delete with a 30-day recovery window so users can undo mistakes without slowing\ndown the deletion workflow."
    },
    "answer": "A",
    "justification": "This directly addresses ambiguity by showing clear distinctions between similar records while keeping\nthe workflow fast with a lightweight confirmation step."
  },
  {
    "question": "After implementing tool use with strict schema definitions, JSON syntax\nerrors are eliminated, but 5% of extractions still have valid JSON with empty\narrays or null values for required fields like citations and methodology.\nSpot-checking reveals that source documents contain this information, but in\nvaried formats, inline citations vs bibliographies, methodology sections vs\ndetails embedded in introductions. What's the most effective way to address\nthese failures?",
    "options": {
      "A": "Modify your schema to make citations and methodology optional, and flag incomplete records for\nmanual review rather than failing validation.",
      "B": "Build a regex-based post-processing layer that scans source documents for citation patterns and\nmethodology keywords, populating empty fields when the model fails to extract.",
      "C": "Add few-shot examples demonstrating extractions from documents with varied structures,\nshowing how to identify citations in different formats and locate methodology details across\nsection types.",
      "D": "Implement retry logic that re-sends requests when validation detects empty required fields."
    },
    "answer": "C",
    "justification": "This directly improves the model's ability to generalize across diverse document formats, addressing\nthe root cause of missed extractions."
  },
  {
    "question": "The system processes product reviews using tool use with a defined schema:\nrating, pros, cons, and overall_sentiment. Testing reveals two issues with\nbrief or ambiguous reviews (about 20% of the dataset): (1) for short reviews\nlike Great product!, Claude fabricates specific pros and cons rather than\nindicating that information isn't explicitly stated, and (2) for sarcastic reviews,\nClaude picks sentiment arbitrarily since there's no option for ambiguous\ncases. What modification best addresses both issues?",
    "options": {
      "A": "Make pros and cons optional fields, and add neutral and unclear to the sentiment enum.",
      "B": "Allow empty arrays for pros/cons as valid output, and add unclear as a sentiment enum value.",
      "C": "Add an extraction_confidence field for each value, and filter outputs where any confidence falls below\na threshold.",
      "D": "Allow null values for pros/cons, and add unclear to the sentiment enum."
    },
    "answer": "B",
    "justification": "This prevents fabrication by allowing explicitly empty outputs when no details are present, and unclear\nhandles ambiguous or sarcastic sentiment appropriately."
  },
  {
    "question": "Your extraction system implements automatic retries when validation fails.\nOn each retry, the specific validation error is appended to the prompt. This\nretry-with-error-feedback approach resolves most failures within 2-3 attempts.\nFor which failure pattern would additional retries be LEAST effective?",
    "options": {
      "A": "et al. is extracted for co-authors when the full list exists only in an external document not in\nthe input.",
      "B": "Citation counts are extracted as locale-formatted strings when the schema requires integers.",
      "C": "Dates are extracted as ISO 8601 datetime strings when the schema requires only the date portion.",
      "D": "Keywords are extracted as a nested object organized by category when the schema requires a flat\narray of strings."
    },
    "answer": "A",
    "justification": "Retries won't help because the required information is not present in the input context. The model\ncannot recover missing data through repeated attempts."
  },
  {
    "question": "Your invoice extraction uses tool use with strict JSON schemas. JSON syntax\nerrors never occur, but 12% of extractions fail semantic validation, for\nexample, line item amounts don't sum to the extracted total, or vendor IDs\ndon't match valid formats. These failures currently route to manual review.\nWhat's the most effective approach to reduce manual review volume while\nmaintaining accuracy?",
    "options": {
      "A": "Retry the extraction up to 3 times when validation fails, accepting the first result that passes\nvalidation.",
      "B": "Implement post-processing logic that automatically corrects common errors, such as recalculating\ntotals from line items when sums don't match.",
      "C": "When validation fails, make a follow-up request with the document, extraction, and validation\nerrors for model correction.",
      "D": "Add stricter schema constraints with detailed field descriptions to prevent the model from generating\ninvalid values initially."
    },
    "answer": "C",
    "justification": "This provides targeted feedback, enabling the model to fix specific issues, significantly reducing\nmanual review while maintaining accuracy."
  },
  {
    "question": "Your team is extracting structured data from 50,000 legacy legal contracts\nunder a two-week deadline. Initial testing with 500 sample documents shows\n82% pass JSON schema on first attempt, while the remaining 18% fail due to\ndiverse issues, missing required fields, malformed dates, and incorrectly\nidentified parties. Documents that fail typically need refinements targeting\ntheir specific failure modes before extraction succeeds. Which batch\nprocessing strategy is the most cost-efficient while still meeting the deadline?",
    "options": {
      "A": "Split documents into 10 sequential batches of 5,000 each, analyzing results and refining prompts\nbetween batches to improve extraction quality progressively.",
      "B": "Submit all 50,000 documents via batch API, then submit failed extractions in successive\nbatches, refining prompts between each batch, until all documents pass validation.",
      "C": "Use the real-time API for all 50,000 documents since the batch API's 24-hour processing window\ncreates unacceptable deadline risk.",
      "D": "Process 2,000 sample documents via real-time API to identify failure patterns and refine prompts,\nthen batch process all 50,000 with the optimized prompts."
    },
    "answer": "B",
    "justification": "This maximizes throughput and parallelism upfront, ensuring the deadline is met. Then it uses\ntargeted iterative refinement only on failures, making it cost-efficient while handling diverse failure modes\neffectively."
  },
  {
    "question": "Your extraction pipeline processes contracts that frequently include\namendments. When a contract contains both original terms and later\namendments, the model inconsistently extracts one value or the other with no\nindication of which applies. What's the most effective approach to improve\nextraction accuracy for documents with amendments?",
    "options": {
      "A": "Preprocess documents with a classifier that identifies and removes superseded sections before the\nmain extraction step.",
      "B": "Implement post-extraction validation using pattern matching to detect amendments and flag those\nextractions for manual review.",
      "C": "Redesign the schema so amended fields capture multiple values, each with source location\nand effective date.",
      "D": "Add prompt instructions to always extract the most recent amendment value and ignore superseded\noriginal terms."
    },
    "answer": "C",
    "justification": "This preserves both original and amended values with context, enabling accurate interpretation and\navoiding ambiguity about which value applies."
  },
  {
    "question": "Your system must extract event details from calendar invitations and output\nJSON that strictly conforms to a schema with fields for title, date, time,\nlocation, and attendees. Downstream systems reject any malformed or\nnon-conformant JSON. What approach provides the most reliable schema\ncompliance?",
    "options": {
      "A": "Define a tool with your target schema as input parameters and have Claude call it with the\nextracted data.",
      "B": "Pre-fill Claude's response with an opening brace to force JSON output, then complete and parse the\nresponse.",
      "C": "Append instructions like output only valid JSON matching the schema exactly and implement retry\nlogic to re-prompt when JSON parsing fails.",
      "D": "Include detailed JSON formatting instructions and the target schema in your prompt, then parse\nClaude's text response as JSON."
    },
    "answer": "A",
    "justification": "Tool use enforces strict schema compliance at generation time, ensuring valid, structured JSON that\ndownstream systems can reliably consume."
  },
  {
    "question": "Your schema includes a skills string array field. Production monitoring\nreveals three consistency issues: (1) compound phrases like Python and SQL\nare sometimes kept as one entry, sometimes split; (2) implied but unstated\nskills occasionally appear in extractions; (3) similar documents produce\nwildly different array lengths. Your prompt currently says Extract skills\nmentioned. What's the most effective improvement?",
    "options": {
      "A": "Add constraints limiting extraction to 10-20 skills maximum, one skill per entry, only explicitly named\nskills.",
      "B": "Add post-extraction normalization that maps skills to a canonical taxonomy and deduplicates similar\nentries.",
      "C": "Enrich the schema to capture extraction metadata.",
      "D": "Add few-shot examples demonstrating compound phrase handling, explicit mention criteria,\nand appropriate entry granularity."
    },
    "answer": "D",
    "justification": "Examples directly guide the model on how to split, what to include, and the expected level of detail,\naddressing all three issues effectively."
  },
  {
    "question": "Your pipeline uses a tool called extract_metadata with a JSON schema for\npaper details. You've also defined lookup_citations and verify_doi tools for\nenrichment. During testing, requests like extract the metadata and tell me how\ncited it is sometimes cause Claude to call lookup_citations first, which fails\nbecause it needs the DOI that extract_metadata would provide. What's the\nmost effective way to ensure structured metadata extraction happens first?",
    "options": {
      "A": "Force tool_choice to extract_metadata and process the enrichment requests in subsequent\nturns after receiving the extracted metadata.",
      "B": "Set tool_choice to any so Claude must use a tool, combined with system prompt instructions\nprioritizing extract_metadata.",
      "C": "Force tool_choice to extract_metadata for every API call in the pipeline, ensuring Claude always\nextracts metadata before any enrichment can occur.",
      "D": "Set tool_choice to auto and reorder the tool definitions so extract_metadata appears first in the tools\narray, since Claude prioritizes earlier-listed tools."
    },
    "answer": "A",
    "justification": "This enforces the correct execution order, ensuring required data (like DOI) is available before\ndependent tools are called."
  },
  {
    "question": "Your system has been operating with 100% human review for 3 months.\nAnalysis shows that extractions with model confidence above 90% have 97%\naccuracy overall. To reduce reviewer workload, you plan to automate\nhigh-confidence extractions. Before deploying, what validation step is most\ncritical?",
    "options": {
      "A": "Verify that 97% accuracy meets requirements for all downstream systems that consume the\nextracted data.",
      "B": "Analyze accuracy by document type and field to verify high-confidence extractions perform\nconsistently across all segments, not just in aggregate.",
      "C": "Compare accuracy at different confidence thresholds to find the optimal cutoff that maximizes\nautomation while minimizing errors.",
      "D": "Run a two-week pilot routing 25% of high-confidence extractions directly to downstream systems and\nmonitor error reports."
    },
    "answer": "B",
    "justification": "Aggregate accuracy can hide weak spots. You need to ensure confidence above 90% is trustworthy\nacross all segments, otherwise automation may introduce systematic errors."
  },
  {
    "question": "Your extraction system uses tool use with a JSON schema containing 12\nfields and detailed descriptions, totaling approximately 2,500 tokens for the\ncomplete tool definition. Processing documents under 150K tokens yields\n98% accuracy. For documents between 175-190K tokens, accuracy drops to\n71%, with information from the final third consistently missed. The model's\ncontext window is 200K tokens. What is the most likely cause?",
    "options": {
      "A": "Tool definitions consume input context tokens. Combined with system prompts and\ndocument content, the total approaches the context limit, degrading end-of-document processing.",
      "B": "Very long documents exceed the model's effective attention span regardless of context limits,\ncausing accuracy degradation for content farther from the prompt instructions.",
      "C": "The model distributes attention proportionally across input length, causing fields mentioned only once\nnear the document's end to receive insufficient processing focus.",
      "D": "Schemas exceeding 8-10 fields increase decision complexity during parameter generation, reducing\nextraction accuracy independent of document length."
    },
    "answer": "A",
    "justification": "The tool schema (about 2,500 tokens) plus system prompts and large documents push total input\nclose to the 200K context limit, causing truncation or reduced attention to the final portion, hence missed\ninformation in the last third."
  },
  {
    "question": "An MCP server exposes an analyze_dependencies tool described only as \"Analyzes dependency graph,\" while the built-in Grep tool has a detailed description. The agent keeps using Grep for dependency questions instead of the MCP tool. What's the most effective fix?",
    "options": {
      "A": "Remove Grep from available tools whenever the MCP server is connected.",
      "B": "Add routing instructions to the system prompt forcing dependency questions to the MCP tool.",
      "C": "Split the tool into several narrower tools with focused purposes.",
      "D": "Expand the MCP tool's description to explain what it actually returns (e.g., direct imports, transitive dependencies, cycles)."
    },
    "answer": "D",
    "justification": "Tool selection is driven by description text at decision time, not the tool's real capability. A vague description loses to Grep's concrete one, so making the description specific and distinguishing is the direct fix."
  },
  {
    "question": "Your lookup_order MCP tool sometimes fails (e.g., \"Order not found\"). What is the correct pattern for reporting this error back to the agent?",
    "options": {
      "A": "Log the error server-side and return an empty result.",
      "B": "Return the error message in the tool result content with isError set to true.",
      "C": "Throw an exception for the framework to catch and log.",
      "D": "Return a success response with a status field describing the error."
    },
    "answer": "B",
    "justification": "MCP's spec uses isError: true with the error text in content so the model can see, reason about, and recover from the failure as a normal conversational turn rather than a transport crash."
  },
  {
    "question": "After 25 minutes exploring a rendering subsystem, an agent's recent replies mention only \"typical rendering patterns\" instead of the specific VulkanPipeline and FrameGraph classes it found earlier, right as it's asked to also investigate physics integration. What's the most effective approach?",
    "options": {
      "A": "Spawn a sub-agent for physics and manually merge its findings afterward.",
      "B": "Continue in the same context with more targeted prompts naming the classes.",
      "C": "Summarize the key rendering findings, then spawn a physics sub-agent seeded with that summary.",
      "D": "Use /clear to reset entirely and start fresh from the project's CLAUDE.md."
    },
    "answer": "C",
    "justification": "The symptom is context rot: load-bearing facts are getting diluted by exploratory noise. Compressing the essentials into a summary preserves precision while giving the new investigation a clean, uncluttered context."
  },
  {
    "question": "An engineer wants to understand the auth architecture across an 800+ file, multi-service codebase before making security changes. What exploration strategy builds understanding most effectively?",
    "options": {
      "A": "Read CLAUDE.md/README first, then ask the engineer to name 10-15 key files.",
      "B": "Launch parallel sub-agents to explore each service, then synthesize findings into an overview.",
      "C": "Grep for entry points, read those files, and trace imports incrementally.",
      "D": "Read every file containing \"auth\", \"login\", \"permission\", or \"token\"."
    },
    "answer": "B",
    "justification": "This is a breadth problem spanning service boundaries. Parallel, context-isolated sub-agents avoid context rot from one giant exploration, and the synthesis step is what produces the needed cross-service picture."
  },
  {
    "question": "Your agent has called lookup_order several times investigating returns; each response has 40+ fields and now dominates the context. The customer mentions two more orders to discuss. What's most effective before making more lookups?",
    "options": {
      "A": "Extract only return-relevant fields (items, purchase date, return window, status) from existing responses.",
      "B": "Have the model write a prose summary of each order, replacing the structured data.",
      "C": "Move tool responses to a vector database and retrieve relevant chunks as needed.",
      "D": "Proceed with the new lookups without touching existing context."
    },
    "answer": "A",
    "justification": "Deterministic field extraction removes irrelevant bloat (payment, shipping logistics) while keeping the precise, structured data the task actually needs, like exact return-window dates."
  },
  {
    "question": "12% of your extractions contain semantic errors that still pass schema validation (e.g., a duration placed in a quantity field). Reviewers can only check 20% of extractions. Which approach best allocates their attention?",
    "options": {
      "A": "Have the model output field-level confidence scores, then calibrate review thresholds on a labeled validation set.",
      "B": "Randomly sample 20% for review and track accuracy.",
      "C": "Review only extractions with empty or \"not found\" required fields.",
      "D": "Review all extractions from documents with unusual formatting."
    },
    "answer": "A",
    "justification": "Schema validation can't catch semantically wrong-but-valid values. Calibrated confidence scores correlate with genuine model uncertainty, letting limited review capacity target the extractions most likely to actually be wrong."
  },
  {
    "question": "A function calculateTax is defined in a core library but re-exported under different names by wrapper modules (e.g., computeOrderTax). An engineer needs every caller found before removing it. What exploration strategy is most reliable?",
    "options": {
      "A": "Read the library and wrapper modules to find every exposed name, then Grep for each name.",
      "B": "Grep for files that import the library or wrappers, then read each to check usage.",
      "C": "Grep for the function's original name across the codebase.",
      "D": "Search project documentation for integration points."
    },
    "answer": "A",
    "justification": "Because wrappers rename the function on re-export, a single-name search is guaranteed incomplete. You must first read the code to discover every alias, then search for each one."
  },
  {
    "question": "Your invoice extraction pipeline finds that in 18% of cases, summed line items don't match the extracted grand total, sometimes from OCR errors, sometimes from model mistakes. Downstream systems reject mismatched records. What's the most effective fix?",
    "options": {
      "A": "Add a calculated_total field (sum of line items) alongside stated_total, and flag records where they differ for human review.",
      "B": "Extract line items and totals separately, then use a validation model to decide which figure is correct.",
      "C": "Add few-shot examples of invoices where the numbers already reconcile.",
      "D": "Automatically rescale line items proportionally so they match the stated total."
    },
    "answer": "A",
    "justification": "Since the true source of error is unknown and could be the document itself, a deterministic arithmetic check that transparently flags mismatches for review is safer than guessing which value is correct."
  },
  {
    "question": "When lookup_order returns that an item was purchased 45 days ago, how does the agentic loop decide whether to call process_refund or escalate_to_human next?",
    "options": {
      "A": "An orchestration layer routes automatically based on the order's status field.",
      "B": "The agent follows a pre-configured decision tree of order attributes to tool calls.",
      "C": "The order details are added to context, and the model reasons about which action fits.",
      "D": "The agent executes a fixed tool sequence planned at the start of the request."
    },
    "answer": "C",
    "justification": "There's no external router — the tool result becomes part of the conversation, and the model itself reasons over it each turn to decide the next action, which is what makes the loop agentic rather than a fixed pipeline."
  },
  {
    "question": "A web search sub-agent given exact queries, source priorities, and date filters reports \"insufficient results\" instead of adapting, does poorly on emerging topics, and rarely surfaces valuable tangential sources. What most improves its adaptability?",
    "options": {
      "A": "Strip procedural detail entirely and delegate with a bare goal like \"research X thoroughly.\"",
      "B": "Add explicit fallback rules for when specified searches return too few results.",
      "C": "Classify requests as well-defined or exploratory and use different instruction styles per category.",
      "D": "Specify goals and quality criteria (coverage, diversity, recency) instead of procedural steps, and let the sub-agent choose its own strategy."
    },
    "answer": "D",
    "justification": "All three symptoms trace back to over-specified procedure boxing in the agent's judgment. Replacing rigid steps with outcome criteria lets it adapt queries, follow tangents, and handle novel topics using its own reasoning."
  },
  {
    "question": "An MCP server adds refactoring tools (extract_function, rename_variable, inline_function) with minimal descriptions like \"extracts a function from code.\" The agent keeps using Write and sed instead. What most improves adoption of the MCP tools?",
    "options": {
      "A": "Auto-route detected refactoring intent to the MCP server before the agent decides.",
      "B": "Remove the Write tool during refactoring sessions.",
      "C": "Accept it — sed is simply more predictable.",
      "D": "Enrich the descriptions to explain when each tool beats manual editing and what it expects/returns."
    },
    "answer": "D",
    "justification": "The model already understands sed and Write deeply from training; a terse, unfamiliar tool description can't compete unless it clearly states the distinct value (e.g., safe scope handling) that manual editing lacks."
  },
  {
    "question": "Documents arrive continuously and you want to use the Message Batches API (50% discount, up-to-24-hour window). Your SLA requires results within 30 hours of arrival at 99.9% reliability. Which batching strategy fits?",
    "options": {
      "A": "Submit batches every 6 hours.",
      "B": "Submit one batch at end of day.",
      "C": "Submit batches every 4 hours.",
      "D": "Skip batching and use the real-time API for everything."
    },
    "answer": "C",
    "justification": "Plan for the worst case: a document arriving right after a batch closes waits a full cycle before even being submitted, then up to 24 hours to process. A 4-hour cadence keeps that worst case safely inside the 30-hour SLA."
  },
  {
    "question": "Yesterday's session identified two refactoring approaches (extract a microservice vs. refactor in-place) for a legacy auth module. Today the engineer wants to explore both in depth before deciding. What's the most effective way to structure this?",
    "options": {
      "A": "Resume yesterday's session for approach one, then start a new session and manually recreate context for approach two.",
      "B": "Start two fresh sessions, manually summarizing yesterday's findings into each.",
      "C": "Resume yesterday's session and explore both approaches sequentially in one thread.",
      "D": "Use fork_session to branch from yesterday's analysis, exploring one approach per fork."
    },
    "answer": "D",
    "justification": "Forking preserves the expensive shared context once while giving each mutually exclusive approach its own isolated branch, preventing the two explorations from blending together or diluting each other's assumptions."
  },
  {
    "question": "Your menu-extraction pipeline must output structured JSON, but source menus format prices and dietary info inconsistently ($12 vs 12.00, icons vs text). What's the most reliable approach?",
    "options": {
      "A": "Run separate extraction calls per field.",
      "B": "Extract as-is and normalize formats afterward in code.",
      "C": "Run multiple extraction attempts and pick the most common format.",
      "D": "Define a strict output schema and include explicit normalization rules in the prompt."
    },
    "answer": "D",
    "justification": "A strict schema forces one canonical shape, and prompt-level normalization rules give the model the semantic guidance needed for cases like mapping a dietary icon to its correct text tag, which pure post-processing code can't reliably do."
  },
  {
    "question": "A customer writes: \"I've explained my issue twice and nothing is resolved. I want to talk to a real person NOW.\" The agent hasn't investigated their account yet. What should it do?",
    "options": {
      "A": "Ask one targeted question before escalating.",
      "B": "Briefly explain what it can help with and offer to resolve it, escalating only if asked again.",
      "C": "Immediately call escalate_to_human with the conversation history.",
      "D": "First call get_customer and lookup_order, then escalate."
    },
    "answer": "C",
    "justification": "The request is explicit and unambiguous, and the customer has already repeated themselves twice. Any further delay for questions or investigation reads as not listening, which is exactly their complaint."
  },
  {
    "question": "You process standard monthly reports (archived after processing) and urgent exception reports (must alert within 30 minutes), both on the same schema. You want to minimize cost while meeting latency needs. How should you architect this?",
    "options": {
      "A": "Send everything through the real-time Messages API for consistent latency.",
      "B": "Send everything to the Batch API and expedite urgent ones once results return.",
      "C": "Queue everything for hourly batches, flagging urgent items for expedited handling.",
      "D": "Route standard reports to the Batch API for the discount, and urgent reports to the real-time API."
    },
    "answer": "D",
    "justification": "The Batch API's up-to-24-hour window is fundamentally incompatible with a 30-minute SLA, so only documents that can tolerate delay should go there; urgent items need the real-time path regardless of cost."
  },
  {
    "question": "After a 25+ turn billing investigation, you find duplicate charges from a payment gateway timeout, requiring an $847 refund that exceeds your $500 limit. You must escalate_to_human and the human has no access to your transcript. What should you pass along?",
    "options": {
      "A": "The customer's complaint verbatim plus raw tool result excerpts.",
      "B": "A structured summary: customer ID, root cause, refund amount, and recommended action.",
      "C": "The complete conversation transcript.",
      "D": "Just the diagnosis and refund amount."
    },
    "answer": "B",
    "justification": "The human's entire starting context is whatever you pass them. A structured summary gives the hard-won conclusion (root cause) and the exact actionable numbers, without forcing them to read and re-derive from raw history."
  },
  {
    "question": "A codebase session ID from an hour-long investigation is still valid, but 3 of the 12 previously read files were modified overnight by a teammate's merge. What approach best balances efficiency and accuracy on resume?",
    "options": {
      "A": "Resume without mentioning the changed files.",
      "B": "Start a completely fresh session.",
      "C": "Resume and tell the agent exactly which files changed for targeted re-analysis.",
      "D": "Resume and immediately re-read all 12 files."
    },
    "answer": "C",
    "justification": "Most of the accumulated understanding is still valid; only a small, known subset changed. Targeting just those files fixes the actual staleness without discarding good context or wastefully re-reading everything."
  },
  {
    "question": "An engineer needs to understand a caching layer spanning 15 files (~8,000 lines: decorators, middleware, service classes) before adding a new invalidation trigger. What's the most effective next step given context limits?",
    "options": {
      "A": "Sequentially Read all 15 files for complete coverage.",
      "B": "Analyze imports/class hierarchies to find the base cache class, read it for the interface, then trace specific invalidation implementations.",
      "C": "Grep for \"invalidate\"/\"expire\" and read only those line ranges.",
      "D": "Glob for cache-named files, prioritizing the largest ones first."
    },
    "answer": "B",
    "justification": "Understanding the base class first reveals the shared interface nearly everything else implements, giving high understanding-per-token before targeted, informed tracing of specific invalidation logic."
  },
  {
    "question": "A customer writes: \"I've been going back and forth on this return for days. I just want to speak to someone who can actually help me.\" The agent has already confirmed via lookup_order that the return is straightforward and eligible for immediate processing. What should it do?",
    "options": {
      "A": "Acknowledge the frustration, note it's resolvable now, and offer to complete it or escalate.",
      "B": "Call escalate_to_human immediately to honor the request.",
      "C": "Process the refund silently and inform them it's done.",
      "D": "Ask what specifically hasn't worked before deciding."
    },
    "answer": "A",
    "justification": "Unlike an explicit, unconditional demand for a human, this phrasing signals frustration at the lack of resolution. Since the agent can now genuinely resolve it, offering both paths respects their autonomy without ignoring that help is available."
  },
  {
    "question": "A developer asks why an API endpoint intermittently returns 500 errors, across a 200+ file codebase spanning routing, middleware, business logic, and database layers, with the cause unknown. What task decomposition approach is most effective?",
    "options": {
      "A": "Create a comprehensive plan mapping all code paths before any exploration.",
      "B": "Dynamically generate investigation subtasks based on what's discovered at each step, adapting as the error path emerges.",
      "C": "Define a fixed investigation sequence upfront and execute it regardless of findings.",
      "D": "Run parallel workers investigating all four layers simultaneously, then synthesize."
    },
    "answer": "B",
    "justification": "\"Intermittent\" signals an unknown root cause that could lie in any layer. Following the evidence trail as it emerges lets the agent go deep where findings point and skip irrelevant layers, unlike a rigid pre-set checklist."
  },
  {
    "question": "Which escalation strategy most reliably identifies situations requiring human intervention?",
    "options": {
      "A": "Escalate when the customer explicitly requests a human, when policy exceptions are required, or when the model cannot make meaningful progress.",
      "B": "Escalate after three consecutive failed tool calls.",
      "C": "Escalate whenever sentiment analysis detects frustration.",
      "D": "Use a rules engine that maps issue types directly to escalation decisions."
    },
    "answer": "A",
    "justification": "Combining explicit requests, authority limitations, and model judgment captures genuine escalation scenarios more accurately than rigid rules or sentiment thresholds."
  },
  {
    "question": "A coordinator repeatedly sends the entire outputs of previous subagents to every subsequent subagent, causing prompts to exceed the context window. What is the best improvement?",
    "options": {
      "A": "Increase the model's context window.",
      "B": "Compress every response using a summarization model.",
      "C": "Pass only the information each downstream subagent actually requires.",
      "D": "Store everything in a vector database and retrieve randomly."
    },
    "answer": "C",
    "justification": "Subagents should receive only the context relevant to their task. Passing unnecessary information wastes tokens and reduces overall reasoning quality."
  },
  {
    "question": "An extraction pipeline processes insurance claims. Some claims include handwritten notes that are occasionally missed, resulting in incomplete structured outputs. What is the best approach?",
    "options": {
      "A": "Increase the model temperature.",
      "B": "Add examples containing handwritten annotations to the extraction prompt.",
      "C": "Ignore handwritten notes because OCR is imperfect.",
      "D": "Run the extraction twice and merge both outputs."
    },
    "answer": "B",
    "justification": "Providing representative examples teaches the model how handwritten annotations appear and improves extraction robustness across document variations."
  },
  {
    "question": "An MCP server exposes both `search_codebase` and `grep_text`. Users asking semantic questions about architecture still trigger `grep_text`. What is the most effective fix?",
    "options": {
      "A": "Rename `search_codebase` to `architecture_search`.",
      "B": "Improve the description of `search_codebase` to emphasize semantic understanding, relationships, and architectural exploration.",
      "C": "Remove `grep_text` from the available tools.",
      "D": "Always force `search_codebase` as the first tool."
    },
    "answer": "B",
    "justification": "Clear, capability-focused tool descriptions significantly improve tool selection by helping the model understand when semantic search is preferable to literal text matching."
  },
  {
    "question": "A research workflow combines results from a web-search agent, a PDF-analysis agent, and a spreadsheet-analysis agent. What responsibility should remain with the coordinator?",
    "options": {
      "A": "Directly performing analysis on every source.",
      "B": "Managing task delegation, collecting results, and synthesizing the final answer.",
      "C": "Replacing specialized agents whenever information overlaps.",
      "D": "Forwarding every intermediate output unchanged."
    },
    "answer": "B",
    "justification": "The coordinator orchestrates the workflow by assigning tasks, collecting outputs, and producing the final synthesized response while leaving specialized analysis to subagents."
  },
  {
    "question": "A customer support agent repeatedly calls `lookup_order` even after the order details are already available in the conversation context. What is the best way to reduce unnecessary tool calls?",
    "options": {
      "A": "Always cache every tool response permanently.",
      "B": "Prompt the model to reason over existing conversation context before deciding to call another tool.",
      "C": "Disable the `lookup_order` tool after the first call.",
      "D": "Replace the tool with a larger language model."
    },
    "answer": "B",
    "justification": "Tool results become part of the conversation context. Encouraging the model to use existing information before invoking another tool reduces redundant tool usage while preserving flexibility."
  },
  {
    "question": "An MCP tool called `find_security_issues` detects authentication vulnerabilities, insecure dependencies, and exposed secrets, but the agent almost always uses generic code search instead. What change is most likely to improve tool selection?",
    "options": {
      "A": "Rename the tool to `security_scan`.",
      "B": "Expand the tool description with detailed capabilities, supported vulnerability categories, and expected outputs.",
      "C": "Always force the tool for security-related questions.",
      "D": "Split the tool into one function per vulnerability type."
    },
    "answer": "B",
    "justification": "Detailed descriptions help the model understand the specialized capabilities of the MCP tool, making it more likely to choose it over generic search."
  },
  {
    "question": "A document extraction workflow occasionally produces valid JSON, but numeric values are returned as strings, causing downstream validation failures. What is the best solution?",
    "options": {
      "A": "Convert every value to a string after extraction.",
      "B": "Specify strict data types in the output schema and include examples demonstrating the expected numeric formats.",
      "C": "Ignore the type mismatch because JSON is valid.",
      "D": "Retry the extraction until numeric values are returned correctly."
    },
    "answer": "B",
    "justification": "Clearly defining field types in the schema and reinforcing them with examples improves extraction consistency and reduces downstream validation errors."
  },
  {
    "question": "A coordinator sends the same research request independently to three web-search agents. Their results heavily overlap, wasting tokens and processing time. What is the best orchestration strategy?",
    "options": {
      "A": "Assign each agent a distinct research focus or domain.",
      "B": "Increase the number of search agents.",
      "C": "Merge all search agents into one larger agent.",
      "D": "Allow each agent to search the entire web independently."
    },
    "answer": "A",
    "justification": "Dividing responsibilities avoids redundant work while increasing overall coverage and making better use of available context."
  },
  {
    "question": "An agent investigating a production outage spends most of its context repeating previous observations instead of advancing the investigation. What is the best way to preserve important findings while freeing context?",
    "options": {
      "A": "Delete older conversation history.",
      "B": "Create a structured summary of confirmed findings and continue the investigation using the summary.",
      "C": "Restart the investigation from scratch.",
      "D": "Move the conversation into a vector database."
    },
    "answer": "B",
    "justification": "Summarizing confirmed findings preserves essential context while freeing tokens for continued reasoning and investigation."
  },
  {
    "question": "An agent is answering questions about a large codebase. It repeatedly searches the same directories because it doesn't remember previous exploration. What is the best improvement?",
    "options": {
      "A": "Increase the model temperature.",
      "B": "Maintain a structured exploration summary listing visited modules, key findings, and unexplored areas.",
      "C": "Restart the search whenever a new question is asked.",
      "D": "Search the entire repository for every request."
    },
    "answer": "B",
    "justification": "A structured exploration summary prevents redundant searches, preserves discoveries, and helps the agent focus on unexplored parts of the codebase."
  },
  {
    "question": "A multi-agent research workflow combines outputs from a web search agent, a database agent, and a document analysis agent. Which approach produces the most reliable final answer?",
    "options": {
      "A": "Concatenate every agent's output in chronological order.",
      "B": "Allow each agent to independently generate the final answer.",
      "C": "Use a coordinator to synthesize the results, resolve conflicts, and produce one coherent response.",
      "D": "Discard conflicting information automatically."
    },
    "answer": "C",
    "justification": "The coordinator is responsible for integrating findings, resolving inconsistencies, and generating a coherent response using the specialized outputs."
  },
  {
    "question": "A document extraction system processes invoices from hundreds of vendors with different layouts. Which technique best improves extraction accuracy across unseen templates?",
    "options": {
      "A": "Increase the maximum output token limit.",
      "B": "Provide diverse few-shot examples representing many invoice layouts.",
      "C": "Extract each field using separate API calls.",
      "D": "Lower the model temperature."
    },
    "answer": "B",
    "justification": "Representative few-shot examples teach the model to generalize across different layouts, improving extraction robustness for unseen templates."
  },
  {
    "question": "An MCP server provides a specialized dependency graph tool, but the agent continues using recursive Grep searches. What is the most likely reason?",
    "options": {
      "A": "The dependency graph tool is too fast.",
      "B": "The tool description does not clearly communicate its capabilities compared to Grep.",
      "C": "Recursive Grep is always preferred by language models.",
      "D": "The MCP server requires authentication."
    },
    "answer": "B",
    "justification": "Tool selection depends heavily on descriptive metadata. If specialized capabilities are not clearly explained, the model often falls back to more generic tools."
  },
  {
    "question": "An AI agent investigating a production issue reaches a point where several possible root causes remain equally plausible. What should it do next?",
    "options": {
      "A": "Choose the most likely cause and stop investigating.",
      "B": "Generate targeted investigation steps to gather evidence that distinguishes between the remaining hypotheses.",
      "C": "Escalate immediately to a human.",
      "D": "Restart the investigation from the beginning."
    },
    "answer": "B",
    "justification": "When multiple hypotheses remain, the most effective strategy is to gather additional evidence that discriminates between them instead of guessing or restarting."
  },
  {
    "question": "A tool returns a 500-line JSON response, but the agent only needs the customer's membership tier to answer the user's question. What is the best approach?",
    "options": {
      "A": "Pass the complete JSON into the conversation.",
      "B": "Extract only the required field before continuing the conversation.",
      "C": "Store the JSON in memory for future requests.",
      "D": "Convert the JSON into a paragraph."
    },
    "answer": "B",
    "justification": "Only the information required for the current reasoning task should be added to context. This minimizes token usage while preserving answer quality."
  },
  {
    "question": "A document extraction workflow sometimes produces dates in 'MM/DD/YYYY' and other times in 'DD-MM-YYYY', causing downstream failures. What is the best solution?",
    "options": {
      "A": "Accept both formats in downstream systems.",
      "B": "Specify a single required date format in the output schema and reinforce it with examples.",
      "C": "Retry extraction until the preferred format appears.",
      "D": "Convert every date into text after extraction."
    },
    "answer": "B",
    "justification": "Explicit schema constraints combined with examples are the most reliable way to enforce consistent structured outputs."
  },
  {
    "question": "A coordinator launches several subagents, but two of them repeatedly perform nearly identical research. What is the best orchestration improvement?",
    "options": {
      "A": "Merge both agents into one larger prompt.",
      "B": "Assign each subagent a clearly defined responsibility with minimal overlap.",
      "C": "Increase the number of research agents.",
      "D": "Allow all agents to search everything independently."
    },
    "answer": "B",
    "justification": "Specialized, non-overlapping responsibilities reduce duplicate work, improve coverage, and make orchestration more efficient."
  },
  {
    "question": "An MCP tool called `analyze_architecture` is rarely selected even though it provides richer results than generic search. Which change is most likely to improve tool usage?",
    "options": {
      "A": "Rename it to `search_architecture`.",
      "B": "Expand its description with clear examples of what it analyzes and when it should be used.",
      "C": "Force the tool on every architecture question.",
      "D": "Split it into multiple smaller tools."
    },
    "answer": "B",
    "justification": "The quality of tool descriptions strongly influences tool selection. Detailed descriptions make specialized tools easier for the model to recognize."
  },
  {
    "question": "An AI assistant has completed a long debugging session. Before beginning a completely different feature implementation, what is the most effective context-management strategy?",
    "options": {
      "A": "Continue in the same conversation.",
      "B": "Summarize important debugging findings and start a fresh session for the new feature.",
      "C": "Delete the previous conversation.",
      "D": "Repeat the debugging investigation from scratch."
    },
    "answer": "B",
    "justification": "A concise summary preserves valuable findings while allowing the new task to begin with a clean, focused context."
  },
  {
    "question": "A customer explicitly requests to speak with a human representative before any troubleshooting begins. What should the agent do?",
    "options": {
      "A": "Ask diagnostic questions first.",
      "B": "Attempt one troubleshooting step before escalating.",
      "C": "Immediately initiate the human escalation process.",
      "D": "Continue until no automated options remain."
    },
    "answer": "C",
    "justification": "Explicit customer requests for a human should generally be respected immediately to provide a better customer experience."
  },
  {
    "question": "An extraction pipeline achieves 99% JSON validity but only 90% semantic correctness. Which additional validation provides the greatest improvement?",
    "options": {
      "A": "JSON schema validation.",
      "B": "Business-rule and cross-field consistency validation.",
      "C": "Reducing the output token limit.",
      "D": "Increasing model temperature."
    },
    "answer": "B",
    "justification": "Schema validation checks structure, while business-rule validation detects logically inconsistent or semantically incorrect outputs."
  },
  {
    "question": "An AI agent repeatedly reopens the same files during an investigation because previous discoveries are scattered throughout a long conversation. What is the best solution?",
    "options": {
      "A": "Increase the context window.",
      "B": "Maintain a structured working summary that is updated as the investigation progresses.",
      "C": "Restart the investigation every hour.",
      "D": "Store every conversation in a vector database."
    },
    "answer": "B",
    "justification": "A continuously maintained working summary prevents redundant exploration while keeping the investigation focused."
  },
  {
    "question": "A coordinator receives outputs from multiple specialized agents that contain overlapping evidence. What should the coordinator do?",
    "options": {
      "A": "Forward every output without modification.",
      "B": "Remove duplicates, reconcile conflicts, and synthesize one coherent response.",
      "C": "Choose one agent's response at random.",
      "D": "Discard every overlapping result."
    },
    "answer": "B",
    "justification": "The coordinator's responsibility is to integrate evidence into a concise, coherent, and non-redundant final response."
  },
  {
    "question": "When designing specialized MCP tools, what characteristic most improves tool selection accuracy?",
    "options": {
      "A": "Very short tool names.",
      "B": "Detailed descriptions explaining capabilities, expected inputs, outputs, and appropriate use cases.",
      "C": "Returning larger responses.",
      "D": "Creating as many tools as possible."
    },
    "answer": "B",
    "justification": "Rich descriptions help the model understand each tool's purpose and when it should be selected."
  },
  {
    "question": "A long-running investigation has accumulated thousands of tokens of intermediate reasoning. Before moving to implementation, what is the recommended practice?",
    "options": {
      "A": "Continue using the entire conversation history.",
      "B": "Create a concise summary of confirmed findings and begin implementation with that summary.",
      "C": "Delete all previous work.",
      "D": "Repeat the investigation."
    },
    "answer": "B",
    "justification": "Summarizing confirmed findings preserves the essential context while freeing the model to focus on implementation."
  },
  {
    "question": "What is the primary responsibility of an orchestration coordinator in a multi-agent system?",
    "options": {
      "A": "Perform every specialized task itself.",
      "B": "Delegate work, manage context, collect results, resolve conflicts, and produce the final response.",
      "C": "Replace specialized agents whenever possible.",
      "D": "Execute tools directly without using subagents."
    },
    "answer": "B",
    "justification": "The coordinator orchestrates the workflow, ensuring each specialized agent contributes effectively while producing one coherent final result."
  },
  {
    "question": "Production data shows that in 12% of cases, your agent skips get_customer entirely and calls lookup_order using only the customer's stated name, occasionally leading to misidentified accounts and incorrect refunds. What change would most effectively address this reliability issue?",
    "options": {
      "A": "Add a programmatic prerequisite that blocks lookup_order and process_refund calls until get_customer has returned a verified customer ID.",
      "B": "Enhance the system prompt to state that customer verification via get_customer is mandatory before any order operations.",
      "C": "Add few-shot examples showing the agent always calling get_customer first, even when customers volunteer order details.",
      "D": "Implement a routing classifier that analyzes each request and enables only the subset of tools appropriate for that request type."
    },
    "answer": "A",
    "justification": "When a specific tool sequence is required for critical business logic (like verifying customer identity before processing refunds), programmatic enforcement provides deterministic guarantees that prompt-based approaches cannot. Options B and C rely on probabilistic LLM compliance, which is insufficient when errors have financial consequences. Option D addresses tool availability rather than tool ordering, which is not the actual problem."
  },
  {
    "question": "Production logs show the agent frequently calls get_customer when users ask about orders (e.g., 'check my order #12345'), instead of calling lookup_order. Both tools have minimal descriptions ('Retrieves customer information' / 'Retrieves order details') and accept similar identifier formats. What's the most effective first step to improve tool selection reliability?",
    "options": {
      "A": "Add few-shot examples to the system prompt demonstrating correct tool selection patterns, with 5-8 examples showing order-related queries routing to lookup_order.",
      "B": "Expand each tool's description to include input formats it handles, example queries, edge cases, and boundaries explaining when to use it versus similar tools.",
      "C": "Implement a routing layer that parses user input before each turn and pre-selects the appropriate tool based on detected keywords and identifier patterns.",
      "D": "Consolidate both tools into a single lookup_entity tool that accepts any identifier and internally determines which backend to query."
    },
    "answer": "B",
    "justification": "Tool descriptions are the primary mechanism LLMs use for tool selection. When descriptions are minimal, models lack the context to differentiate between similar tools. Option B directly addresses this root cause with a low-effort, high-leverage fix. Few-shot examples (A) add token overhead without fixing the underlying issue. A routing layer (C) is over-engineered and bypasses the LLM's natural language understanding. Consolidating tools (D) is a valid architectural choice but requires more effort than a 'first step' warrants when the immediate problem is inadequate descriptions."
  },
  {
    "question": "Your agent achieves 55% first-contact resolution, well below the 80% target. Logs show it escalates straightforward cases (standard damage replacements with photo evidence) while attempting to autonomously handle complex situations requiring policy exceptions. What's the most effective way to improve escalation calibration?",
    "options": {
      "A": "Add explicit escalation criteria to your system prompt with few-shot examples demonstrating when to escalate versus resolve autonomously.",
      "B": "Have the agent self-report a confidence score (1-10) before each response and automatically route requests to humans when confidence falls below a threshold.",
      "C": "Deploy a separate classifier model trained on historical tickets to predict which requests need escalation before the main agent begins processing.",
      "D": "Implement sentiment analysis to detect customer frustration levels and automatically escalate when negative sentiment exceeds a threshold."
    },
    "answer": "A",
    "justification": "Adding explicit escalation criteria with few-shot examples directly addresses the root cause: unclear decision boundaries. This is the proportionate first response before adding infrastructure. Option B fails because LLM self-reported confidence is poorly calibrated—the agent is already incorrectly confident on hard cases. Option C is over-engineered, requiring labeled data and ML infrastructure when prompt optimization hasn't been tried. Option D solves a different problem entirely; sentiment doesn't correlate with case complexity, which is the actual issue."
  },
  {
    "question": "You want to create a custom /review slash command that runs your team's standard code review checklist. This command should be available to every developer when they clone or pull the repository. Where should you create this command file?",
    "options": {
      "A": "In the .claude/commands/ directory in the project repository.",
      "B": "In ~/.claude/commands/ in each developer's home directory.",
      "C": "In the CLAUDE.md file at the project root.",
      "D": "In a .claude/config.json file with a commands array."
    },
    "answer": "A",
    "justification": "Project-scoped custom slash commands should be stored in the .claude/commands/ directory within the repository. These commands are version-controlled and automatically available to all developers when they clone or pull the repo. Option B (~/.claude/commands/) is for personal commands that aren't shared via version control. Option C (CLAUDE.md) is for project instructions and context, not command definitions. Option D describes a configuration mechanism that doesn't exist in Claude Code."
  },
  {
    "question": "Your customer support agent's context window is frequently exceeded because conversation history includes repeated shipping policies, return policies, and product details that have already been explained. Which context management strategy would most effectively reduce token usage while preserving necessary information?",
    "options": {
      "A": "Increase the model's context window to accommodate the growing conversation history.",
      "B": "Replace older conversation turns with concise summaries that preserve key decisions, facts, and unresolved issues while removing repetitive explanations.",
      "C": "Delete all conversation history older than 10 messages to guarantee the context stays within limits.",
      "D": "Store every previous message in a vector database and retrieve the entire conversation for every new request."
    },
    "answer": "B",
    "justification": "Summarizing older conversation history preserves the important facts and decisions while significantly reducing token usage. This is the recommended context management strategy for long-running conversations. Increasing the context window (A) only delays the problem and increases cost. Deleting history (C) risks losing important context. Retrieving the full conversation from a vector database (D) defeats the purpose of reducing context size."
  },
  {
    "question": "Your development team frequently asks Claude Code to generate new REST endpoints, but every engineer receives slightly different implementations because architectural conventions are not consistently applied. What is the best long-term solution?",
    "options": {
      "A": "Create a comprehensive CLAUDE.md file documenting project architecture, coding conventions, preferred patterns, testing requirements, and API standards.",
      "B": "Write a longer prompt every time an engineer asks Claude Code to generate a new endpoint.",
      "C": "Increase the model temperature so the generated implementations become more creative and flexible.",
      "D": "Require every engineer to manually edit the generated code until it matches the team's standards."
    },
    "answer": "A",
    "justification": "CLAUDE.md provides persistent project-specific instructions that Claude Code automatically considers for every request. This ensures consistent code generation across the team without repeatedly writing lengthy prompts. Options B and D rely on repetitive manual work, while option C would reduce consistency rather than improve it."
  },
  {
    "question": "An AI agent is responsible for approving expense reimbursements. Company policy states that any reimbursement over $5,000 must receive human approval regardless of supporting documentation. Which implementation best satisfies this requirement?",
    "options": {
      "A": "Prompt the agent to remember that reimbursements above $5,000 require human approval.",
      "B": "Allow the agent to decide autonomously and monitor its performance over time.",
      "C": "Implement deterministic application logic that prevents automatic approval above $5,000 and routes those requests to a human reviewer.",
      "D": "Train the model using more examples of high-value reimbursement requests."
    },
    "answer": "C",
    "justification": "Business rules with regulatory, financial, or compliance implications should always be enforced programmatically. Prompt instructions and additional training cannot guarantee compliance. Deterministic application logic provides the required safety and consistency."
  },
  {
    "question": "Your AI application performs document summarization by first retrieving relevant documents from a vector database before sending them to the language model. What is the primary purpose of this Retrieval-Augmented Generation (RAG) approach?",
    "options": {
      "A": "Reduce model latency by minimizing the number of API requests.",
      "B": "Provide the language model with relevant external knowledge that was not included in its original training data.",
      "C": "Replace prompt engineering entirely so no instructions are required.",
      "D": "Automatically fine-tune the model during every user interaction."
    },
    "answer": "B",
    "justification": "Retrieval-Augmented Generation (RAG) retrieves relevant information from external knowledge sources and provides that information as context to the model. This allows the model to answer using current, domain-specific, or proprietary information without requiring model retraining."
  },
  {
    "question": "Your engineering team wants Claude Code to automatically execute unit tests after every code change before presenting the final response. Which Claude Code capability best supports this workflow?",
    "options": {
      "A": "Configure Claude Code to invoke the testing command as part of its tool workflow before completing the task.",
      "B": "Add a reminder to the system prompt asking Claude to remember to run tests whenever code changes.",
      "C": "Increase the context window so Claude can remember previous testing instructions throughout the session.",
      "D": "Fine-tune the model on software engineering datasets containing test execution examples."
    },
    "answer": "A",
    "justification": "Claude Code can invoke tools and execute commands as part of its workflow. Automating test execution through tools provides deterministic validation rather than relying on prompt instructions or model memory."
  },
  {
    "question": "A multi-agent application contains a Planner Agent, a Research Agent, and an Execution Agent. The Planner determines the work, the Research Agent gathers information, and the Execution Agent performs the requested actions. What is the primary benefit of this architecture compared to using a single general-purpose agent?",
    "options": {
      "A": "Each specialized agent can focus on a narrow responsibility, improving modularity, maintainability, and overall reliability.",
      "B": "Multiple agents always reduce API costs because fewer prompts are required.",
      "C": "The application no longer requires prompts because agents automatically understand each other's responsibilities.",
      "D": "The architecture guarantees faster responses regardless of workload."
    },
    "answer": "A",
    "justification": "Multi-agent systems divide responsibilities into specialized components. This improves separation of concerns, maintainability, testing, and reliability. It does not inherently reduce costs or guarantee lower latency."
  },
  {
    "question": "Your AI assistant must answer questions using an internal company knowledge base that changes every day. Which approach provides the most accurate and maintainable solution?",
    "options": {
      "A": "Fine-tune the language model every day using the latest knowledge base.",
      "B": "Implement Retrieval-Augmented Generation (RAG) so relevant documents are retrieved dynamically at query time.",
      "C": "Increase the prompt length by including the entire knowledge base with every request.",
      "D": "Rely entirely on the model's original training knowledge."
    },
    "answer": "B",
    "justification": "RAG allows the application to retrieve the latest information at runtime without retraining the model. This provides current, accurate, and scalable access to frequently changing knowledge."
  },
  {
    "question": "During production monitoring, you discover that your AI agent occasionally generates responses that appear plausible but contradict the retrieved documentation. What is the most effective strategy to reduce these hallucinations?",
    "options": {
      "A": "Require the model to base its answers only on retrieved context and instruct it to acknowledge when sufficient information is unavailable.",
      "B": "Increase the temperature so the model explores more possible answers.",
      "C": "Remove retrieval entirely and rely only on the model's pretrained knowledge.",
      "D": "Expand the context window to include more previous conversation history regardless of relevance."
    },
    "answer": "A",
    "justification": "Constraining the model to retrieved evidence and allowing it to respond with 'I don't know' when evidence is insufficient is one of the most effective ways to reduce hallucinations in RAG systems. Higher temperature increases variability, removing retrieval eliminates current knowledge, and adding unrelated context does not address the underlying issue."
  }
];
