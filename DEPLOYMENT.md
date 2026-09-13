# Deploy with GitHub Pages

The Pages version runs entirely in the browser. No Render account, Python
server, API key, or database is needed. The repository remains public.

## First deployment

1. Commit the project changes and push them to the repository's `main` branch.
2. Open the repository on GitHub and select **Settings → Pages**.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
4. Open **Actions → Deploy GitHub Pages → Run workflow**, select `main`, and
   run it. This also retries deployment if the initial push ran before Pages
   was enabled.
5. Wait for the workflow to finish successfully. Open the URL shown in the
   deployment result or **Settings → Pages → Visit site**.

The expected address is:

https://shaelynnnn.github.io/DNA-Sequence-Analyzer/

This address is only live after a successful deployment. Use GitHub's displayed
URL as the final source of truth.

## What the workflow does

`.github/workflows/pages.yml` installs frontend dependencies, runs tests and
lint, builds the React app, and publishes `frontend/dist`. It sets
`VITE_API_BASE_URL` to an empty value so the app uses browser analysis.
Subsequent pushes to `main` deploy automatically.

## Before submitting the link

- Open the site in a private browser window without signing in.
- Analyze `ATGC`: length 4, GC content 50%, complement TACG.
- Analyze `ATGN`: expected GC 37.5%, range 25–50%, reverse complement NCAT.
- Check invalid input and upload a single-record FASTA file.
- Check the page on a phone or narrow browser window.
- Submit the hosted website URL, not the repository URL.

The source repository is public by the owner's choice. Review any separate
coursework or application disclosure rules that apply to your submission.

## Troubleshooting

- **Pages workflow fails during configuration:** enable GitHub Actions as the
  Pages source, then rerun the workflow.
- **404:** confirm the workflow succeeded and use the full repository path.
- **Analysis asks for a backend:** deploy with `VITE_API_BASE_URL` empty. For
  local browser mode, remove any nonempty override in `frontend/.env.local`.

References: [GitHub Pages setup](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
and [Vite deployment guide](https://vite.dev/guide/static-deploy.html#github-pages).
