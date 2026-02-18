# Phase 4 — Review Summary

```slc
@block PHASE phase_4_summary
priority: high
intent: "Phase 4 overview — Review Submission"
scope: phase-4
depends_on: [phase-3]

content:
  name: "Review"
  description: "ReviewSubmission model and protected review endpoint (requires has_downloaded)"
  total_tasks: 2
  estimate_minutes: 40
  completed: 0

  task_order:
    - 4.1_review_model
    - 4.2_review_endpoint

  milestone: "Users who downloaded can submit a project review with project link and text."
@end
```
