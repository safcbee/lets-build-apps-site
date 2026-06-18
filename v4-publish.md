CODEX GOAL — Publish Website V4 to apps.leary.cloud and Verify Live Deployment

Mission

The V4 Let’s Build Apps website work is complete locally, but it is not confirmed live at:

https://apps.leary.cloud/

Your job is to safely publish the V4 static website, verify GitHub Pages/custom-domain deployment, and prove that the live public site matches the local V4 version.

This is not a design task.

This is a deployment, verification, and evidence task.

Current Known State

V4 was implemented locally but not deployed or pushed.

Known V4 local work includes:

* Product evidence/status update across all five app pages
* Homepage positioning update
* TestFlight interest paths
* Verified App Store CTAs for Sentences and Countdowns
* In-development status for Travel Plans, Good Habits, and Perfect Coffee
* Portaflow legacy redirect to Perfect Coffee
* V4 tests
* V4 reports
* V4 screenshot pack

Important: do not assume the live website is current. Prove it.

Repository

Website repo:

/Users/bri/projects/Codex Projects/Web

Target public domain:

https://apps.leary.cloud/

Expected GitHub Pages branch:

Likely master, but verify.

Phase 1 — Audit Local Git State

Run:

cd "/Users/bri/projects/Codex Projects/Web"
pwd
git status --short
git branch --show-current
git remote -v
git log --oneline -10
git rev-parse HEAD

Report:

* Current branch
* Current HEAD
* Remote origin URL
* Whether V4 files are staged, unstaged, or untracked
* Whether only expected leftovers exist
* Whether .DS_Store files are present

Do not push yet.

Phase 2 — Confirm V4 Files Exist Locally

Verify these exist:

reports/v4-product-evidence-audit.md
reports/v4-implementation-report.md
reports/v4-validation-report.md
reports/screenshots-v4/
tests/v4-readiness.test.mjs

Verify product routes exist:

index.html
sentences/index.html
countdowns/index.html
travel-plans/index.html
good-habits/index.html
perfect-coffee/index.html
privacy/index.html
portaflow/index.html

Verify the site contains V4-specific content:

* Simple apps for family life
* Available on App Store
* In Development
* Register interest in TestFlight
* Let's Build Perfect Coffee
* mailto:support@leary.cloud
* App Store URL for Sentences
* App Store URL for Countdowns

Phase 3 — Clean Local Junk Only

Remove or ignore local macOS junk only:

.DS_Store
assets/.DS_Store

Do not delete reports, screenshots, tests, or V4 assets.

If .DS_Store is not already ignored, add or update .gitignore with:

.DS_Store

Phase 4 — Run Full Local Validation Before Commit

Start local preview if needed:

python3 -m http.server 8000

Run:

node tests/home-search.test.mjs
node tests/countdowns-live.test.mjs
node tests/no-fake-social-proof.test.mjs
node tests/site-integrity.test.mjs
node tests/v4-readiness.test.mjs

Then run route checks against local preview:

/
 /sentences/
 /countdowns/
 /travel-plans/
 /good-habits/
 /perfect-coffee/
 /privacy/
 /portaflow/

All should return HTTP 200 locally.

If any test fails, fix only the deployment-blocking issue. Do not redesign.

Phase 5 — Stage and Commit V4

Stage the actual V4 website changes.

Use:

git add .
git status --short

Before committing, inspect staged changes:

git diff --cached --stat

Commit:

git commit -m "Publish V4 product evidence website"

If there is nothing to commit, explain why and show the latest commit containing V4.

Phase 6 — Push to GitHub

Push the branch used by GitHub Pages.

Likely:

git push origin master

But verify the actual branch first.

After push, record:

* Commit hash
* Branch pushed
* Remote pushed to
* Push result

Phase 7 — Verify GitHub Pages Configuration

Check GitHub Pages configuration manually or with available tooling.

Confirm:

* GitHub Pages is enabled
* Source is the branch just pushed
* Publishing directory is root /
* Custom domain is apps.leary.cloud
* HTTPS is enabled or pending
* Latest deployment completed successfully

