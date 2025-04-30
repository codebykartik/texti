const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

/**
 * Transform text using Google Gemini AI
 * @param {string} text - Original text to transform
 * @param {string} type - Type of transformation (formal, casual, joke, etc.)
 * @param {string} audience - Target audience (general, child, expert, marketer)
 * @returns {Promise<string>} - Transformed text
 */
exports.transformText = async (text, type, audience = 'general') => {
  try {
    // Get the transformation prompt based on type and audience
    const prompt = getTransformationPrompt(text, type, audience);
    
    // Get the Gemini Pro model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Get the transformed text from the response
    return response.text();
  } catch (error) {
    console.error('Gemini AI transformation error:', error);
    throw new Error('Failed to transform text using AI service');
  }
};

/**
 * Polish an email using Google Gemini AI
 * @param {string} text - Original email draft
 * @param {string} emailType - Type of email (professional, followup, etc.)
 * @param {string} audience - Target audience (general, child, expert, marketer)
 * @returns {Promise<string>} - Polished email
 */
exports.polishEmail = async (text, emailType, audience = 'general') => {
  try {
    // Get the email polishing prompt
    const prompt = getEmailPrompt(text, emailType, audience);
    
    // Get the Gemini Pro model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Get the polished email from the response
    return response.text();
  } catch (error) {
    console.error('Gemini AI email polishing error:', error);
    throw new Error('Failed to polish email using AI service');
  }
};

/**
 * Analyze text using Google Gemini AI
 * @param {string} text - Text to analyze
 * @param {string} insightType - Type of analysis (sentiment, readability, etc.)
 * @returns {Promise<string|object>} - Analysis results
 */
exports.analyzeText = async (text, insightType) => {
  try {
    // Get the analysis prompt
    const prompt = getAnalysisPrompt(text, insightType);
    
    // Get the Gemini Pro model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Get the analysis results from the response
    return response.text();
  } catch (error) {
    console.error('Gemini AI text analysis error:', error);
    throw new Error('Failed to analyze text using AI service');
  }
};

/**
 * Generate a prompt for text transformation
 * @param {string} text - Original text to transform
 * @param {string} type - Type of transformation
 * @param {string} audience - Target audience
 * @returns {string} - Prompt for AI
 */
function getTransformationPrompt(text, type, audience) {
  // Base prompt structure
  let prompt = `Transform the following text: "${text}"\n\n`;
  
  // Add transformation type specific instructions
  switch (type) {
    case 'formal':
      prompt += 'Convert this text into formal, professional language suitable for business communication. Use proper grammar, avoid contractions, and maintain a respectful tone.';
      break;
    case 'casual':
      prompt += 'Make this text more casual and conversational. Use contractions, simple language, and a friendly tone as if speaking to a friend.';
      break;
    case 'joke':
      prompt += 'Add humor to this text. Make it funny and light-hearted. You can add puns, jokes, or a humorous twist.';
      break;
    case 'shakespearean':
      prompt += 'Rewrite this text in Shakespearean style. Use archaic English, poetic language, and phrases typical of Shakespeare\'s works.';
      break;
    case 'emoji':
      prompt += 'Add relevant emojis throughout this text to enhance its meaning. Don\'t overdo it, but place them strategically to complement the message.';
      break;
    case 'grammar':
      prompt += 'Fix any grammatical errors, improve sentence structure, and enhance readability while maintaining the original meaning.';
      break;
    case 'concise':
      prompt += 'Make this text more concise. Eliminate unnecessary words, replace verbose phrases with simpler alternatives, and make it shorter without losing essential meaning.';
      break;
    default:
      prompt += 'Improve this text to make it clearer and more effective.';
  }
  
  // Add audience-specific instructions
  if (audience !== 'general') {
    prompt += '\n\n';
    switch (audience) {
      case 'child':
        prompt += 'The audience is a 5-year-old child. Use simple language, short sentences, and concepts that a young child would understand.';
        break;
      case 'expert':
        prompt += 'The audience consists of technical experts. Feel free to use domain-appropriate terminology and sophisticated concepts.';
        break;
      case 'marketer':
        prompt += 'The audience is marketing professionals. Add persuasive language, emphasize benefits, and make the text more compelling and action-oriented.';
        break;
    }
  }
  
  prompt += '\n\nOnly return the transformed text without any explanations or additional notes.';
  
  return prompt;
}

/**
 * Generate a prompt for email polishing
 * @param {string} text - Original email draft
 * @param {string} emailType - Type of email
 * @param {string} audience - Target audience
 * @returns {string} - Prompt for AI
 */
