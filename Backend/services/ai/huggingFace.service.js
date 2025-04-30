const axios = require('axios');

/**
 * Transform text using Hugging Face Inference API
 * @param {string} text - Original text to transform
 * @param {string} type - Type of transformation (formal, casual, joke, etc.)
 * @param {string} audience - Target audience (general, child, expert, marketer)
 * @returns {Promise<string>} - Transformed text
 */
exports.transformText = async (text, type, audience = 'general') => {
  try {
    // Generate appropriate prompt based on transformation type
    const prompt = getTransformationPrompt(text, type, audience);
    
    // Use Hugging Face Inference API with an appropriate text generation model
    const response = await axios({
      url: 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2', // Free to use
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`, // Get a free API key from huggingface.co
        'Content-Type': 'application/json'
      },
      data: {
        inputs: prompt,
        parameters: {
          max_new_tokens: 250,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true
        }
      }
    });

    // Extract the generated text from the response
    if (response.data && response.data.generated_text) {
      // Clean up the response to extract only the transformed text
      return cleanupResponse(response.data.generated_text, prompt);
    } else {
      throw new Error('Invalid response format from Hugging Face API');
    }
  } catch (error) {
    console.error('Hugging Face transformation error:', error);
    throw new Error('Failed to transform text using AI service');
  }
};

/**
 * Generate a prompt for text transformation
 */
function getTransformationPrompt(text, type, audience) {
  // Base instruction for the model
  let prompt = `<s>[INST] `;
  
  // Add transformation type specific instructions
  switch (type) {
    case 'formal':
      prompt += `Convert this text into formal, professional language: "${text}". Make it suitable for business communication. Use proper grammar, avoid contractions, and maintain a respectful tone. `;
      break;
    case 'casual':
      prompt += `Make this text more casual and conversational: "${text}". Use contractions, simple language, and a friendly tone as if speaking to a friend. `;
      break;
    case 'joke':
      prompt += `Add humor to this text: "${text}". Make it funny and light-hearted by adding puns, jokes, or a humorous twist. `;
      break;
    case 'shakespearean':
      prompt += `Rewrite this text in Shakespearean style: "${text}". Use archaic English, poetic language, and phrases typical of Shakespeare's works. `;
      break;
    case 'emoji':
      prompt += `Add relevant emojis throughout this text: "${text}". Place them strategically to complement the message, but don't overdo it. `;
      break;
    case 'grammar':
      prompt += `Fix any grammatical errors and improve sentence structure in this text: "${text}". Enhance readability while maintaining the original meaning. `;
      break;
    case 'concise':
      prompt += `Make this text more concise: "${text}". Eliminate unnecessary words, replace verbose phrases with simpler alternatives, and make it shorter without losing essential meaning. `;
      break;
    default:
      prompt += `Improve this text to make it clearer and more effective: "${text}". `;
  }
  
  // Add audience-specific instructions
  if (audience !== 'general') {
    switch (audience) {
      case 'child':
        prompt += `The audience is a 5-year-old child. Use simple language, short sentences, and concepts that a young child would understand. `;
        break;
      case 'expert':
        prompt += `The audience consists of technical experts. Use domain-appropriate terminology and sophisticated concepts. `;
        break;
      case 'marketer':
        prompt += `The audience is marketing professionals. Add persuasive language, emphasize benefits, and make the text more compelling and action-oriented. `;
        break;
    }
  }
  
  prompt += `Only return the transformed text without any explanations or additional notes. [/INST]</s>`;
  
  return prompt;
}

/**
 * Clean up the response to extract only the transformed text
 */
function cleanupResponse(response, prompt) {
  // Remove the prompt part if it's included in the response
  let cleanedText = response.replace(prompt, '');
  
  // Remove any common model responses like "Here's the transformed text:"
  cleanedText = cleanedText
    .replace(/<s>|\[INST\]|\[\/INST\]|<\/s>/g, '')
    .replace(/Here('s| is) the transformed text:?/gi, '')
    .replace(/Transformed text:?/gi, '')
    .trim();
  
  return cleanedText;
}