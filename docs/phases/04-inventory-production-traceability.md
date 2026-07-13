# Phase 4 — Inventory, Purchasing, Production, and Traceability

## Objective and dependencies

Deliver CONTROL foundations for purchasing, receiving, immutable inventory, production, and lot genealogy. Requires Phase 2 formula/unit identity and Phase 3 organization, packaging, quote, and cost context.

## Domain model

Inventory items and locations; lots with supplier/manufacturer lot, dates and eligibility status; purchase orders/lines and status history; receipts/lines and discrepancies; immutable inventory transactions with type, quantity, unit, lot, location, source reference, idempotency key, posting actor/time, reversal link; production order/batch; formula/configuration/cost snapshot; material allocation; planned and actual consumption; output lots; production events and status history.

Represent inventory quantities in compatible base dimensions. Availability is derived, never manually overwritten. Production completion and quality release are separate.

## Screens and workflows

Inventory and availability by item/location/status; lot detail and transaction ledger; PO authoring/approval/status; receipt capture and discrepancy handling; production planning/scaling/allocation; production execution with actual usage; batch record; forward/backward traceability explorer; explicit correction/reversal flow.

## Services and invariants

PO lifecycle and permission policy; idempotent receiving/posting; immutable ledger/reversal; availability projection excluding held/quarantined/rejected/expired lots; negative-stock guard; FEFO suggestion without silent allocation; production snapshot/scaling; planned-versus-actual reconciliation; lot genealogy. Transactions and state changes are atomic.

## Test plan

Double-submit/idempotency and concurrency; ledger sum and linked reversal; incompatible units; negative stock rejection; lot-status and expiry exclusion; partial/over receipts; planned vs actual variance; exact snapshot persistence after master changes; trace from supplier lot to output and output to inputs; permission/audit and mobile execution behavior.

## Acceptance criteria

Every balance is explainable by transactions; every correction retains history; users can receive known goods, plan and record production, distinguish plan/actual and complete/released, and traverse full lot genealogy. No ineligible inventory appears available. Migrations, tests, build, responsive/accessibility, and protected Vercel checks pass.

## Non-goals and stop conditions

No accounting ledger, automated vendor ordering, warehouse robotics, destructive stock edits, silent negative stock, or Phase 5 quality disposition automation. Stop for unresolved transaction semantics, unsafe migration, broken traceability, concurrency failure, missing permission, failing checks, or achieved acceptance. Recommend Phase 5 only.