function getEmailPrompt(text, emailType, audience) {
  // Base prompt structure
  let prompt = `Polish the following email draft: "${text}"\n\n`;
  
  // Add email type specific instructions
  switch (emailType) {
    case 'professional':
      prompt += 'Format this as a professional business email. Use appropriate greetings and closings, maintain formal language, and ensure clear communication of the main points. Organize the content with proper paragraphs.';
      break;
    case 'followup':
      prompt += 'Format this as a follow-up email. Be polite but direct, reference previous communications, and include a clear call to action or next steps. Keep it concise and actionable.';
      break;
    case 'networking':
      prompt += 'Format this as a networking email. Be personable yet professional, demonstrate genuine interest, and make a clear connection point. Include a simple call to action like a coffee meeting or call.';
      break;
    case 'application':
      prompt += 'Format this as a job application email. Highlight relevant qualifications, demonstrate enthusiasm for the role, and maintain professional language. Include a clear reference to the position and your fit for it.';
      break;
    case 'outreach':
      prompt += "Format this as a cold outreach email. Be concise, personalized, and value-focused. Make a clear connection to the recipient's interests or needs, and include a simple call to action.";
      break;
    default:
      prompt += 'Improve this email to make it clearer, more professional, and more effective.';
  }
  
  // Add audience-specific instructions
  if (audience !== 'general') {
    prompt += '\n\n';
    switch (audience) {
      case 'child':
        prompt += 'The recipient is a young audience. Use simple language and friendly tone.';
        break;
      case 'expert':
        prompt += 'The recipient is a technical expert. Feel free to use domain-appropriate terminology and sophisticated concepts.';
        break;
      case 'marketer':
        prompt += 'The recipient works in marketing. Use persuasive language and focus on benefits and value propositions.';
        break;
    }
  }
  
  prompt += '\n\nFormat the email properly with appropriate greeting and closing. Only return the polished email without any explanations or additional notes.';
  
  return prompt;
}

/**
 * Generate a prompt for text analysis
 * @param {string} text - Text to analyze
 * @param {string} insightType - Type of analysis
 * @returns {string} - Prompt for AI
 */
function getAnalysisPrompt(text, insightType) {
  // Base prompt structure
  let prompt = `Analyze the following text: "${text}"\n\n`;
  
  // Add analysis type specific instructions
  switch (insightType) {
    case 'sentiment':
      prompt += 'Perform sentiment analysis on this text. Determine if the overall sentiment is positive, negative, or neutral. Provide a sentiment score on a scale of 0 to 1 (where 0 is extremely negative, 0.5 is neutral, and 1 is extremely positive). Also identify the primary emotions expressed and provide a brief analysis of the sentiment patterns.\n\n' +
        'Return the results in the following JSON format:\n' +
        '{\n' +
        '  "sentiment": "[Positive/Negative/Neutral]",\n' +
        '  "score": [number between 0 and 1],\n' +
        '  "confidence": "[High/Medium/Low]",\n' +
        '  "emotions": [\n' +
        '    {"name": "[emotion]", "score": [number between 0 and 1]},\n' +
        '    ...\n' +
        '  ],\n' +
        '  "analysis": "[brief summary of sentiment analysis]"\n' +
        '}';
      break;
    case 'readability':
      prompt += 'Analyze the readability of this text. Calculate the Flesch-Kincaid grade level, identify the text complexity, and suggest improvements for readability. Also determine the average sentence length and average word length.\n\n' +
        'Return the results in the following JSON format:\n' +
        '{\n' +
        '  "fleschKincaid": [grade level as number],\n' +
        '  "grade": "[grade level description]",\n' +
        '  "complexity": "[Low/Medium/High]",\n' +
        '  "avgSentenceLength": [number],\n' +
        '  "avgWordLength": [number],\n' +
        '  "suggestions": [\n' +
        '    "[suggestion 1]",\n' +
        '    "[suggestion 2]",\n' +
        '    ...\n' +
        '  ]\n' +
        '}';
      break;
    case 'keywords':
      prompt += 'Extract key topics, phrases, and important terms from this text. Identify frequent words, important concepts, and their relevance to the overall topic.\n\n' +
        'Return the results in the following JSON format:\n' +
        '{\n' +
        '  "keywords": [\n' +
        '    {"word": "[keyword]", "count": [frequency], "relevance": [score between 0 and 1]},\n' +
        '    ...\n' +
        '  ]\n' +
        '}';
      break;
    case 'language':
      prompt += 'Analyze the language patterns, style, voice, and tone of this text. Identify formal vs. informal language, active vs. passive voice, and overall writing style.\n\n' +
        'Return the results in the following JSON format:\n' +
        '{\n' +
        '  "formality": "[Very Formal/Formal/Neutral/Casual/Very Casual]",\n' +
        '  "tone": "[Professional/Friendly/Academic/Conversational/etc]",\n' +
        '  "voice": "[percentage]% Active, [percentage]% Passive",\n' +
        '  "style": "[Descriptive/Narrative/Persuasive/Expository/etc]",\n' +
        '  "characteristics": [\n' +
        '    "[characteristic 1]",\n' +
        '    "[characteristic 2]",\n' +
        '    ...\n' +
        '  ]\n' +
        '}';
      break;
    case 'suggestion':
      prompt += 'Analyze this text and provide specific suggestions to improve its clarity, impact, and effectiveness. Consider structure, word choice, tone, and overall messaging.\n\n' +
        'Return the results in the following JSON format:\n' +
        '{\n' +
        '  "strengths": [\n' +
        '    "[strength 1]",\n' +
        '    "[strength 2]",\n' +
        '    ...\n' +
        '  ],\n' +
        '  "weaknesses": [\n' +
        '    "[weakness 1]",\n' +
        '    "[weakness 2]",\n' +
        '    ...\n' +
        '  ],\n' +
        '  "suggestions": [\n' +
        '    {"area": "[area for improvement]", "recommendation": "[specific suggestion]"},\n' +
        '    ...\n' +
        '  ],\n' +
        '  "improvedVersion": "[brief example of improved text]"\n' +
        '}';
      break;
    default:
      prompt += 'Provide a general analysis of this text, including readability, tone, and key points.\n\n' +
        'Return the results in a structured JSON format with relevant metrics and observations.';
  }
  
  prompt += '\n\nEnsure the response is ONLY the JSON object without any additional text, explanations or markdown formatting.';
  
  return prompt;
}