# Release Procedure

`@cmu-sei/sds-base` is published to GitHub Packages by two manually triggered workflows. Neither workflow changes a branch or runs automatically.

Both workflows use the workflow at `.github/workflows/publish-sds-common.yml`. It checks the selected SDS npm channel, updates `@cmu-sei/sei-design-system` in the Actions runner only when a newer release is available, validates and builds the Nuxt layer, creates an npm tarball, publishes that artifact to GitHub Packages, and creates a matching `v<package-version>` GitHub Release with the tarball attached.

## Beta Release

1. Merge the intended changes to `develop`.
2. Open **Actions**, select **Publish Beta Package**, choose the `patch`, `minor`, or `major` version increment, and choose **Run workflow**.
3. Confirm the run resolved the SDS `beta` dist-tag and completed the build.
4. Confirm `@cmu-sei/sds-base` was published with a version such as `0.2.0-beta.37` and the npm `beta` tag.
5. Confirm the matching `v0.2.0-beta.37` GitHub prerelease was created.
6. Install `@cmu-sei/sds-base@beta` in a clean consumer and build it.

The beta version increments the selected component of the latest production
package version and adds the GitHub Actions run number, such as
`0.2.0-beta.37`. It is unique without modifying the repository.

## Production Release

1. Merge the tested release changes to `main`.
2. Open **Actions**, select **Publish Production Package**, choose the `patch`, `minor`, or `major` version increment, and choose **Run workflow**.
3. Confirm the selected increment produces the intended version from the latest production package version.
4. Confirm the run resolved the SDS `latest` dist-tag and completed the build.
5. Confirm `@cmu-sei/sds-base` was published at the generated version with the npm `latest` tag.
6. Confirm the matching `v<package-version>` GitHub Release was created.
7. Install `@cmu-sei/sds-base@latest` in a clean consumer and build it.

The workflow derives the next version from the package's npm `latest` dist-tag and falls back to `package.json` when no production package exists. It fails rather than overwrite an existing npm artifact and does not modify a branch.

## Required Configuration

No PAT or repository secret is required. Under **Manage Actions access** in the `sei-design-system` package settings, grant `cmu-sei/sds-base` **Read** access. The workflows use the short-lived `GITHUB_TOKEN` with `contents: write` and `packages: write`.

After beta and production are verified, an organization package administrator can make the `sds-base` package public from its GitHub Packages settings. GitHub warns that public package visibility cannot be reversed.
