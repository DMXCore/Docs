# How-to chat - status assessment (2026-09-15)

Requirement-by-requirement check of [`howto-chat-plan.md`](howto-chat-plan.md)
and [`howto-chat-implementation-plan.md`](howto-chat-implementation-plan.md)
against code, tests and what is deployed. The gap is planned in
[`howto-chat-gap-plan.md`](howto-chat-gap-plan.md).

**How this was checked.** Read the code and git history in all five repos (read-only).
Ran the relevant unit tests: HelpApi 63/63, AdminPortal help-agent + Seq 41/41,
DeviceApi 23/23, Core `ConfigSnapshot` 3/3. Checked deployment read-only through
`az` (container app revisions and images, Key Vault secret **names**, OpenAI
deployment, storage containers, budgets) and `gh` (workflow runs, repo variables and
secret names, issues). Probed the public endpoints `/api/Version`, `/api/corpus`,
`/health`, CORS preflights and the live docs page. No secret values were read and
nothing was triggered.

## Update: gap plan stages F–K shipped (2026-09-15, later)

The tables below are the original assessment. Since then, the gap plan
([`howto-chat-gap-plan.md`](howto-chat-gap-plan.md)) stages F–K were built, deployed and smoke-checked. A signed-in chat has not yet been exercised end to end with a real device.

| Stage | Repo | Commit | Deployed / verified |
|-------|------|--------|---------------------|
| F: hardening | Core | `e3980b5d` cloud-safe timeline file names, zip test, UserActivity Debug logging test | Pushed. Release OpenBalena build 7758 deployed to DEV, but its artifact registration with the portal failed (connection reset during the portal deploy); re-run needed |
| F | DeviceApi | `fcfc18f` skip unsafe zip entries, `lastRejected`, trigger and TUS tests | Rev `0000040`, `/api/Version` 1.0.47+fcfc18f |
| F + G: token and context endpoints | AdminPortal | `867b517` scoped help-agent token, `HelpAgent` scheme, context endpoints, session lifecycle fixes, `update_required` gate | Rev `0000134`: context and token endpoints 401 without auth; `HelpAgent__Token__Key` from KV `help-agent-token-key` |
| F + H + K: signed-in chat | HelpApi | `1293ab7` token validation, session binding, per-turn context, `list_sections` / `get_section` / `get_recent_logs`, transcript redaction, persisted limits, $200 cost ceiling, budget module. `c18e4de` turns on `DeviceTools__LogsEnabled` and the budget alerts ($100 / $200 to hakan@lindestaf.com) | `1293ab7` on rev `0000003`: portal CORS with `Authorization`, `401 token_invalid`, `Portal__*` wired. `c18e4de` on rev `0000005` (1.0.8+c18e4de): `DeviceTools__LogsEnabled=true`; budget `budget-dmxcore-portal-helpapi-001` is $200/month from 2026-09-01 over the 3 HelpApi resources, alerting at 50% / 100% actual and 100% forecast |
| I: portal chat view | AdminPortal | `a64dcef` chat in `/help`, snapshot bar, `update_required` / `lastRejected` on the device card | Rev `0000135`, `/api/Version` 1.0.268+a64dcef; `/help` bundle contains the HelpApi URL (repo variable `HELP_API_URL`) |
| J: docs handoff | Docs | `0765543` "continued in the portal" state; repo variable `HELP_CONTINUE_URL=https://portal.dmxcore.com/help` | Live: docs.dmxcore.com renders `data-continue="https://portal.dmxcore.com/help"` (deploy of `5497d6e`) |

**Status changes against the rows below:**
- **Now Done:**
  - A: A15, A21, A28.
  - C: C9, C11 (C11 in `e3980b5d`, plus DeviceApi tolerance for older units).
  - D: D7, D8.
  - P: P16, P17, P18.
  - B: B1–B5, B7–B12.
  - R: R3's gate, R4, R5, R6.
- **Diverged / resolved:** B6 folds into `get_section` paths. U2 is verified by `HostLoggingTests` in code; confirming it on a device in Seq is still open.
- **Out of scope by decision:** P6 (download inventory).
- **Still open:**
  - A13, A24–A26, N4–N6 and B13: the quality workstream. Navigation lookup (`find_screen`) shipped in HelpApi `6185423` from that workstream.
  - D6: `device-snapshots` stays outside bicep.
  - Verification: the end-to-end device chat, and the Core release artifact registration re-run.

**Deployed builds at the time of the original check**