If Pages is configured to a different branch, do not blindly change it without reporting the mismatch first.

If the repo cannot be inspected programmatically, provide exact manual instructions for checking:

GitHub repo → Settings → Pages

Phase 8 — Verify DNS / Custom Domain

Check whether apps.leary.cloud resolves correctly.

Run:

dig apps.leary.cloud
dig CNAME apps.leary.cloud
nslookup apps.leary.cloud

Report whether it points to GitHub Pages or an unexpected target.

Do not make DNS changes unless explicitly approved.

Phase 9 — Verify Live Site Content

After GitHub Pages has deployed, check the public site:

curl -I https://apps.leary.cloud/
curl -L https://apps.leary.cloud/ | head -80

Then check key routes:

https://apps.leary.cloud/
https://apps.leary.cloud/sentences/
https://apps.leary.cloud/countdowns/
https://apps.leary.cloud/travel-plans/
https://apps.leary.cloud/good-habits/
https://apps.leary.cloud/perfect-coffee/
https://apps.leary.cloud/privacy/
https://apps.leary.cloud/portaflow/

Verify live HTML contains:

* Simple apps for family life
* Available on App Store
* In Development
* Register interest in TestFlight
* Let's Build Perfect Coffee
* support@leary.cloud
* privacy@leary.cloud

Verify live HTML does not contain:

* Portaflow as a primary product card
* Get Started dead CTAs
* fake social proof
* Analytics
* old non-Leary support emails
* unsupported Collaborative Trips claim

Phase 10 — Capture Live Screenshots

Capture screenshots from the public live domain, not localhost.

Save to:

reports/screenshots-live-v4/

Desktop:

/
 /sentences/
 /countdowns/
 /travel-plans/
 /good-habits/
 /perfect-coffee/
 /privacy/
 /portaflow/

Mobile:

/
 /sentences/
 /countdowns/
 /travel-plans/
 /good-habits/
 /perfect-coffee/

The screenshots must be captured from:

https://apps.leary.cloud/

not:

http://localhost:8000/

Phase 11 — Create Live Deployment Report

Create:

reports/v4-live-deployment-report.md

Include:

Deployment Summary

* Commit hash deployed
* Branch pushed
* GitHub Pages source branch/folder
* Custom domain
* Deployment status
* Time checked

Live Route Results

Table:

Route	HTTP status	V4 content verified	Notes

DNS Results

Include:

* dig
* CNAME
* nslookup

Live Content Checks

Include pass/fail for:

* Homepage V4 hero
* Status pills
* TestFlight interest
* App Store links
* Perfect Coffee branding
* Portaflow redirect
* Privacy/support emails

Screenshot Evidence

List all screenshots in:

reports/screenshots-live-v4/

Remaining Issues

If anything is not live, explain exactly where the failure is:

* local git not pushed
* GitHub Pages wrong branch
* Pages deployment failed
* DNS wrong
* browser cache
* Cloudflare cache
* custom domain misconfigured

Phase 12 — Final Response Required

Return a clear summary:

1. Whether V4 is now pushed
2. Whether GitHub Pages deployed it
3. Whether https://apps.leary.cloud/ shows V4
4. Commit hash
5. Live route verification results
6. Screenshot paths
7. Any manual action needed

Critical Rules

* Do not redesign the site.
* Do not create V5.
* Do not modify product copy unless a live-deployment check fails because of missing V4 content.
* Do not add analytics.
* Do not add cookies.
* Do not add backend services.
* Do not change DNS without explicit approval.
* Do not claim the site is live until https://apps.leary.cloud/ has been checked directly.
* Do not use localhost screenshots as live evidence.
* Do not push if tests fail.
* Do not ignore GitHub Pages branch/domain mismatches.

Success Criteria

This goal is complete only when:

* V4 changes are committed and pushed.
* GitHub Pages deployment has completed.
* https://apps.leary.cloud/ publicly serves the V4 homepage.
* All key public routes work.
* Live screenshots are captured from the public domain.
* A live deployment report exists.
