import { config } from 'dotenv';
config({ path: '../.env' });

import { stepCountIs, streamText, tool } from "ai";
import { google } from "@ai-sdk/google";
import { SYSTEM_PROMPT } from "./prompts";
import { 
  fileChangeSchema, 
  commitMessageSchema, 
  writeMarkdownSchema 
} from "./tools";
import { 
  getFileChangesInDirectory, 
  generateCommitMessage,
  writeMarkdownFile
} from "./tools";
import path from 'path';

const REVIEW_OUTPUT_DIR = path.join(process.cwd(), 'reviews');

async function generateReviewReport(directory: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reviewFilePath = path.join(REVIEW_OUTPUT_DIR, `code-review-${timestamp}.md`);
  
  // Get all file changes
  const changes = await getFileChangesInDirectory({ rootDir: directory });
  
  // Generate a commit message based on changes
  const commitMessageResult = await generateCommitMessage({
    changes,
    options: {
      style: 'conventional',
      maxLength: 100
    }
  });
  
  // Get the commit message from the result
  const commitMessage = typeof commitMessageResult === 'object' && commitMessageResult !== null && 'message' in commitMessageResult
    ? commitMessageResult.message
    : 'Update files';
  
  // Generate the review using the AI
  const reviewPrompt = `Please review the following code changes. Provide a detailed analysis including:
  - Code quality issues
  - Potential bugs
  - Security concerns
  - Performance optimizations
  - Best practices violations
  - Any other relevant feedback

  Changes:
  ${JSON.stringify(changes, null, 2)}
  
  Please provide a comprehensive review.`;

  const result = streamText({
    model: google("models/gemini-2.5-flash"),
    prompt: reviewPrompt,
    system: SYSTEM_PROMPT,
    tools: {
      getFileChangesInDirectoryTool: tool({
        description: "Gets the code changes made in given directory",
        inputSchema: fileChangeSchema,
        execute: getFileChangesInDirectory,
      }),
      generateCommitMessageTool: tool({
        description: "Generates a commit message based on the provided changes",
        inputSchema: commitMessageSchema,
        execute: generateCommitMessage,
      }),
      writeMarkdownTool: tool({
        description: "Writes content to a markdown file",
        inputSchema: writeMarkdownSchema,
        execute: writeMarkdownFile,
      })
    },
    stopWhen: stepCountIs(20),
  });

  // Collect the review content
  let reviewContent = `# Code Review Report\n\n`;
  reviewContent += `**Generated at:** ${new Date().toISOString()}\n\n`;
  reviewContent += `**Commit Message Suggestion:**\n\`\`\`\n${commitMessage}\n\`\`\`\n\n`;
  reviewContent += `## Review Summary\n\n`;

  // Stream the output and collect it
  for await (const chunk of result.textStream) {
    process.stdout.write(chunk);
    reviewContent += chunk;
  }

  // Write the review to a markdown file
  await writeMarkdownFile({
    content: reviewContent,
    filePath: reviewFilePath,
    append: false
  });

  console.log(`\n\n✅ Review saved to: ${reviewFilePath}`);
  return { reviewFilePath, commitMessage };
}

// Main function to run the code review
async function main() {
  const directoryToReview = process.argv[2] || process.cwd();
  
  console.log(`🚀 Starting code review for directory: ${directoryToReview}\n`);
  
  try {
    const { reviewFilePath, commitMessage } = await generateReviewReport(directoryToReview);
    
    console.log(`\n✨ Review completed!`);
    console.log(`📝 Review saved to: ${reviewFilePath}`);
    console.log(`💡 Suggested commit message: "${commitMessage}"`);
    
  } catch (error) {
    console.error('❌ Error during code review:', error);
    process.exit(1);
  }
}

// Run the main function
main().catch(console.error);