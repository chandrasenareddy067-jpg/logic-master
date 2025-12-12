import { CourseModule } from './types';

export const AI_COURSE_MODULES: CourseModule[] = [
  {
    id: 'intro',
    title: 'Introduction to Prompting',
    description: 'Learn the fundamentals of communicating with AI models effectively.',
    content: `
### What is a Prompt?
A prompt is the input you provide to a Large Language Model (LLM) like Gemini to elicit a response. Think of it as programming in natural language.

### The Golden Rule: Be Specific
Ambiguity is the enemy of quality. The more context, constraints, and instructions you provide, the better the output.

### Key Components of a Good Prompt
1. **Persona**: Who should the AI act as? (e.g., "Act as a senior software engineer")
2. **Task**: What exactly do you want done? (e.g., "Write a unit test")
3. **Context**: Background information. (e.g., "using Jest for a React component")
4. **Format**: How should the output look? (e.g., "in a code block with comments")
    `,
    examples: [
      {
        bad: "Write a poem.",
        good: "Write a haiku about a robot learning to love, using nature metaphors.",
        explanation: "The bad example is too open-ended. The good example specifies format (haiku), topic (robot love), and style (nature metaphors)."
      },
      {
        bad: "Fix this code.",
        good: "Analyze this Python function for time complexity inefficiencies and suggest an O(n) solution.",
        explanation: "Specific instructions guide the AI to the *type* of fix you need."
      }
    ]
  },
  {
    id: 'techniques',
    title: 'Advanced Techniques',
    description: 'Master Few-Shot Prompting and Chain-of-Thought reasoning.',
    content: `
### Zero-Shot vs. Few-Shot
*   **Zero-Shot**: Asking the AI to do something without examples.
*   **Few-Shot**: Providing examples of input->output to guide the AI's pattern matching.

### Chain of Thought (CoT)
Encouraging the AI to "think step-by-step" improves performance on complex logic or math problems significantly. It forces the model to generate intermediate reasoning steps before the final answer.
    `,
    examples: [
      {
        bad: "Is this sentiment positive or negative? 'The movie was okay, but the popcorn was cold.'",
        good: "Classify sentiment as Positive, Neutral, or Negative.\nExample 1: 'I loved it!' -> Positive\nExample 2: 'It was terrible.' -> Negative\nInput: 'The movie was okay, but the popcorn was cold.' ->",
        explanation: "Providing examples (Few-Shot) helps the model understand the exact classification boundaries you want."
      }
    ]
  },
  {
    id: 'logic-riddles',
    title: 'Mastering Logic Riddles',
    description: 'Learn lateral thinking strategies to solve complex riddles and brain teasers.',
    content: `
### What is Lateral Thinking?
Lateral thinking involves looking at a problem from unexpected angles rather than relying on traditional step-by-step logic. Riddles often rely on wordplay, hidden assumptions, or dual meanings.

### Strategies for Solving Riddles
1.  **Challenge Assumptions**: If a riddle mentions a "doctor," do not assume gender. If it mentions a "month," do not assume a specific year.
2.  **Literal vs. Metaphorical**: Words like "runs" (river vs human), "legs" (table vs animal), or "hands" (clock vs human) are common traps.
3.  **Think Simpler**: Often the answer is an everyday object described in an obscure way.

### Common Riddle Types
*   **The Paradox**: Statements that seem contradictory but have a logical resolution.
*   **Sequence Puzzles**: Finding the pattern in numbers or letters (e.g., O, T, T, F, F... for One, Two, Three, Four, Five).
*   **Situational Mysteries**: "A man walks into a bar..." scenarios requiring you to deduce the context.
    `,
    examples: [
      {
        bad: "Thinking the answer is complex math.",
        good: "Looking for wordplay. Q: What has keys but can't open locks? A: A piano.",
        explanation: "Riddles often use homonyms (words that sound the same but have different meanings)."
      },
      {
        bad: "Assuming 'He' or 'She'.",
        good: "Considering 'It'. Q: I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I? A: An Echo.",
        explanation: "Personification is a key technique in riddles."
      }
    ]
  }
];

export const SYSTEM_INSTRUCTION_APTITUDE = `
You are an expert quiz master creating aptitude and logical reasoning questions.
Generate a JSON response containing an array of 3 unique, challenging questions.
The questions should test logic, math, verbal reasoning, or pattern recognition.
Ensure the format strictly follows the JSON schema provided.
`;

export const SYSTEM_INSTRUCTION_IQ = `
You are a professional psychometrician designing a high-range IQ test.
Generate a JSON response containing an array of 5 unique, highly challenging questions.
Focus exclusively on:
1. Advanced Number Series
2. Verbal Analogies (SAT/GRE level)
3. Logical Deductions (Syllogisms)
4. Classification (Odd one out)
Exclude visual pattern problems as this is a text-based interface.
Ensure the format strictly follows the JSON schema provided.
`;