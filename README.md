<div align="center">
  <h1>🤖 AI Code Review Agent</h1>
  <p>A powerful AI-powered code review agent that helps maintain code quality and consistency across your projects.</p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Bun Version](https://img.shields.io/badge/Bun-v1.0.0-000000.svg?logo=bun&style=flat)](https://bun.sh/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/yourusername/ai-code-review-agent/pulls)
</div>

## ✨ Features

- **AI-Powered Code Review**: Get intelligent feedback on your code changes
- **Automated Commit Messages**: Generate meaningful commit messages based on changes
- **Detailed Reports**: Comprehensive markdown reports with actionable insights
- **Git Integration**: Seamless Git operations for tracking changes
- **Customizable**: Configure rules and preferences to match your workflow

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (v1.0.0 or later)
- Node.js (v18 or later)
- Git
- Google Generative AI API Key

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-code-review-agent.git
cd ai-code-review-agent

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Add your Google Generative AI API key to .env
```

### Usage

```bash
# Run the code review agent on the current directory
bun run index.ts

# Or specify a directory to review
bun run index.ts /path/to/your/code
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/austinLorenzMccoy/my-agent.git
   cd my-agent
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up your environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your Google API key:
   ```
   GOOGLE_GENERATIVE_AI_API_KEY=your-api-key-here
   ```

### Usage

Run the agent:
```bash
bun start
```

Or run a specific file:
```bash
bun run index.ts
```

## 📂 Project Structure

```
my-agent/
├── src/
│   ├── index.ts         # Main entry point
│   ├── prompts.ts       # AI prompts and system messages
│   └── tools/           # Tool implementations
│       ├── index.ts     # Tool exports
│       └── git.ts       # Git-related tools
├── reviews/             # Generated review reports
├── .env                # Environment variables
├── .gitignore          # Git ignore file
├── bun.lockb           # Bun lock file
├── package.json        # Project metadata and dependencies
└── README.md           # This file
```

## 🛠 Configuration

Create a `.env` file in the root directory with the following variables:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
REVIEW_OUTPUT_DIR=./reviews
```

## 🤖 How It Works

1. **Change Detection**: The agent scans your Git repository for uncommitted changes
2. **AI Analysis**: Changes are analyzed using Google's Generative AI
3. **Review Generation**: The AI generates a comprehensive code review
4. **Report Creation**: A detailed markdown report is created in the `reviews/` directory
5. **Commit Message**: A suggested commit message is generated based on the changes

## 📝 Example Output

```markdown
# Code Review Report

**Generated at:** 2025-09-15T18:33:33.326Z

## Commit Message Suggestion
```
feat: Add new authentication middleware
- Implement JWT token verification
- Add role-based access control
- Update API documentation
```

## Review Summary

### File: src/middleware/auth.ts
- **Code Quality**: Good implementation of JWT verification
- **Security**: Proper error handling for invalid tokens
- **Suggestions**: Consider adding rate limiting for authentication endpoints
```

## 🔧 Customization

### Customizing Prompts

Edit `src/prompts.ts` to modify the system prompt and adjust the AI's behavior.

### Adding New Tools

1. Create a new file in `src/tools/`
2. Implement your tool following the existing patterns
3. Export it in `src/tools/index.ts`
4. Add it to the agent's tools in `index.ts`

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google's Generative AI Team
- Vercel AI SDK
- The Bun Team

---

<div align="center">
  Made with ❤️ by Your Team
</div>
