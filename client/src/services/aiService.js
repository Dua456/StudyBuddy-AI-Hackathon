import api from './api';

export const aiService = {
  summarize: (noteId) => api.post('/ai/summarize', { noteId }),
  generateQuiz: (noteId, difficulty, questionCount) =>
    api.post('/ai/generate-quiz', { noteId, difficulty, questionCount }),
  extractText: (noteId) => api.post('/ai/extract-text', { noteId }),
};