| App | Image / build | Latest commit on `main` |
|-----|---------------|-------------------------|
| HelpApi `dmxcore-portal-helpapi-001` rev `0000002` | `dmxcore-helpapi:bd6bcd2` (`/api/Version` 1.0.5+bd6bcd2) | `bd6bcd2` ✅ |
| Portal `dmxcore-portal-app-001` rev `0000133` | Deploy run for `31adfea` succeeded 04:00Z; revision created 04:04Z | `31adfea` ✅ |
| DeviceApi `dmxcore-portal-deviceapi-001` rev `0000039` | `dmxcore-deviceapi:44028e05` | `44028e0` ✅ |
| Docs (Static Web Apps) | Deploy run for `be6f663` succeeded; `/api/corpus` reports commit `be6f663`, 98 pages / 531 chunks / 89 screenshots | `be6f663` ✅ |
| Core | Tags `v2026.914.1` (contains #128), `v2026.914.2` and `.3` (also contain #129 and #130) | `26b4aae1` |

**Status legend:**
- **Done:** built, tested and deployed.
- **Built:** built but not deployed or not enabled.
- **Partial:** part of it is missing.
- **Not started.**
- **Diverged:** built differently from the plan.
- **OOS:** out of scope, or a non-goal.

## Summary

| Status | Count |
|--------|------:|
| Done | 61 |
| Built, not deployed | 2 |
| Partial | 15 |
| Not started | 21 |
| Diverged | 6 |
| Out of scope / non-goal (confirmed not violated) | 7 |
| **Total** | **112** |

Almost all of the gap is the **signed-in, device-aware chat** (section B below: 13 of the 21 "Not started" rows). Its data path works end to end, from Core through DeviceApi to the portal endpoints. What's missing: nothing in HelpApi or the portal UI uses those endpoints, and no credential design would let HelpApi call them.

---

## A. Phase 1 - docs copilot

| # | Requirement | Status | Evidence |
|---|-------------|--------|----------|
| A1 | Corpus index chunked by heading with slug, title, heading path, screenshots | Done | Docs `scripts/build-help-index.mjs`, `scripts/help-index/markdown.mjs` (chunk `id`, `headingPath`, `screenshots`); tests `markdown.test.mjs`, `build-index.test.mjs`; `8e6c1bf`; live index 531 chunks |
| A2 | Screenshot catalog from the capture scripts' `SHOTS` plus markdown image refs | Done | `scripts/help-index/screenshots.mjs`; `screenshots.test.mjs` (guards that the real capture scripts still parse); live index has 89 screenshots |
| A3 | Rebuild on every docs deploy, plus reindex webhook | Done | Docs `.github/workflows/deploy.yml`, step "Refresh the docs copilot index" (retries until `status.commit == GITHUB_SHA`). HelpApi `CorpusController` reindex with `X-Service-Token`, hourly conditional-GET poll in `CorpusRefreshService`. Run for `be6f663` matched on the first attempt |
| A4 | Pin the corpus to the published docs | Done | Index is built in the deploy and served from `docs.dmxcore.com/help-index.json` (`Corpus:IndexUrl`) |
| A5 | Don't put the whole docs tree in the prompt | Done | Retrieval happens through tools; `MaxHistoryMessages` 12 |
| A6 | Chat API on Azure Container Apps, scale to zero | Done | `infra/bicep/modules/container-app.bicep`; live replicas 0–1 |
| A7 | Streaming chat (SSE) | Done | `SessionsController.PostMessage`; `SessionsApiTests.A_turn_streams_persists_and_accepts_checkbox_patches_that_reach_the_next_turn` |
| A8 | System prompt: how-to only, cite or say you don't know, never invent menus, emit a walkthrough | Done | `HelpApi/Chat/SystemPrompt.cs` (`72b6c10`, `b4fe252`, `bd6bcd2`) |
| A9 | Tool `search_docs` | Done | `DocsToolbox`; BM25 in `Search/Bm25Index.cs`, headings weighted ×3; `DocsCorpusTests` |
| A10 | Tool `get_page` | Done | `DocsToolbox`; `DocsCorpusTests` (sections, truncation) |
| A11 | Tool `get_screenshot` | Done | `DocsToolbox` |
| A12 | Structured walkthrough tool `show_walkthrough`, validated (not named in the plans) | Done | `Walkthroughs/WalkthroughValidator.cs`; `WalkthroughValidatorTests` (7) |
| A13 | Embeddings over chunks | Not started | `Bm25Index.cs:8` says "Embeddings can replace this later". The plan allows BM25 for v0. **Quality workstream.** |
| A14 | Azure OpenAI pay-as-you-go, not PTU | Done | `dmxcore-portal-help-oai-001`: `gpt-4.1-mini` 2025-04-14, GlobalStandard, 50K TPM, local auth disabled |
| A15 | Daily spend cap / abuse ceiling | Partial | No Cost Management budget at resource-group or subscription scope (both lists empty). `DailyTurnLimit` 1000 is kept **in memory** (`Chat/TurnGate.cs`), so it resets after every scale-to-zero. Only the 50K TPM limit is a hard ceiling |
| A16 | Rate-limit the public endpoint | Done | `Controllers/RateLimitPolicies.cs`: 20 sessions per IP per hour, 20 turns per IP per 10 min, 120 reads per minute; 40 turns per session |
| A17 | Session store: messages, walkthrough progress, short-lived | Done | `Sessions/BlobSessionStore.cs` (ETag-safe); `help-sessions` lifecycle rule deletes after 30 days idle |
| A18 | Continue token is the session id, not a hardware id | Done | `Sessions/SessionIds.cs`: 16 random bytes as base64url, 22 chars, regex `^[A-Za-z0-9_-]{22}$` |
| A19 | Widget on the Starlight site | Done | `src/components/Footer.astro` → `HelpWidget.astro` → `src/help-widget/*`; live page renders `data-api="https://helpapi.dmxcore.com"` |
| A20 | Checklist from the walkthrough payload; checking a step PATCHes the session; the next turn sees completed ids | Done | `widget.js`, `api.js` `setStep`; `ChatOrchestrator.BuildTurnContext`; `ChatOrchestratorTests.Turn_context_lists_the_page_completed_steps_and_the_next_step`. No unit test for the widget's `setStep` |
| A21 | CTA **Continue with my device** deep link | Built | `widget.js:665-672` adds `?continue={sessionId}`. Hidden in prod: repo variable `HELP_CONTINUE_URL` is not set, and the live page has an empty `data-continue`. Local builds fall back to `https://portal.dmxcore.com/help` (`HelpWidget.astro:9`) |
| A22 | CORS allows `docs.dmxcore.com` | Done | `appsettings.json:22`, `prod.bicepparam:16`; `SessionsApiTests` CORS test; live preflight returns ACAO `https://docs.dmxcore.com` |
| A23 | Model key lives in Azure, never in the static site | Done | Managed identity with the OpenAI User role; `disableLocalAuth: true` |
| A24 | Recipes in `docs/howto-recipes/` using the `AGENTS.md` format | Partial | 6 recipes (2 synthetic gold paths, 1 confirmed from a ticket) plus `AGENTS.md`, `README.md`, `_template.md`. **Quality workstream.** |
| A25 | Recipe eval harness | Partial | `HelpApi/HelpApi.Evals/` is **untracked** in git, not in `HelpApi.slnx` or CI. **Quality workstream.** |
| A26 | Model comparison on the evals | Not started | **Quality workstream.** |
| A27 | Chat API host name | Diverged | Plan: `help.dmxcore.com` or similar. Built: `helpapi.dmxcore.com`, managed cert pinned (`da50765`). The plan should change |
| A28 | Transcripts, feedback and PII redaction (not in the plans) | Partial | `Transcripts/TranscriptRecorder.cs`, `PiiRedactor.cs`; `help-transcripts` kept 365 days; `PiiRedactorTests`. **Gaps:** `ToolTrace.Errors` and the stored `Walkthrough` labels are not redacted. `DocsToolbox.cs:305` logs model-written label text to Seq (`Rejected walkthrough: {Errors}`), against HelpApi's own "no question/answer text in Seq" rule |
| A29 | Checklist validation of UI names and menu paths against the docs text | Done | `bd6bcd2`; `Corpus/UiNames.cs`, `WalkthroughValidator.UiTextProblems`; `WalkthroughValidatorTests.Invented_menu_paths_and_ui_names_are_rejected`. Only step labels are checked, not titles or prose |

## N. Navigation document (Core #129)

| # | Requirement | Status | Evidence |
|---|-------------|--------|----------|
| N1 | Generate `docs/generated/navigation.yaml` (`format: dmxcore-navigation`) from source | Done | Core `src/NavigationDoc/` plus `ClientApp/scripts/extract-navigation.mjs`; `96c5e43d`, `b82b2483`; 137 screens (86 web, 51 Uno). No generator tests; CI `--check` is the only guard |
| N2 | Ship it inside the app (`Shared.csproj` content) | Done | `Shared.csproj` Content item with link `navigation.yaml`; in tags `v2026.914.2` and later. Not checked in the Balena publish output |
| N3 | Pipeline artifact plus a stale warning in CI | Built | `.azure/pipelines/build.yml`, step "Generate navigation document", artifact `Navigation`. **No Azure Pipelines run was checked** (the local `az devops` defaults point at a different org) |
| N4 | Pin to the release the docs describe and deliver it to the index or HelpApi | Not started | No reference in Docs or HelpApi. DmxCore100-Software is **private** with no GitHub releases, so the file exists only at git tags, in the private pipeline artifact and in installed apps. Quality workstream dependency |
| N5 | Screen/field/action lookup tool | Not started | **Quality workstream.** |
| N6 | Validator treats the navigation document as the authority | Not started | **Quality workstream.** |
| N7 | Screenshot ids in the navigation document | Diverged | #129 closing comment: no screenshot ids; join on `route` (web) or `id` (Uno). The plan should change |

## U. User activity in Seq (Core #130)

| # | Requirement | Status | Evidence |
|---|-------------|--------|----------|
| U1 | Debug `UserActivity` events from Web, Uno, Integration and MCP, with source, entity, verb, id, name, outcome and elapsed time; user names only in properties | Done | `src/Shared/UserActivities/UserActivityLog.cs` (`LogDebug("Activity {UserActivity}")`, other properties via scope); `UserActivityFilter`, `SessionManager.RecordActivity`, `IntegrationApi.ExecuteCore`, `McpUserActivityFilter`; `UserActivityTests` (coverage, rendering without the user), `ControllerAuthorizationTests.DenialIsRecordedAsUserActivity`; `72917354`, in `v2026.914.2` and later. AdminPortal #28 comment: `Activity Web > List Config Issues` seen from a prod device |
| U2 | Events reach Seq from **Release touchscreen (UnoHost) builds** | Partial | Serilog Seq sink is Verbose, but Release UnoHost sets `SetMinimumLevel(Warning)` inside Uno `UseLogging` before `UseSerilog`. Whether `IsEnabled(Debug)` holds is unverified, and no Uno activity event has been seen in prod |
| U3 | Portal logs endpoint adds up to 30 activity events | Done | `SeqLogQueryClient.BuildActivityFilter`; `SeqLogQueryTests.BuildActivityFilter_ScopesToDevice_AndMatchesUserActivity`; `c60c021`; deployed |
| U4 | Activity paths match the navigation document | Diverged | Only **Uno** paths match (`user-activities-uno.txt` is generated from the navigation model). Web names come from controller methods (`Web > Preset > Get`), not screens (`Web > Lighting > Presets > Details`). The plan should change; mapping them is quality work |
| U5 | Auto-check walkthrough steps from activity events | OOS | Plan: "later option, not v1". Nothing built |

## C. Core config snapshot (§2, #128)

| # | Requirement | Status | Evidence |
|---|-------------|--------|----------|
| C1 | `SnapshotNow` hub handler → `IMessageServer.TriggerConfigSnapshot()`, fire-and-forget, TUS `FileType=CONFIGSNAPSHOT` | Done | `TunnelService.HandleSnapshotNowAsync`; `MessageServer.TriggerConfigSnapshot` (non-blocking semaphore); `BackupManager.UploadConfigSnapshot` with metadata `CaptureId`, `CapturedAt`, `SnapshotFormat`, `SnapshotVersion`; `1f087698`, first in `v2026.914.1`; wire-verified on device 2124a17 (AdminPortal #28 comment) |
| C2 | Folder of JSON; `format: dmxcore-config-snapshot`, `version: 1`; `manifest.json` | Done | `src/Shared/ConfigSnapshot/ConfigSnapshotBuilder.cs`, `SnapshotManifest.cs`. The manifest is written **last**, with per-section `path`, `bytes`, `count` and `summary` |
| C3 | Sections per the plan's file map | Done | device, settings, protocol, inputs, outputs, fixtures, `profiles/index.json`, `profiles/{id}.json`, cues, presets, sounds, `timelines/index.json`, `timelines/{code}.json`, schedules, triggers. Extra: `zones.json`, `plugins.json`, `control-surfaces.json` |
| C4 | Empty sections omitted; manifest always present | Done | `SnapshotSectionWriter.WriteList`; `Build_FreshInstall_WritesValidManifest` |
| C5 | Named HostConfig allowlist; secrets become booleans | Done | `HostConfigSnapshotAllowlist.cs` has the plan's 46 allowed names; the deny list is a superset. `screenUnlockConfigured`, `vncPasswordConfigured`, `externalMqttHasPassword` (the plan says `hasPassword`) |
| C6 | Test: every HostConfig property is allowed or denied | Done | `ConfigSnapshotTests.HostConfig_EveryPublicPropertyIsClassified` |
| C7 | Test: no PIN, JWT, API key or MQTT password in any section | Done | `Build_LoadedShow_NoSecretsAndKeepsAddresses` searches the zip for PIN, VNC, MQTT, JWT, client key, license, content hashes and trigger payload. API keys and user hashes are never read by the source (`ConfigSnapshotSource` has no Users or Api members) |
| C8 | Test: manifest lists only files in the zip | Done | Same test compares the manifest with the zip entries |
| C9 | Test: an empty show produces a valid **zip** plus manifest | Partial | `Build_FreshInstall_WritesValidManifest` checks the folder and never builds or reads the zip |
| C10 | Excludes: cue/sound files, `Preset.Content`, visualizer photos, keys, hashes, plugin setting values, logs, SQLite, whole HostConfig | Done | Projections checked. Worth a review: `outputs.json` has `Output.Options` (a free-form plugin dictionary), `fixtures.json` has `CustomOptions`, `triggers.json` has `InputJsonPath` and `Address` |
| C11 | Snapshot file names acceptable to the cloud | Partial | `ConfigSnapshotBuilder.SafeFileName` only replaces invalid file-name characters and `/`. Timeline `code` is free text (`TimelineDetails.vue:32`). A code with a space, `+`, `:`, a non-ASCII letter or a leading `.`/`-` fails DeviceApi's segment regex, and **the whole capture is rejected** (see D7) |
| C12 | `PluginFeeds` deferred | Done | On the deny list with a comment |
| C13 | No local help-agent toggle on the device | Done | No setting; the portal grant is the consent |

## D. DeviceApi relay (§3)

| # | Requirement | Status | Evidence |
|---|-------------|--------|----------|
| D1 | `SnapshotNow` pushed on the device hub; 409 when not connected | Done | `Controllers/ConfigSnapshotApiController.TriggerAsync`; `44028e0`, deployed rev `0000039`. Returns 202 without waiting, so DeviceApi never returns 503 (the portal maps other failures to 503) |
| D2 | `FileTypes.ConfigSnapshot` accepted in `OnBeforeCreateAsync` | Done | `Program.cs:223`; `ConfigSnapshotArchiveTests.FileType_ParsesUploadMetadataString` |
| D3 | Unpack to `device-snapshots/{serial}/{captureId}/…`, keep the zip, write the manifest last | Done | `Services/ConfigSnapshotStore.cs`, `ConfigSnapshotArchive.cs` (zip-slip checks, 2000 entries, 16 MB per entry, 128 MB total); `PlanSectionUploads_UnpacksUnderSerialAndCapture_ManifestLast`, `ReadEntries_UnsafePath_Throws` |
| D4 | Keep the newest 5 captures | Done | `ConfigSnapshot:KeepCaptures`; `SelectCapturesToPrune_KeepsNewestN`; captures without a manifest are removed after 1 hour |
| D5 | Service-token admin API: trigger, latest, one section | Done | `ConfigSnapshotApiController` with `PortalServiceTokenAuth`. Latest returns `sections[{path,sizeBytes}]` including `manifest.json` |
| D6 | `device-snapshots` container in bicep | Diverged | Not in any bicep. Created at startup (`ConfigSnapshotStore.EnsureContainer`). It exists in storage account `DMXCore/dmxcorefiles`, which DeviceApi's bicep doesn't manage (`device-backups` isn't in bicep either). The plan should change |
| D7 | A rejected capture is visible to someone (not in the plan) | Partial | `Program.cs:280` catches `InvalidDataException` and logs a warning only. The TUS upload still completes, Core logs success, and the portal keeps showing the old capture |
| D8 | Tests per §5: trigger 202/409, TUS rejects unknown types, unpack paths, pruning | Partial | Unpack and prune: done (23 tests). **No** controller tests for 202/409 and **no** TUS test for unknown types. `Enum.Parse` on an unknown `FileType` throws instead of failing cleanly (this predates the feature) |

## P. Admin Portal (§4)

| # | Requirement | Status | Evidence |
|---|-------------|--------|----------|
| P1 | `Device.HelpAgentSnapshotEnabled` / `HelpAgentLogsEnabled`, default false, plus EF migration | Done | `Device.cs:164,171`; migration `20260915004754_AddHelpAgent`; `b484c42`; deployed |
| P2 | Grants need `devices.operate`; a Viewer can't grant | Done | `DeviceHelpAgentController.SetGrants` / `TriggerSnapshot` policy; `Viewer_CannotGrantOrCapture` checks the attribute and role, but no real Viewer login and no HTTP pipeline test |
| P3 | Audit `help-agent.snapshot.*` / `help-agent.logs.*` | Done | `SetGrants_AuditsOnlyChangedFlags`, `SetGrants_Disable_AuditsDisabled`. Extra verbs: `help-agent.snapshot.triggered`, `help-agent.session.attached` |
| P4 | Every read re-checks the grant, so a revoke applies on the next read | Done (portal side) | `HelpAgentSessionsControllerTests.Get_ReflectsRevokedGrant_OnNextRead`; section and logs endpoints return 403 with the grant off. HelpApi side: see B8 |
| P5 | Device page card: two controls, copy text, **Capture snapshot**, last capture plus Refresh, **Ask for help**; only when a HWID is set | Done | `frontend/src/views/DeviceDetail.vue:387-457` (checkboxes rather than switches) |
| P6 | "Download inventory" (rollout stage C) | Not started | No download action in the card or the API |
| P7 | `IConfigSnapshotClient` mirrors the cloud backup client | Done | `AdminPortal.Services/ConfigSnapshot/ConfigSnapshotClient.cs`; `MainWebApi:BaseUrl` plus KV `mainwebapi-service-token`; `HelpAgentTypedClientActivationTests` |
| P7a | `POST /devices/{id}/help-agent/snapshot`: 403 grant off, 409 offline | Done | `TriggerSnapshot_GrantOff_Returns403_AndNeverCallsDeviceApi`, `TriggerSnapshot_Offline_Returns409`, `TriggerSnapshot_GrantOn_Online_Returns202_AndAudits` |
| P8 | `GET` latest capture and `GET …/snapshot/{captureId}/{**section}` | Done | `GetSection_GrantOn_ReturnsManifestJson`, `GetSection_GrantOff_Returns403_WithoutReading`, `GetSection_InvalidPath_Returns400`. Nested paths (`profiles/12.json`) are allowed but have no test |
| P9 | `PUT /devices/{id}/help-agent` | Diverged | Doesn't require a HWID (the plan says HWID is required on every endpoint). Harmless, since the card is hidden without one. The plan should change |
| P10 | `GET /devices/{id}/help-agent/logs` | Done | `GetRecentLogs`; `GetRecentLogs_GrantOn_QueriesByTwelveCharHardwareId`; deployed; prod-verified (~93 events from 36 sources, #28 comment) |
| P11 | Seq rules: this device only, 2 h window, about 100 events, Warning and above always, Information filtered, `ClientIp` stripped, exceptions truncated | Diverged | Built with an exclude list for web-server noise plus a **`Service = 'DmxCore100'`** scope and 5 Information events per source (`e0885da`, `10074e9`). **No `MachineName` fallback.** The code is better than the plan, and `AdminPortal/docs/help-agent.md` already describes it. The plan should change |
| P12 | Seq API key server-side only, a read key | Done | KV `help-agent-seq-api-key` exists; env `HelpAgent__Seq__ServerUrl`/`ApiKey` on the portal app; `cfdd4aa` |
| P13 | Seq never queried with the logs grant off | Done | `GetRecentLogs_GrantOff_NeverQueriesSeq` (mocked Seq) |
| P14 | Session context `GET`/`PUT /api/help-agent/sessions/{sessionId}` | Done | `HelpAgentSessionsController`; `HelpAgentSession` table with a unique `SessionId`; `tools` from `HelpAgentTools.For`; 8 tests. Viewers (`devices.view`) can claim sessions and read sections and logs |
| P15 | Docs handoff: `/help?continue=` → sign-in keeps `next` → device picker → grants → claim | Done | `router/index.ts:155-162,332`, `Login.vue`, `views/HelpAgent.vue`; prod-verified 2026-09-15 on device 2456325 (#28 comment). Not reachable from docs yet (A21) |
| P16 | **Ask for help** opens the chat scoped to the device | Partial | `/help?device={id}` works, but `HelpAgent.vue:161-163` creates a **32-char hex** id (`crypto.randomUUID()`). HelpApi rejects that id and it never exists there. After the claim the page shows only a summary; there is no chat (B11) |
| P17 | Session lifecycle (not in the plans) | Partial | No retention for `HelpAgentSession` rows. `Restrict` FK, so `DeviceDataManager.DeleteAsync` hard-delete fails for a device with a session. Moving a device to another account doesn't update its session. Two concurrent first claims hit the unique index and return 500 |
| P18 | Cloud tests per §5 | Partial | Backend: 41 tests pass. No HTTP authorization pipeline test, no `SeqLogQueryClient.GetRecentAsync` merge test. **No frontend tests** for the card or `/help` |

## B. Signed-in, device-aware chat (implementation plan §4 "Signed-in chat", build order steps 6–7, rollout stages D–E)

| # | Requirement | Status | Evidence |
|---|-------------|--------|----------|
| B1 | Portal sign-in for the chat API (a credential HelpApi can use) | Not started | HelpApi has no authentication (`grep Jwt/Bearer`: only the Azure OpenAI MI token). The design "the orchestrator holds the user's portal JWT" (`AdminPortal/docs/help-agent.md:38`) has nothing behind it: access tokens last **15 min** with zero clock skew (`appsettings.json` `ExpiryMinutes: 15`), refresh uses an HttpOnly `SameSite=Strict` cookie on path `/api/auth`, and nothing sends a token to HelpApi |
| B2 | HelpApi reads the portal session context every turn | Not started | No portal client in HelpApi; `ChatSession` has no device, user or binding |
| B3 | Tools registered per turn from the grants | Not started | `DocsToolbox.Declarations` is a static list (`ChatOrchestrator.cs:49-56`). The README's "Phase 2 hooks" overstates what exists |
| B4 | Tool `list_sections` | Not started | - |
| B5 | Tool `get_section` | Not started | - |
| B6 | Tools `get_profile` / `get_timeline` | Not started | The portal's `tools` list never includes them. Recommendation: drop them for `get_section` with paths `profiles/{id}.json` and `timelines/{code}.json`, and change the plan |
| B7 | Tool `get_recent_logs` behind the logs grant, including user activity | Not started | Portal endpoint exists (P10); nothing in HelpApi |
| B8 | A revoke drops tools on the next turn, end to end | Not started | Portal side done (P4) |
| B9 | Device-aware transcripts keep the same redaction, with no section content stored | Not started | Today `ToolTrace.Results` stores ids only, which is the right basis. The redaction gaps in A28 apply |
| B10 | HelpApi CORS for `portal.dmxcore.com` with an `Authorization` header | Not started | `Program.cs:74-76`: docs origin only, `Content-Type` header only. Live preflight from the portal origin returns 204 with **no** `Access-Control-Allow-Origin` |
| B11 | Chat view inside the portal (`/help`) | Not started | `HelpAgent.vue` "done" step shows device, tools and session id. No message list, SSE client or HelpApi URL (`VITE_*` env has none) |
| B12 | A session continued in the portal can't be read anonymously from the docs widget (not in the plans) | Not started | `GET /api/sessions/{id}` is unauthenticated, and the session id is the only credential |
| B13 | Phase 2 worked examples (Robe Spot at address 100; Art-Net 5–7 from Lightkey) against real snapshots | Not started | **Quality workstream** (evals), after B4–B7 |

## R. Rollout (§6)

| # | Stage | Status | Evidence |
|---|-------|--------|----------|
| R1 | A: Core builder plus `SnapshotNow` | Done | `v2026.914.1` |
| R2 | B: DeviceApi enum, unpack and trigger | Done | Rev `0000039` (`44028e0`) |
| R3 | C: Portal grant card, capture button, download inventory | Partial | Download inventory is missing (P6) |
| R4 | D: Handoff plus signed-in chat tools | Partial | Handoff done (P15); chat not started (B) |
| R5 | E: Seq tool | Partial | Portal endpoint done; HelpApi tool not started |
| R6 | Old Core with new cloud: portal shows "update device software" | Not started | DeviceApi returns 202 even when the device has no handler; no version gate. The portal shows "Snapshot requested" and nothing arrives |
| R7 | New Core with old cloud: `CONFIGSNAPSHOT` rejected until DeviceApi ships | Done | Moot: DeviceApi shipped before any Core release used it |

## I. Issue split (§7)

| # | Item | Status | Evidence |
|---|------|--------|----------|
| I1 | DmxCore100-Software #128 | Done | Closed 2026-09-15 |
| I2 | DmxCore100-Software #129 | Done | Closed 2026-09-15 |
| I3 | DmxCore100-Software #130 | Done | Closed 2026-09-15 |
| I4 | AdminPortal #28 | Done | **Closed** 2026-09-15, with two verification comments. The implementation plan's §7 still says "open" |
| I5 | Docs + HelpApi signed-in chat issue | Not started | None filed. Proposed split in the gap plan |

## NG. Non-goals, checked against the code

| # | Non-goal | Status | Evidence |
|---|----------|--------|----------|
| NG1 | Writable MCP / "do the setup for me" | OOS ✅ | No HelpApi tool writes. The system prompt forbids suggesting MCP or the Integration API. The only portal writes (grants, capture) are user actions behind `devices.operate` |
| NG2 | Backup zip or SQLite fed to the model | OOS ✅ | The snapshot is a separate format in a separate container. HelpApi reads nothing from `device-backups` |
| NG3 | LLM on the CM4 | OOS ✅ | No model code in Core |
| NG4 | Typed hardware id as proof of ownership | OOS ✅ | The portal uses the stored `Device.HardwareIdentity`; the continue token is a random session id. No endpoint takes a pasted HWID |
| NG5 | Reusing Enable MCP Server or the MCP cloud-relay card | OOS ✅ | Separate Help agent card and separate grant flags |
| NG6 | Phase 3 actuating agent | OOS ✅ | Nothing built |

---

## Contract checks (end to end)

| Hop | Result | Detail |
|-----|--------|--------|
| Docs widget → `/help?continue={sessionId}` | ⚠ built, hidden | CTA code works; `HELP_CONTINUE_URL` unset in prod |
| `/help` → sign-in → `PUT /api/help-agent/sessions/{id}` | ✅ | Router keeps the query through `?next=`, including MFA/SSO (`Login.vue`). The portal regex `^[A-Za-z0-9_-]{8,100}$` accepts HelpApi's 22-char base64url ids. First claimer owns the session; others get 404 |
| Portal-originated session id → HelpApi | ❌ | **Ask for help** creates 32-char hex ids; HelpApi requires `{22}` and has no create-with-id |
| Orchestrator → `GET /api/help-agent/sessions/{id}` each turn | ❌ | Not built, and no working credential (B1). Server-to-server calls don't need CORS, but they need a token HelpApi can get and renew. The user JWT can't be renewed outside the browser |
| Tools → portal endpoints | ⚠ half | Portal endpoints exist for user JWTs (`devices.view`); no HelpApi caller |
| Portal → DeviceApi → Core (snapshot) | ✅ with defects | Wire-verified 2026-09-14 (2124a17, manifest plus 9 sections). Every hop uses the full `HardwareIdentity` as serial (Seq alone uses the 12-char prefix); tunnel lookup is case-insensitive, blob paths aren't (casing unverified). Section paths pass through identical regexes (DeviceApi `TryNormalizeSectionPath`, portal `ConfigSnapshotPaths.IsValidSectionPath`), and nested segments are escaped one by one. Manifest `bytes` → DeviceApi `sizeBytes` → portal `SizeBytes` → frontend `sizeBytes` is consistent. **Defects:** timeline file names (C11); silent rejection (D7); no version gate (R6) |
| CORS | ❌ for portal | HelpApi allows only the docs origin with `Content-Type`. The portal allows only localhost dev origins (not needed while the SPA is same-origin) |
| Model never sees JWT, service token or Seq key | ✅ (vacuously) | No code path hands any credential to HelpApi or the model yet. The gap plan keeps it that way |
| Grant revocation on the next turn | ⚠ half | Portal re-checks per read; the HelpApi per-turn read is missing |
| `UserActivity` event ↔ portal Seq query | ✅ with caveats | Template `Activity {UserActivity}`, `SourceContext` = `UserActivity`, `Has(UserActivity)`, user names only in properties. **Caveats:** the portal filters on `Service = 'DmxCore100'`, which **Core doesn't emit** (probably attached by the Seq ingestion key; unverified and not in `cross-repo-overview.md`). `HardwareId` is unset when a device id is 12 characters or shorter. Release UnoHost Debug delivery is unverified (U2) |
| `navigation.yaml` → HelpApi | ❌ | No delivery path. It ships in app content (`v2026.914.2` and later) and the private pipeline artifact; the repo is private with no releases. The committed copy can be stale relative to the CI artifact (warning only) |
| Transcripts for device tools | n/a yet | Existing design stores result ids only; errors and walkthrough labels need redaction (A28) |

## Divergences

| # | Plan says | Code does | Change |
|---|-----------|-----------|--------|
| 1 | Chat host `help.dmxcore.com` | `helpapi.dmxcore.com` | Plan |
| 2 | Embeddings for retrieval | BM25 (allowed for v0) | Neither for now; quality workstream decides |
| 3 | `device-snapshots` in bicep | Created at startup, in `dmxcorefiles`, which no bicep manages | Plan (optionally bring the account under IaC later) |
| 4 | DeviceApi trigger 202/409/503 | 202/409; portal maps failures to 503 | Plan |
| 5 | Seq: Information from an allowlist of app sources, `MachineName` fallback | Exclude list, 5 per source, `Service = 'DmxCore100'` scope, no fallback | Plan (already in `help-agent.md`); document `Service` in the cross-repo contract |
| 6 | HWID required on all portal help-agent endpoints | `PUT` grants and `GET` state don't need one | Plan |
| 7 | Activity paths match the navigation document | Only Uno paths match | Plan |
| 8 | Navigation document carries screenshot ids | Join on route/id instead | Plan |
| 9 | Tools `get_profile`, `get_timeline` | Portal lists only `list_sections`, `get_section`, `get_recent_logs` | Plan (use `get_section` with paths) |
| 10 | MQTT `hasPassword` | `externalMqttHasPassword` | Plan |
| 11 | Manifest "always first" | Written last (acts as the completion marker in DeviceApi) | Plan |
| 12 | Orchestrator holds the user's portal JWT server-side | Nothing built; not workable with 15-min tokens and cookie refresh | **Both**: a scoped help-agent token, see gap plan §1.2 |
| 13 | Ask for help → chat scoped to this device | 32-hex session id, no chat | **Code** |
| 14 | HelpApi README "Phase 2 hooks": Origin set, tools declared per turn | `Origin` is always `"docs"` and never returned; tool list is static | **Code** (and README) |
| 15 | Implementation plan §7: #28 open | Closed | Plan |

## Not in the plans

**Exists in code but no plan mentions it:**
- Transcripts and feedback: blob storage for 365 days, `tools/transcript-digest.ps1`.
- `show_walkthrough` validation and the UI-name/menu-path validator.
- The `HelpAgentSession` table and `GET …/help-agent` state endpoint.
- Audit verbs `snapshot.triggered` and `session.attached`.
- `zones.json`, `plugins.json`, `control-surfaces.json`.
- `docs/generated/user-activities-{web,uno}.txt`.
- Untracked `HelpApi.Evals/`.
- HelpApi `GET /`.

**Assumed by code or docs but provided by no repo:**
- A user JWT reaching HelpApi.
- The portal "resuming via HelpApi `GET /api/sessions/{id}`": the portal never calls HelpApi.
- The Seq `Service` property.
- A release-pinned `navigation.yaml`.
- A cost budget alert (README step, none exists).

## Open operational items

- **Key Vault** `kv-dmxcore-prod-001`: `helpapi-seq-api-key`, `helpapi-service-token` and `help-agent-seq-api-key` exist. The gap plan needs a new `help-agent-token-key`.
- **Docs repo:** variable `HELP_API_URL` and secret `HELP_API_SERVICE_TOKEN` are set; `HELP_CONTINUE_URL` is not (intentionally, until the portal chat exists).
- **Cost:** no Cost Management budget on `rg-dmxcore-portal-prod` or the subscription. OpenAI capacity is 50K TPM with `versionUpgradeOption: OnceNewDefaultVersionAvailable`.
- **Unchecked:**
  - The `Navigation` artifact in an Azure Pipelines run.
  - `navigation.yaml` in the Balena publish output.
  - Release UnoHost activity events in Seq.
  - Where the Seq `Service` property is attached.
- **Housekeeping:**
  - `HelpApi.Evals/` is untracked.
  - `extract-navigation.mjs` header names the wrong path (`src/Tools/NavigationDoc`).
  - `ConditionTranslator.cs` and Docs `src/help-widget/markdown.js` contain literal NUL characters, so git shows them as binary.
  - `UserActivityNaming.cs` refers to a test class that doesn't exist.
- **Plan text:** the Status table in `howto-chat-plan.md` is updated to this assessment. `howto-chat-implementation-plan.md` §7 (#28 open) and the divergences above are listed for the next plan edit.
