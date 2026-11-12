# FLOWRX — publish with GitHub Pages

This is the redesigned FLOWRX static website. It includes the homepage, styles, interactions, project examples, image assets, and favicon. It requires no build tools.

## Publish for free

1. Sign in to GitHub and create a **new public repository** named `flowrx-website`. Leave the optional README, `.gitignore`, and license boxes unchecked because this package already contains its files.
2. Download and unzip `FLOWRX-GitHub-Pages.zip` on your computer.
3. Open the new repository on GitHub. Choose **Add file → Upload files**.
4. Open the unzipped `FLOWRX-GitHub-Pages` folder and upload the **contents inside it**. Make sure `index.html` is at the top level of the repository, alongside `style.css`, `script.js`, the images, and the `Buffet`, `king kota`, and `MiddleMan` folders.
5. Select **Commit changes**.
6. In the repository, open **Settings → Pages**. Under **Build and deployment**, set **Source** to **Deploy from a branch**, select **main** and **/(root)**, then choose **Save**.
7. Wait for the Pages deployment to finish. Return to **Settings → Pages** and open the published site link. A project site will normally use a URL like `https://YOUR-USERNAME.github.io/flowrx-website/`. If you want the shorter `https://YOUR-USERNAME.github.io/` address, the repository name must exactly match your GitHub username followed by `.github.io`.

GitHub's current instructions: [Quickstart for GitHub Pages](https://docs.github.com/en/pages/quickstart) and [configure a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## About the address

GitHub Pages hosting is free for public repositories on GitHub Free. The default `github.io` address is enough to launch; this package does not set a custom domain, canonical URL, or sitemap. A custom domain can be connected later if you own one.

## Before publishing

A public repository makes its source files visible to everyone. This site contains business contact details and a Formspree form endpoint, which are already visible in the website code. Never add passwords, private keys, or other secrets to the repository. GitHub Pages serves static files; the contact form is handled by Formspree.
