# Release Procedure

`@cmu-sei/sds-base` is published to GitHub Packages by two manually triggered workflows. Neither workflow changes a branch, creates a tag or GitHub Release, or runs automatically.

Both workflows use the workflow at `.github/workflows/publish-sds-common.yml`. It checks the selected SDS npm channel, updates `@cmu-sei/sei-design-system` in the Actions runner only when a newer release is available, validates and builds the Nuxt layer, creates an npm tarball, and publishes that artifact to GitHub Packages.

## Beta Release

1. Merge the intended changes to `develop`.
2. Open **Actions**, select **Publish Beta Package**, and choose **Run workflow**.
3. Confirm the run resolved the SDS `beta` dist-tag and completed the build.
4. Confirm `@cmu-sei/sds-base` was published with a version such as `0.2.0-beta.37` and the npm `beta` tag.
5. Install `@cmu-sei/sds-base@beta` in a clean consumer and build it.

The beta version combines the base version in `package.json` with the GitHub
Actions run number. It is unique without modifying the repository.

## Production Release

1. Merge the tested release changes to `main`.
2. Increment the `package.json` version and commit the matching lockfile change as part of manual release preparation. npm package versions are immutable.
3. Open **Actions**, select **Publish Production Package**, and choose **Run workflow**.
4. Confirm the run resolved the SDS `latest` dist-tag and completed the build.
5. Confirm `@cmu-sei/sds-base` was published at the declared version with the npm `latest` tag.
6. Install `@cmu-sei/sds-base@latest` in a clean consumer and build it.

The workflow fails if the declared production package version already exists. It never overwrites an npm artifact or automatically increments a committed version.

## Required Configuration

No PAT or repository secret is required. Under **Manage Actions access** in the `sei-design-system` package settings, grant `cmu-sei/sds-base` **Read** access. The workflows use the short-lived `GITHUB_TOKEN` with `contents: read` and `packages: write`.

After beta and production are verified, an organization package administrator can make the `sds-base` package public from its GitHub Packages settings. GitHub warns that public package visibility cannot be reversed.
