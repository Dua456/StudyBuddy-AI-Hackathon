import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api';
import { aiService } from '../services/aiService';
import {
  IoSearchOutline,
  IoHelpCircleOutline,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoTimeOutline,
  IoArrowBack,
  IoArrowForward,
  IoRefreshOutline,
  IoHomeOutline,
} from 'react-icons/io5';

const QuizPage = () => {
  const [step, setStep] = useState(1); // 1=setup, 2=quiz, 3=results
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [difficulty, setDifficulty] = useState('medium');
  const [questionCount, setQuestionCount] = useState(10);
  const [quiz, setQuiz] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data } = await api.get('/notes?limit=50');
        setNotes(data.notes);
      } catch (error) {
        toast.error('Failed to load notes');
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  // Timer
  useEffect(() => {
    if (step !== 2 || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
      setTimeTaken((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const handleGenerate = async () => {
    if (!selectedNote) {
      toast.error('Please select a note');
      return;
    }

    setGenerating(true);
    try {
      const { data } = await aiService.generateQuiz(selectedNote._id, difficulty, questionCount);
      setQuiz(data.quiz);
      setTimeLeft(data.quiz.timeLimit || questionCount * 60);
      setAnswers({});
      setCurrentQ(0);
      setTimeTaken(0);
      setStep(2);
      toast.success('Quiz generated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate quiz');
    } finally {
      setGenerating(false);
    }
  };

  const selectAnswer = (questionIndex, answer) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
  };

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);

    const answersList = Object.entries(answers).map(([idx, answer]) => ({
      questionIndex: parseInt(idx),
      selectedAnswer: answer,
    }));

    // Fill unanswered with empty
    for (let i = 0; i < quiz.questions.length; i++) {
      if (!answersList.find((a) => a.questionIndex === i)) {
        answersList.push({ questionIndex: i, selectedAnswer: '' });
      }
    }

    try {
      const { data } = await api.post(`/quiz/${quiz._id}/attempt`, {
        answers: answersList,
        timeTaken,
      });
      setResults(data);
      setStep(3);
    } catch (error) {
      toast.error('Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  }, [answers, quiz, timeTaken, submitting]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const resetQuiz = () => {
    setStep(1);
    setQuiz(null);
    setResults(null);
    setSelectedNote(null);
    setAnswers({});
    setCurrentQ(0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Quiz Generator</h1>
        <p className="text-gray-400 mt-1">Test your knowledge with AI-generated quizzes</p>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Setup */}
        {step === 1 && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass p-6 space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Select Note</label>
              <select
                value={selectedNote?._id || ''}
                onChange={(e) => {
                  const note = notes.find((n) => n._id === e.target.value);
                  setSelectedNote(note);
                }}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#6C63FF] outline-none transition-all"
              >
                <option value="">Choose a note...</option>
                {notes.map((note) => (
                  <option key={note._id} value={note._id}>
                    {note.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Number of Questions: {questionCount}
              </label>
              <input
                type="range"
                min="5"
                max="20"
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                className="w-full accent-[#6C63FF]"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5</span>
                <span>20</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
              <div className="grid grid-cols-3 gap-3">
                {['easy', 'medium', 'hard'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`py-2.5 rounded-xl font-medium capitalize transition-all ${
                      difficulty === d
                        ? 'bg-[#6C63FF] text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating || !selectedNote}
              className="w-full bg-[#6C63FF] hover:bg-[#5A52D5] rounded-xl px-6 py-3 font-semibold transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <IoHelpCircleOutline size={20} />
              {generating ? 'Generating Quiz...' : 'Generate Quiz'}
            </button>
          </motion.div>
        )}

        {/* Step 2: Quiz Interface */}
        {step === 2 && quiz && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Quiz Header */}
            <div className="glass p-4 flex items-center justify-between">
              <div>
                <h2 className="font-bold">{quiz.title}</h2>
                <p className="text-sm text-gray-400">
                  Question {currentQ + 1} of {quiz.questions.length}
                </p>
              </div>
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                  timeLeft < 60 ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-gray-300'
                }`}
              >
                <IoTimeOutline size={18} />
                <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[#6C63FF] to-[#4ECDC4] h-2 rounded-full transition-all"
                style={{ width: `${((currentQ + 1) / quiz.questions.length) * 100}%` }}
              />
            </div>

            {/* Question Card */}
            <div className="glass p-6">
              <div className="mb-6">
                <span className="text-sm text-[#6C63FF] font-medium">
                  Q{currentQ + 1} · {quiz.questions[currentQ].type === 'mcq' ? 'Multiple Choice' : 'True/False'}
                </span>
                <h3 className="text-xl font-bold mt-2">{quiz.questions[currentQ].question}</h3>
              </div>

              <div className="space-y-3">
                {quiz.questions[currentQ].options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => selectAnswer(currentQ, option)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      answers[currentQ] === option
                        ? 'bg-[#6C63FF]/20 border-[#6C63FF] text-white'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentQ((prev) => Math.max(0, prev - 1))}
                disabled={currentQ === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 disabled:opacity-30 transition-all"
              >
                <IoArrowBack /> Previous
              </button>

              <div className="flex gap-2">
                {quiz.questions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentQ(i)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                      i === currentQ
                        ? 'bg-[#6C63FF] text-white'
                        : answers[i]
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-white/5 text-gray-400'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              {currentQ === quiz.questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-5 py-2.5 rounded-xl font-semibold transition-all"
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              ) : (
                <button
                  onClick={() => setCurrentQ((prev) => Math.min(quiz.questions.length - 1, prev + 1))}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6C63FF] hover:bg-[#5A52D5] font-semibold transition-all"
                >
                  Next <IoArrowForward />
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Step 3: Results */}
        {step === 3 && results && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Score Card */}
            <div className="glass p-8 text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke={
                      (results.attempt.score / results.attempt.totalQuestions) * 100 >= 60
                        ? '#4ECDC4'
                        : '#FF6B6B'
                    }
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: '352', strokeDashoffset: 352 }}
                    animate={{
                      strokeDashoffset:
                        352 -
                        (352 * results.attempt.score) / results.attempt.totalQuestions,
                    }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">
                    {results.attempt.score}/{results.attempt.totalQuestions}
                  </span>
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-1">
                {Math.round((results.attempt.score / results.attempt.totalQuestions) * 100)}%
              </h2>
              <p
                className={`text-lg font-medium ${
                  (results.attempt.score / results.attempt.totalQuestions) * 100 >= 60
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}
              >
                {(results.attempt.score / results.attempt.totalQuestions) * 100 >= 60
                  ? 'Passed!'
                  : 'Failed'}
              </p>
              <p className="text-gray-400 text-sm mt-1">Time: {formatTime(results.attempt.timeTaken)}</p>
            </div>

            {/* Question Review */}
            <div className="glass p-5">
              <h3 className="font-bold mb-4">Question Review</h3>
              <div className="space-y-4">
                {results.quiz.questions.map((q, i) => {
                  const userAnswer = results.attempt.answers.find((a) => a.questionIndex === i);
                  const isCorrect = userAnswer?.isCorrect;

                  return (
                    <div key={i} className="p-4 rounded-xl bg-white/5">
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <IoCheckmarkCircle size={20} className="text-green-400 mt-0.5 flex-shrink-0" />
                        ) : (
                          <IoCloseCircle size={20} className="text-red-400 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{q.question}</p>
                          <p className="text-sm text-gray-400 mt-1">
                            Your answer:{' '}
                            <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>
                              {userAnswer?.selectedAnswer || 'Not answered'}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p className="text-sm text-green-400 mt-1">
                              Correct: {q.correctAnswer}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">{q.explanation}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => {
                  setStep(2);
                  setAnswers({});
                  setCurrentQ(0);
                  setTimeLeft(quiz.timeLimit);
                  setTimeTaken(0);
                  setResults(null);
                }}
                className="flex items-center gap-2 bg-[#6C63FF] hover:bg-[#5A52D5] rounded-xl px-6 py-3 font-semibold transition-all"
              >
                <IoRefreshOutline /> Retry Quiz
              </button>
              <button
                onClick={resetQuiz}
                className="flex items-center gap-2 border border-[#6C63FF] text-[#6C63FF] hover:bg-[#6C63FF]/10 rounded-xl px-6 py-3 font-semibold transition-all"
              >
                <IoHelpCircleOutline /> New Quiz
              </button>
              <a
                href="/dashboard"
                className="flex items-center gap-2 border border-white/10 text-gray-300 hover:bg-white/5 rounded-xl px-6 py-3 font-semibold transition-all"
              >
                <IoHomeOutline /> Dashboard
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizPage;
