# Eurveda information website

A standalone, static product story for GitHub Pages. No build step, account, API, database, analytics, or third-party runtime requests. Assets use relative paths so the site works under a repository path such as `/nsq/`.

## Preview

From the repository root:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory info-site
```

Open `http://127.0.0.1:4173`, or open `index.html` directly. Animation data is bundled as a local script, so the complete experience also works with `file://` without fetching JSON.

## GitHub Pages

1. Commit the `info-site/` directory and `.github/workflows/info-pages.yml` to the intended publishing branch.
2. In the GitHub repository, choose **Settings → Pages → Build and deployment → Source → GitHub Actions**. Pages availability for private repositories depends on the GitHub plan; do not make the application repository public just to enable Pages.
3. Run **Actions → Publish Eurveda information site → Run workflow**, selecting the branch with this site. If the workflow is not yet listed, merge its definition into the default branch first. Allow that branch in the `github-pages` environment if deployment protection restricts it.
4. Use the URL returned by the successful deployment. No custom domain is configured, so the existing Eurveda domains are unaffected.

The workflow stages only the public HTML, CSS, JavaScript and assets; application source, the supplied guide and this README are not published. Deployment is manual to avoid coupling changes on an application development branch to public releases. A separate public repository can also host the contents of this directory without publishing the main application source.

## Content and interaction

- Primary narrative: connected research, NSQ signals, grouped sources and plant records. A quieter supporting chapter covers Schedule M completeness after the plant section.
- Schedule M areas, research perspectives and NSQ lenses support pointer and keyboard interaction. Source groups use native disclosure elements.
- Research tabs switch both copy and animation (molecule, process, market). NSQ tabs switch between test branches, a reporting-location diagram and a manufacturer-record timeline. These are illustrative relationships, without fabricated counts, company rankings or live status.
- Research uses muted blue accents; NSQ uses muted warm accents within the dark green theme. Contact us opens `mailto:shashwat@eurveda.co`.
- Motion respects system preferences and has a page-level pause control. Animations pause when offscreen or the document is hidden.
- Lottie assets come from `web/src/assets/lottie/`; the player is the existing `lottie-web` package, with its license included.

Copy is grounded in the supplied complete guide, `web/src/pages/auth/AuthLayout.tsx`, `web/src/pages/Compliance.tsx`, plant/quality screens and source loaders. GAMP 5, Part 11, Annex 11 and ALCOA+ are references, not certification badges. No relevant ISO certification or ISO management standard was identified in the guide or codebase, so none is asserted. Experimental model performance, simulations, unfinished features, operational totals and real-world validation claims are omitted.

The Schedule M link points to CDSCO's G.S.R. 922(E) source. The website describes selected supporting workflows, not a complete legal clause mapping or a compliance determination. External standards and regulatory changes should be reviewed as part of editorial updates.

GitHub workflow reference: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
# infosite
