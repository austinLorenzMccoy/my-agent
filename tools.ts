import { tool } from "ai";
import type { SimpleGit } from "simple-git";
import { simpleGit } from "simple-git";
import { z } from "zod";
import { promises as fs } from 'fs';
import path from 'path';

const excludeFiles = ["dist", "bun.lock", "node_modules"];

// Schema for file changes
export type FileChange = z.infer<typeof fileChangeSchema>;
export const fileChangeSchema = z.object({
  rootDir: z.string().min(1).describe("The root directory"),
});

// Schema for commit message generation
export type CommitMessageInput = z.infer<typeof commitMessageSchema>;
export const commitMessageSchema = z.object({
  changes: z.array(z.object({
    file: z.string(),
    changes: z.string()
  })).describe("Array of file changes"),
  options: z.object({
    style: z.enum(["conventional", "simple", "detailed"]).default("conventional"),
    maxLength: z.number().int().positive().default(72)
  }).optional()
});

// Schema for writing markdown
export type WriteMarkdownInput = z.infer<typeof writeMarkdownSchema>;
export const writeMarkdownSchema = z.object({
  content: z.string().describe("Markdown content to write"),
  filePath: z.string().describe("Path where to save the markdown file"),
  append: z.boolean().default(false).describe("Whether to append to an existing file")
});

// Get file changes in directory
export async function getFileChangesInDirectory({ rootDir }: FileChange) {
  const git = simpleGit(rootDir);
  const summary = await git.diffSummary();
  const diffs: { file: string; changes: string }[] = [];

  for (const file of summary.files) {
    if (excludeFiles.some(exclude => file.file.includes(exclude))) continue;
    const changes = await git.diff(["--", file.file]);
    if (changes) {
      diffs.push({ 
        file: file.file, 
        changes: changes.slice(0, 10000) // Limit size to prevent context window issues
      });
    }
  }

  return diffs;
}

// Generate a commit message based on changes
export async function generateCommitMessage({ changes, options = { style: 'conventional', maxLength: 72 } }: CommitMessageInput) {
  const { style = "conventional", maxLength = 72 } = options;
  
  // This would typically call an LLM, but for now we'll use a simple implementation
  const changeTypes = {
    feat: [] as string[],
    fix: [] as string[],
    docs: [] as string[],
    style: [] as string[],
    refactor: [] as string[],
    test: [] as string[],
    chore: [] as string[]
  };

  // Categorize changes
  for (const change of changes) {
    const { file } = change;
    if (file.includes('test/') || file.endsWith('.test.') || file.endsWith('.spec.')) {
      changeTypes.test.push(file);
    } else if (file.includes('docs/') || file.endsWith('.md')) {
      changeTypes.docs.push(file);
    } else if (file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.tsx') || file.endsWith('.jsx')) {
      changeTypes.feat.push(file);
    } else {
      changeTypes.chore.push(file);
    }
  }

  // Generate commit message based on style
  let message = '';
  
  if (style === 'conventional') {
    const types = Object.entries(changeTypes)
      .filter(([_, files]) => files.length > 0)
      .map(([type]) => type);
    
    const primaryType = types[0] || 'chore';
    message = `${primaryType}: Update ${changes.length} file${changes.length > 1 ? 's' : ''}`;
    
  } else if (style === 'detailed') {
    message = 'Update:\n';
    for (const [type, files] of Object.entries(changeTypes)) {
      if (files.length > 0) {
        message += `\n${type}(${files.length}):\n`;
        for (const file of files.slice(0, 3)) {
          message += `- ${file}\n`;
        }
        if (files.length > 3) {
          message += `- ...and ${files.length - 3} more\n`;
        }
      }
    }
  } else {
    // Simple style
    message = `Update ${changes.length} file${changes.length > 1 ? 's' : ''}`;
  }

  // Ensure message doesn't exceed max length
  if (message.length > maxLength) {
    message = message.substring(0, maxLength - 3) + '...';
  }

  return { message };
}

// Write content to a markdown file
export async function writeMarkdownFile({ content, filePath, append = false }: WriteMarkdownInput) {
  try {
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    
    if (append) {
      await fs.appendFile(filePath, '\n\n' + content);
    } else {
      await fs.writeFile(filePath, content);
    }
    
    return { success: true, filePath };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error writing markdown file:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

// Export all tools
export const getFileChangesInDirectoryTool = tool({
  description: "Gets the code changes made in given directory",
  inputSchema: fileChangeSchema,
  execute: getFileChangesInDirectory,
});

export const generateCommitMessageTool = tool({
  description: "Generates a commit message based on the provided changes",
  inputSchema: commitMessageSchema,
  execute: generateCommitMessage,
});

export const writeMarkdownTool = tool({
  description: "Writes content to a markdown file",
  inputSchema: writeMarkdownSchema,
  execute: writeMarkdownFile,
});
