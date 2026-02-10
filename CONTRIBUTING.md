# Contributing to Netlytics

Thank you for your interest in contributing to Netlytics! We welcome contributions from the community.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/netlytics.git
   cd netlytics
   ```
3. **Install dependencies**:
   ```bash
   bun install
   ```
4. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development

### Running Tests

```bash
bun test
```

### Building

```bash
bun run build
```

### Linting

```bash
bun run lint
bun run lint:fix  # Auto-fix issues
```

### Code Style

We use [Biome](https://biomejs.dev/) for formatting and linting. The configuration is in `biome.json`.

## Making Changes

### Before You Start

- Check existing [issues](https://github.com/en-atul/netlytics/issues) to see if your idea is already being discussed
- For major changes, open an issue first to discuss the approach

### Code Changes

1. Make your changes in the `src/` directory
2. Add tests in the `tests/` directory
3. Ensure all tests pass: `bun test`
4. Run linting: `bun run lint`
5. Build to verify: `bun run build`

### Adding a Changeset

For any user-facing changes, create a changeset:

```bash
bun run changeset
```

Select the appropriate version bump (major/minor/patch) and describe your changes. See [docs/changeset-instruction.md](docs/changeset-instruction.md) for details.

## Pull Request Process

1. **Update tests** - Ensure your changes are covered by tests
2. **Update documentation** - Update README.md if needed
3. **Add changeset** - Run `bun run changeset` for user-facing changes
4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```
5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Open a Pull Request** on GitHub

### PR Guidelines

- Write clear commit messages
- Keep PRs focused on a single feature or fix
- Reference related issues in your PR description
- Ensure CI checks pass

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback

## Questions?

Feel free to open an issue for questions or discussions about contributions.

Thank you for contributing to Netlytics! 🎉
