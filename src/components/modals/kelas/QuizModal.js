import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import SweetAlert from 'sweetalert2';

function QuizModal({ isOpen, onClose, token, classModel, onSave }) {
    const [quizData, setQuizData] = useState({
        title: '',
        description: '',
        topic: null
    });
    const [topics, setTopics] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState({
        question_text: '',
        question_type: 'mcq',
        question_image: null
    });
    const [quizId, setQuizId] = useState(null); // Store quiz ID after creation

    const baseUrl = `${process.env.REACT_APP_API_BASE_URL}`;

    useEffect(() => {
        const fetchTopicsForClass = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/topic/topics/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                const filteredTopics = data.filter(topic => topic.class_model === parseInt(classModel));
                setTopics(filteredTopics);
            } catch (error) {
                console.error('Failed to fetch topics', error);
            }
        };

        if (isOpen) {
            fetchTopicsForClass();
        }
    }, [isOpen, classModel, token, baseUrl]);

    const handleCreateQuiz = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/quiz/quizzes/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...quizData,
                    topic: quizData.topic.value
                })
            });
            const data = await response.json();
            setQuizId(data.id); // Set quiz ID for further question and answer submissions
            onSave(data); // Notify parent component with new quiz
            SweetAlert.fire('Success', 'Quiz created successfully!', 'success');
        } catch (error) {
            console.error('Failed to create quiz', error);
            SweetAlert.fire('Error', 'Failed to create quiz', 'error');
        }
    };

    const handleAddQuestion = async () => {
        if (!quizId) {
            SweetAlert.fire('Error', 'Create a quiz before adding questions', 'error');
            return;
        }
        const formData = new FormData();
        formData.append('quiz', quizId);
        formData.append('question_text', newQuestion.question_text);
        formData.append('question_type', newQuestion.question_type);
        if (newQuestion.question_image) {
            formData.append('question_image', newQuestion.question_image);
        }
        try {
            const response = await fetch(`${baseUrl}/api/quiz/questions/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            const data = await response.json();
            setQuestions([...questions, data]);
            SweetAlert.fire('Success', 'Question added successfully!', 'success');
            setNewQuestion({
                question_text: '',
                question_type: 'mcq',
                question_image: null
            });
        } catch (error) {
            console.error('Failed to add question', error);
            SweetAlert.fire('Error', 'Failed to add question', 'error');
        }
    };

    const handleAddAnswerOption = async (questionId, optionText, isCorrect) => {
        try {
            await fetch(`${baseUrl}/api/quiz/answer-options/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    question: questionId,
                    option_text: optionText,
                    is_correct: isCorrect
                })
            });
            SweetAlert.fire('Success', 'Answer option added successfully!', 'success');
        } catch (error) {
            console.error('Failed to add answer option', error);
            SweetAlert.fire('Error', 'Failed to add answer option', 'error');
        }
    };

    const handleCreateDiscussion = async () => {
        try {
            await fetch(`${baseUrl}/api/discuss/discussions/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    topic: quizData.topic.value,
                    title: `Discussion on ${quizData.title}`
                })
            });
            SweetAlert.fire('Success', 'Discussion created successfully!', 'success');
        } catch (error) {
            console.error('Failed to create discussion', error);
            SweetAlert.fire('Error', 'Failed to create discussion', 'error');
        }
    };

    return isOpen ? (
        <div className="modal show fade d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Create Quiz</h5>
                        <button type="button" className="close" onClick={onClose}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {/* Quiz Information */}
                        <Select
                            options={topics.map(topic => ({ value: topic.topic_id, label: topic.topic_name }))}
                            onChange={(selected) => setQuizData({ ...quizData, topic: selected })}
                            placeholder="Select Topic"
                            className="mb-2"
                        />
                        <input
                            type="text"
                            placeholder="Quiz Title"
                            value={quizData.title}
                            onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
                            className="form-control mb-2"
                        />
                        <textarea
                            placeholder="Quiz Description"
                            value={quizData.description}
                            onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
                            className="form-control mb-2"
                        />
                        <button onClick={handleCreateQuiz} className="btn btn-primary mb-3">
                            Create Quiz
                        </button>

                        {/* Question Form */}
                        <input
                            type="text"
                            placeholder="Question Text"
                            value={newQuestion.question_text}
                            onChange={(e) => setNewQuestion({ ...newQuestion, question_text: e.target.value })}
                            className="form-control mb-2"
                        />
                        <select
                            className="form-control mb-2"
                            value={newQuestion.question_type}
                            onChange={(e) => setNewQuestion({ ...newQuestion, question_type: e.target.value })}
                        >
                            <option value="mcq">Multiple Choice</option>
                            <option value="checkbox">Checkbox</option>
                            <option value="text">Text</option>
                            <option value="match">Match Options</option>
                            <option value="image">Image-based</option>
                        </select>
                        <input
                            type="file"
                            onChange={(e) => setNewQuestion({ ...newQuestion, question_image: e.target.files[0] })}
                            className="form-control mb-2"
                        />
                        <button onClick={handleAddQuestion} className="btn btn-secondary mb-3">
                            Add Question
                        </button>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    ) : null;
}

export default QuizModal;
