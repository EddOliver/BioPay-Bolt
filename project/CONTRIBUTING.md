# Contributing to BioPay

Thank you for your interest in contributing to BioPay! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- Expo CLI
- Basic knowledge of React Native and TypeScript

### Development Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/biopay.git
   cd biopay
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 📋 Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow the existing code style and formatting
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### File Organization

- Place reusable components in `/components`
- Place screens in `/app` following Expo Router conventions
- Place utilities in `/utils`
- Place types in `/types`
- Place stores in `/stores`

### Naming Conventions

- **Components**: PascalCase (e.g., `WalletSetup.tsx`)
- **Files**: camelCase for utilities, PascalCase for components
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase with descriptive names

## 🔧 Technical Guidelines

### React Native Best Practices

- Use functional components with hooks
- Implement proper error boundaries
- Use StyleSheet.create for styling
- Optimize performance with useMemo and useCallback when needed
- Handle platform differences appropriately

### State Management

- Use Zustand for global state
- Keep state as minimal as possible
- Use local state for component-specific data
- Implement proper loading and error states

### Algorand Integration

- Use the official Algorand SDK (algosdk)
- Handle network errors gracefully
- Implement proper transaction validation
- Never expose private keys or mnemonics
- Use TestNet for development and testing

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- Write unit tests for utilities and pure functions
- Write integration tests for complex workflows
- Test error scenarios and edge cases
- Mock external dependencies appropriately

## 📝 Pull Request Process

### Before Submitting

1. Ensure your code follows the style guidelines
2. Run tests and ensure they pass
3. Update documentation if needed
4. Test on multiple platforms (web, iOS, Android)

### Pull Request Guidelines

1. **Title**: Use a clear, descriptive title
2. **Description**: Explain what changes you made and why
3. **Testing**: Describe how you tested your changes
4. **Screenshots**: Include screenshots for UI changes
5. **Breaking Changes**: Clearly mark any breaking changes

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Tested on multiple platforms

## Screenshots
(If applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
```

## 🐛 Bug Reports

### Before Reporting

1. Check existing issues to avoid duplicates
2. Test on the latest version
3. Gather relevant information (device, OS, steps to reproduce)

### Bug Report Template

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to...
2. Click on...
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Device: [e.g., iPhone 12, Pixel 5]
- OS: [e.g., iOS 15, Android 12]
- App Version: [e.g., 1.0.0]
- Platform: [e.g., Web, Native]

## Screenshots
(If applicable)

## Additional Context
Any other relevant information
```

## 💡 Feature Requests

### Feature Request Template

```markdown
## Feature Description
Clear description of the proposed feature

## Problem Statement
What problem does this solve?

## Proposed Solution
How should this feature work?

## Alternatives Considered
Other solutions you've considered

## Additional Context
Any other relevant information
```

## 🔐 Security

### Reporting Security Issues

- **DO NOT** create public issues for security vulnerabilities
- Email security issues to: security@biopay.app
- Include detailed information about the vulnerability
- Allow time for the issue to be addressed before disclosure

### Security Guidelines

- Never commit private keys, mnemonics, or API keys
- Use environment variables for sensitive configuration
- Implement proper input validation
- Follow secure coding practices
- Keep dependencies updated

## 📚 Documentation

### Documentation Standards

- Use clear, concise language
- Include code examples where helpful
- Keep documentation up to date with code changes
- Use proper markdown formatting

### Types of Documentation

- **README**: Project overview and setup
- **API Documentation**: Function and component APIs
- **Tutorials**: Step-by-step guides
- **Architecture**: High-level system design

## 🎯 Roadmap Contributions

Check our [roadmap](README.md#roadmap) for planned features. We welcome contributions for:

- Multi-language support
- Advanced DeFi integrations
- Performance optimizations
- Accessibility improvements
- Platform-specific features

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion
- **Discord**: Join our community server
- **Email**: contact@biopay.app

## 🏆 Recognition

Contributors will be recognized in:
- README contributors section
- Release notes
- Community highlights

Thank you for contributing to BioPay! 🚀