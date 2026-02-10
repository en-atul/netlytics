# Changeset Guide

This project uses [Changesets](https://github.com/changesets/changesets) to manage versioning and changelog generation.

## What is Changeset?

Changesets help you:
- Track changes in your codebase
- Automatically generate changelogs
- Manage semantic versioning (major.minor.patch)
- Prepare releases for npm

## Workflow

### 1. Making Changes

When you make code changes that affect the public API or functionality:

```bash
bun run changeset
```

This will prompt you to:
- **Select change type:**
  - `major` - Breaking changes (e.g., API changes that require user code updates)
  - `minor` - New features (backward compatible)
  - `patch` - Bug fixes (backward compatible)
- **Write a summary** describing what changed

A changeset file will be created in `.changeset/` directory (e.g., `.changeset/random-name.md`).

### 2. Committing Changes

Commit both your code changes and the changeset file:

```bash
git add .
git commit -m "feat: add new feature"
git commit -m "chore: add changeset"
```

### 3. Versioning

When you're ready to release, update versions and generate changelog:

```bash
bun run version
```

This will:
- Read all changeset files
- Update `package.json` version
- Generate/update `CHANGELOG.md`
- Remove consumed changeset files

### 4. Publishing

After versioning, build and publish to npm:

```bash
bun run release
```

This runs:
1. `bun run build` - Builds the library
2. `changeset publish` - Publishes to npm

**Note:** Make sure you're logged into npm (`npm login`) and have publish permissions.

## Example

```bash
# 1. Make code changes
# ... edit files ...

# 2. Create changeset
bun run changeset
# Select: minor
# Summary: Add getNetworkQuality function

# 3. Commit
git add .
git commit -m "feat: add getNetworkQuality function"

# 4. When ready to release
bun run version
git add .
git commit -m "chore: version packages"
git push

# 5. Publish
bun run release
```

## Changeset Files

Changeset files are located in `.changeset/` directory. They look like:

```markdown
---
"netlytics": minor
---

Add getNetworkQuality function to detect network speed/quality
```

These files are committed to git and consumed during the versioning process.

## Tips

- **Create changesets for every user-facing change** - Even small bug fixes
- **Be descriptive** - Your changeset summary becomes part of the changelog
- **Review changesets before versioning** - Check `.changeset/` folder before running `version`
- **Don't skip changesets** - They ensure accurate versioning and changelogs

## More Information

- [Changesets Documentation](https://github.com/changesets/changesets)
- [Semantic Versioning](https://semver.org/)
