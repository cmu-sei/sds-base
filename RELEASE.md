# Release Procedure

`@cmu-sei/sds-base` is published to GitHub Packages after an SDS package release or by either of two manually triggered workflows. No workflow changes a branch.

Both workflows use the workflow at `.github/workflows/publish-sds-common.yml`. It checks the selected SDS npm channel, updates `@cmu-sei/sei-design-system` in the Actions runner only when a newer release is available, validates and builds the Nuxt layer, creates an npm tarball, publishes that artifact to GitHub Packages, and creates a matching `v<package-version>` GitHub Release with the tarball attached.

Automated releases receive the exact SDS package version and the previous SDS production version from the SDS repository. They derive the upstream semantic version change and apply the same patch, minor, or major increment to the independent SDS Base version. Manual runs require the maintainer to select the increment.

## Beta Release

1. Merge the intended changes to `develop`.
2. Open **Actions**, select **Publish Beta Package**, choose the `patch`, `minor`, or `major` version increment, and choose **Run workflow**.
3. Confirm the run resolved the SDS `beta` dist-tag and completed the build.
4. Confirm `@cmu-sei/sds-base` was published with a version such as `0.2.0-beta.sds.34987272606.1` and the npm `beta` tag.
5. Confirm the matching GitHub prerelease was created.
6. Install `@cmu-sei/sds-base@beta` in a clean consumer and build it.

The beta version applies the SDS release increment to the latest production
package version and adds the upstream SDS Actions run identifier, such as
`0.2.0-beta.sds.34987272606.1`. Repeated betas for the same SDS target keep the
same SDS Base core version and receive a new identifier.

## Production Release

1. Merge the tested release changes to `main`.
2. Open **Actions**, select **Publish Production Package**, choose the `patch`, `minor`, or `major` version increment, and choose **Run workflow**.
3. Confirm the selected increment produces the intended version from the latest production package version.
4. Confirm the run resolved the SDS `latest` dist-tag and completed the build.
5. Confirm `@cmu-sei/sds-base` was published at the generated version with the npm `latest` tag.
6. Confirm the matching `v<package-version>` GitHub Release was created.
7. Install `@cmu-sei/sds-base@latest` in a clean consumer and build it.

The workflow derives the next version from the package's npm `latest` dist-tag and falls back to `package.json` when no production package exists. It fails rather than overwrite an existing npm artifact and does not modify a branch.

For automatic production releases, the workflow applies the release increment derived from the previous and newly published SDS versions. For example, SDS `4.14.1` to `4.15.0` advances SDS Base `0.1.2` to `0.2.0`.

Repeated delivery of an automated event is safe. If the current channel already packages the exact requested SDS version, the workflow records that no release is needed instead of incrementing SDS Base again.

## Required Configuration

Under **Manage Actions access** in the `sei-design-system` package settings, grant `cmu-sei/sds-base` **Read** access. The SDS repository also requires an `SDS_BASE_DISPATCH_TOKEN` Actions secret that can create repository dispatch events in `cmu-sei/sds-base`. Prefer a GitHub App installation token; a fine-grained automation token with narrowly scoped access is also acceptable. SDS Base itself uses its short-lived `GITHUB_TOKEN` with `contents: write` and `packages: write`.

After beta and production are verified, an organization package administrator can make the `sds-base` package public from its GitHub Packages settings. GitHub warns that public package visibility cannot be reversed.
