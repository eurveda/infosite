"""Package the static site and generate URL-specific SEO files for GitHub Pages."""
import argparse
import html
import json
from pathlib import Path
import shutil
from urllib.parse import urlsplit


def build(base_url: str, destination: Path) -> None:
    url = urlsplit(base_url)
    if url.scheme != "https" or not url.netloc or url.query or url.fragment:
        raise ValueError("Use the final HTTPS Pages URL without a query or fragment")
    base_url = base_url.rstrip("/") + "/"
    source = Path(__file__).resolve().parent
    destination = destination.resolve()
    if destination == source or source.is_relative_to(destination):
        raise ValueError("The output must be separate from the source directory")
    destination.mkdir(parents=True, exist_ok=True)
    for name in ["styles.css", "layout.css", "script.js", ".nojekyll"]:
        shutil.copy2(source / name, destination / name)
    shutil.copytree(source / "assets", destination / "assets", dirs_exist_ok=True)
    safe_url = html.escape(base_url, quote=True)
    structured = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Eurveda",
        "url": base_url,
        "inLanguage": "en-IN",
        "description": "Connected research, NSQ intelligence and plant records for Indian pharma.",
        "about": [
            {"@type": "Thing", "name": "Pharmaceutical research"},
            {"@type": "Thing", "name": "Not of Standard Quality alerts"},
            {"@type": "Thing", "name": "Pharmaceutical quality records"},
        ],
    }
    metadata = f'''<link rel="canonical" href="{safe_url}">
  <meta property="og:url" content="{safe_url}">
  <meta property="og:image" content="{safe_url}assets/social-preview.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Eurveda — See the connections. Complete the picture.">
  <meta name="twitter:image" content="{safe_url}assets/social-preview.png">
  <meta name="twitter:image:alt" content="Eurveda — See the connections. Complete the picture.">
  <script type="application/ld+json">{json.dumps(structured).replace('<', chr(92) + 'u003c')}</script>'''
    page = (source / "index.html").read_text()
    if page.count("<!-- deployment-seo -->") != 1:
        raise ValueError("Missing or duplicated SEO insertion point")
    (destination / "index.html").write_text(page.replace("<!-- deployment-seo -->", metadata))
    (destination / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
        f'<url><loc>{html.escape(base_url)}</loc></url></urlset>\n'
    )
    # A project Pages URL cannot control the host's root robots.txt. The sitemap
    # remains available under the project path for submission to search engines.
    (destination / "robots.txt").write_text(f"User-agent: *\nAllow: /\nSitemap: {base_url}sitemap.xml\n")
    print(f"Packaged website for {base_url} in {destination}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base-url", required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    build(args.base_url, args.output)
