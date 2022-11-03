const { Configuration, OpenAIApi } = require("openai");
const { Command } = require('commander');
const program = new Command();

program
  .name('node ask.js')
  .description('CLI to ask GPT-3 questions')
  .version('0.1.0')
  .option('--codex', 'Use Codex instead of Davinci')
  .option('--large', 'Use large model instead of small')
  .option('--text', 'Use prompt as is instead of modifying')
  .option('--model <model>', 'Model to use')
  .argument('<prompt>', 'Prompt to ask GPT-3')

program.parse();


const runQuery = async () => {
    // get args
    const { codex, large, text, model } = program.opts();
    const selectedModel = codex
        ? large ? 'code-davinci-002': 'code-cushman-001'
        : large ? 'text-davinci-002': 'text-curie-001';
    
    let [prompt] = program.args;

    if (!text && codex) {
        prompt = `/* ${prompt} */`;
    }

    // configure openai
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.createCompletion({
        model: model || selectedModel,
        prompt,
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });

    // print response
    const { data: { choices } } = response;
    console.log(choices[0].text.trim());
}

runQuery();