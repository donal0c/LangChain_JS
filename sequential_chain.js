import { config } from "dotenv";
config();

import { SequentialChain, LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";

const llm = new OpenAI({ temperature: 0 });

// Make multiple calls to the LLM, The output key of the first call is the input variable of the second call and so on. "Review"

let template =
    "You ordered {food} and your experience was {experience}. Write a review: ";
let promptTemplate = new PromptTemplate({
    template,
    inputVariables: ["food", "experience"],
});
const reviewChain = new LLMChain({
    llm,
    prompt: promptTemplate,
    outputKey: "review",
});

template = "Given the restaurant review: {review}, write a follow-up comment: ";
promptTemplate = new PromptTemplate({
    template,
    inputVariables: ["review"],
});
const commentChain = new LLMChain({
    llm,
    prompt: promptTemplate,
    outputKey: "comment",
});

template = "Summarise the review in one short sentence: \n\n {review}";
promptTemplate = new PromptTemplate({
    template,
    inputVariables: ["review"],
});
const summaryChain = new LLMChain({
    llm,
    prompt: promptTemplate,
    outputKey: "summary",
});

template = "Translate the summary to irish: \n\n {summary}";
promptTemplate = new PromptTemplate({
    template,
    inputVariables: ["summary"],
});
const translationChain = new LLMChain({
    llm,
    prompt: promptTemplate,
    outputKey: "irish_translation",
});

const overallChain = new SequentialChain({
    chains: [reviewChain, commentChain, summaryChain, translationChain],
    inputVariables: ["food", "experience"], // Input to the first chain only
    outputVariables: ["review", "comment", "summary", "irish_translation"], // outputs from all chains
});

const result = await overallChain.call({
    food: "A burger",
    experience: "It was awful!",
});
console.log(result);
