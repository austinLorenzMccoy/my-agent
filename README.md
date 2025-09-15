# 🤖 AI Code Review Agent

An intelligent code review assistant built with Bun and Google's Generative AI. This agent provides automated code reviews with a focus on code quality, best practices, and maintainability.

## ✨ Features

- Automated code reviews powered by Google's Gemini 2.5 Flash
- Customizable review criteria and focus areas
- Support for multiple programming languages
- Configurable review strictness and style
- Integration with CI/CD pipelines

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun 1.0+
- Google Cloud account with Generative AI API access
- API key for Google's Generative AI

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

## 🛠️ Configuration

Customize the code review criteria by modifying the `prompts.ts` file. You can adjust:
- Review focus areas
- Tone and style
- Specific coding standards
- Response format

## 📂 Project Structure

```
my-agent/
├── src/                    # Source files
│   ├── index.ts            # Main entry point
│   └── prompts.ts          # System prompts and configurations
├── .env                    # Environment variables
├── .gitignore
├── README.md               # This file
├── bun.lockb               # Bun lockfile
└── tsconfig.json           # TypeScript configuration
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Bun](https://bun.sh) - The fast JavaScript runtime
- [Google Generative AI](https://ai.google.dev/) - For the powerful AI models
- [Vercel AI SDK](https://sdk.vercel.ai/) - For the AI integration tools
