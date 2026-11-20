# π-rate i-Land

A responsive computer-based testing workspace for Classes VIII, IX, X, XI, XII, and JEE Main. Built with React, TypeScript, Vite, Tailwind CSS, and KaTeX.

## Explore the workspace

The home page opens a sample student dashboard. Open the account menu for student or admin login, or use **Admin login** in the footer.

| Demo account | Email | Password |
| --- | --- | --- |
| Student — Aarav Sharma | `student@pirate.school` | `Student@123` |
| Administrator — Meera Patel | `admin@pirate.school` | `Admin@123` |

The login screen also has one-click demo access. New student accounts start with an empty result history. Their passwords are stored as salted PBKDF2-SHA-256 hashes.

## Features

- **Test library:** class and subject filters, search, sorting, nine chapter tests, and one 75-question JEE Main practice mock.
- **Exam workspace:** absolute-deadline timer, saved responses, review flags, question navigator, save/resume, submission confirmation, and time-up submission.
- **Student insights:** marks, correct/incorrect/unanswered counts, answer explanations, score trends, accuracy, subject breakdowns, time spent, personal bests, and CSV exports.
- **Admin workspace:** author papers, upload `.tex` files, preview typeset mathematics, configure timing and penalties, manage publication status, and review student submissions.
- **Accessible interface:** labeled controls, keyboard-operable dialogs with focus trapping, responsive layouts, reduced-motion support, and local assets.

## LaTeX question papers

Choose **Admin → Create paper** or **Upload LaTeX**. Type or upload an exam-class-style paper, preview the rendered questions, then publish. A template is available in the editor and in `public/latex-question-template.tex`.

```tex
\begin{questions}
\question[4] Find $\frac{d}{dx}x^2$ at $x=3$.
\begin{choices}
  \choice $3$
  \CorrectChoice $6$
  \choice $9$
\end{choices}
\begin{solution}The derivative is $2x$, so the answer is $6$.\end{solution}
\end{questions}
```

Each question accepts 2–8 choices, exactly one `\CorrectChoice`, an optional mark value (default 4), and an optional solution. Papers can contain up to 200 questions. The file limit is 1 MB. Inline and display math use KaTeX; this is a supported LaTeX subset, not a general-purpose TeX compiler. External files, arbitrary macros, and shell commands are not executed.

## Data and deployment scope

The existing interface now uses a transactional database for accounts, papers (including LaTeX), saved tests, results, and notification preferences. The six sample results and ten original papers are seeded only once.

**Local or persistent-volume hosting:** `npm run dev` and `npm run preview` serve `/api/database` and create a shared SQLite database at `.data/pi-rate-i-land.sqlite`. Set `SQLITE_PATH` to use a different persistent volume. Keep the database outside the public directory and back it up. Server restarts, browser changes, and rebuilds do not reset the database.

**Shared database on Vercel:** configure `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` as server-only project environment variables, then redeploy. Both accounts and exam data are then shared across devices, with server-side role checks, per-user result access, hashed passwords, expiring HttpOnly session cookies, and atomic result submission. The schema is created automatically. Never prefix database secrets with `VITE_`. See `.env.example`.

**Hosted demo without database credentials:** the same interface uses IndexedDB with separate indexed stores and atomic transactions, not local storage or an ephemeral serverless file. This mode is per browser; it does not claim to synchronize devices. An unavailable configured SQL database reports an error rather than silently switching to another data store.

**Upgrade:** legacy browser records are migrated to IndexedDB in a single transaction before their old copies are removed. When enabling shared SQL, sign in to the original account on the original browser to import its history and active test; the admin’s original browser imports its paper changes. Existing student passwords are verified before migrating their accounts. Imports are idempotent. Public demo administrator access remains for demonstration; to disable it, set `PIRATE_ADMIN_PASSWORD` before initializing a shared database. The platform remains a practice workspace, not a high-stakes proctoring system.

## Development and verification

```sh
npm install
npm run dev
npm run lint
npm run build
```

`dist/` contains the static production build. `vercel.json` configures browser-router fallbacks.

A Playwright acceptance test in `scripts/smoke_test.py` runs against the built assets without a dev server:

```sh
python scripts/smoke_test.py
```

It covers level filters, date-range analytics, login, account creation, role-specific navigation, LaTeX uploads and previews, publishing, exam resume, score calculations, penalties, timeout submission, result isolation, CSV export, and mobile layouts.
