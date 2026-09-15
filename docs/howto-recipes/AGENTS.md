# Formatting how-to recipes from support interactions

When the user pastes a **support ticket, email, phone notes, or chat
transcript** and wants a recipe (or you are working in
`docs/howto-recipes/`), follow this file.

Product context: `docs/howto-chat-plan.md`. These recipes teach **how to
configure** the DMX Core 100. They do not control lights and they do not
apply settings for the user.

## Do this

1. **One recipe per distinct task.** If the thread covers “add a fixture”
   and “record Art-Net”, write two files.
2. Copy `_template.md` to `YYYY-MM-DD-kebab-slug.md` (UTC date of the
   interaction if known, otherwise today).
3. Fill every frontmatter field. Use `status: candidate` unless the user
   says otherwise.
4. Quote the user’s goal in their words (cleaned up), then the gold
   walkthrough the copilot should emit.
5. Bind each step to a **docs slug** and a **screenshot id** when one
   exists (`scripts/capture-web-screenshots.mjs` `SHOTS` `name`, or a
   `public/assets/web/*.png` / `public/assets/device/*.png` basename).
   If none exists, set `screenshotId: null` and add a line under Gaps.
6. List **gotchas** that the source mentioned or that the published docs
   already call out (Art-Net 0- vs 1-based, same-PC Art-Net ignore, etc.).
7. Add **eval checks**: exact Web UI / touchscreen menu paths, universe
   numbers, protocol names. These are what a later test harness will score.
8. Show the new file path in your reply. Do not invent extra recipes from
   the same thread unless the user asked for a sweep.

## Never put in a recipe

- Customer names, emails, phone numbers, company names
- Full hardware IDs, license strings, API keys, PINs, passwords
- Public IPs, exact street addresses (city/region is fine)
- Cue/sound file contents, backups, log dumps
- Anything the user would not want on a public Common Task page later

Replace with `[customer]`, `[device]`, `[site]`. If the source is only
PII, still write the **task** (“record three Art-Net universes from
Lightkey”) without the identity.

## Source field

`phone` | `email` | `ticket` | `chat` | `synthetic`

Use `synthetic` only for examples we invented (format demos). Real
phone/email/ticket/chat → `candidate`.

## Walkthrough JSON

The `walkthrough` fenced block must be valid JSON matching the copilot
payload:

```json
{
  "id": "kebab-id",
  "title": "Short title",
  "steps": [
    {
      "id": "step-kebab",
      "label": "Imperative sentence the user can check off",
      "docsUrl": "/dmx-core-100/lighting/fixture-setup/",
      "screenshotId": "add-fixture-profile"
    }
  ]
}
```

`docsUrl` is the public Starlight path (leading slash, trailing slash).
`screenshotId` is the capture-script `name` or `null`.

## After writing

- Do not add the recipe to the public Common Tasks sidebar unless the user
  asked to publish it.
- Do not change product code.
- If the published docs are wrong or missing a step, note that under Gaps
  instead of silently “fixing” it in the recipe only.
