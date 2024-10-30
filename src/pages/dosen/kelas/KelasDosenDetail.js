import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Swal from "sweetalert2";
import useTokenValidation from "../../../hook/TokenValidation";
import EnrollmentModal from "../../../components/modals/kelas/EnrollmentModal";
import TopicModal from "../../../components/modals/kelas/TopikModal";
import QuizModal from "../../../components/modals/kelas/QuizModal";

function KelasDosenDetail() {
    useTokenValidation();
    const { id_kelas } = useParams();
    const navigate = useNavigate(); // Initialize navigate
    const token = localStorage.getItem("access_token");
    const [classDetail, setClassDetail] = useState(null);
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
    const [quizzes, setQuizzes] = useState([]);

    const baseUrl = `${process.env.REACT_APP_API_BASE_URL}`;

    // Fetch class details based on id_kelas
    const fetchClassDetail = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/class/classes/${id_kelas}/`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setClassDetail(data);
        } catch (error) {
            console.error("Error fetching class details:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch topics related to the class
    const fetchTopics = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/topic/topics/`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data = await response.json();
            const filteredTopics = data.filter((topic) => topic.class_model === parseInt(id_kelas));
            setTopics(filteredTopics);
        } catch (error) {
            console.error("Error fetching topics:", error);
        }
    };

    useEffect(() => {
        fetchClassDetail();
        fetchTopics();
    }, [id_kelas]);

    // After a topic is added, create a discussion
    const handleTopicAdded = async (newTopic) => {
        setTopics((prevTopics) => [...prevTopics, newTopic]);

        try {
            await fetch(`${baseUrl}/api/discuss/discussions/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    topic: newTopic.topic_id,
                    title: `Discussion on ${newTopic.topic_name}`,
                }),
            });
            Swal.fire("Success", "Discussion created for the new topic!", "success");
        } catch (error) {
            console.error("Error creating discussion:", error);
            Swal.fire("Error", "Failed to create discussion for the topic.", "error");
        }
    };

    const handleDeleteTopic = async (topicId) => {
        const confirm = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: "Topik ini akan dihapus secara permanen!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
        });

        if (confirm.isConfirmed) {
            try {
                const response = await fetch(`${baseUrl}/api/topic/topics/${topicId}/`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    setTopics((prevTopics) => prevTopics.filter((topic) => topic.topic_id !== topicId));
                    Swal.fire('Dihapus!', 'Topik telah dihapus.', 'success');
                } else {
                    throw new Error("Gagal menghapus topik");
                }
            } catch (error) {
                console.error("Error deleting topic:", error);
                Swal.fire('Error!', 'Gagal menghapus topik.', 'error');
            }
        }
    };

    const handleGoToDiscussion = (topicId) => {
        navigate(`/discuss/${topicId}`); // Navigate to discussion page with the topic ID
    };

    if (loading) {
        return <p>Loading class details...</p>;
    }

    if (!classDetail) {
        return <p>Class not found.</p>;
    }
    // Fetch quizzes if needed
    const handleQuizCreated = (newQuiz) => {
        setQuizzes([...quizzes, newQuiz]);
    };


    return (
        <>
            <section className="section">
                <div className="section-header">
                    <h1>Kelas</h1>
                </div>
                <h2 className="section-title">{classDetail.class_name_long}</h2>

                <div className="row">
                    {/* Cards for different actions */}
                    <div className="col-lg-4 col-md-6 col-sm-6 col-12">
                        <div className="card card-statistic-1">
                            <div className="card-icon bg-primary">
                                <i className="far fa-user" />
                            </div>
                            <div className="card-wrap">
                                <div className="card-header">
                                    <h4>Total Topik</h4>
                                </div>
                                <div className="card-body">
                                    <button onClick={() => setIsTopicModalOpen(true)} className="btn btn-icon icon-left btn-primary">
                                        <i className="far fa-edit" /> Kelola Topik
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-6 col-12">
                        <div className="card card-statistic-1">
                            <div className="card-icon bg-danger">
                                <i className="far fa-newspaper" />
                            </div>
                            <div className="card-wrap">
                                <div className="card-header">
                                    <h4>Kuis</h4>
                                </div>
                                <div className="card-body">
                                    <button onClick={() => setIsQuizModalOpen(true)} className="btn btn-icon icon-left btn-primary">

                                        <i className="far fa-edit" /> Tambah Kuis
                                        Tambah Kuis</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-6 col-12">
                        <div className="card card-statistic-1">
                            <div className="card-icon bg-info">
                                <i className="fas fa-users" />
                            </div>
                            <div className="card-wrap">
                                <div className="card-header">
                                    <h4>Mahasiswa</h4>
                                </div>
                                <div className="card-body">
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="btn btn-icon icon-left btn-primary"
                                    >
                                        <i className="fa fa-plus" /> Tambah Mahasiswa
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Class Description */}
                <div className="col-12 mb-4">
                    <div className="hero text-white hero-bg-image hero-bg-parallax">
                        <div className="hero-inner">
                            <h2>{classDetail.class_name_long}</h2>
                            <p className="lead">{classDetail.description}</p>
                        </div>
                    </div>
                </div>

                {/* Topics Accordion */}
                <div className="card">
                    <div className="card-header">
                        <h4>Topik</h4>
                    </div>
                    <div className="card-body">
                        <div id="accordion">
                            {topics.map((topic) => (
                                <div key={topic.topic_id} className="accordion">
                                    <div
                                        className="accordion-header"
                                        role="button"
                                        data-toggle="collapse"
                                        data-target={`#panel-body-${topic.topic_id}`}
                                        aria-expanded="true"
                                    >
                                        <h4>{topic.topic_name}</h4>
                                    </div>
                                    <div
                                        className="accordion-body collapse"
                                        id={`panel-body-${topic.topic_id}`}
                                        data-parent="#accordion"
                                    >
                                        <div dangerouslySetInnerHTML={{ __html: topic.description }} />
                                        {topic.module_file && (
                                            <a href={topic.module_file} target="_blank" rel="noopener noreferrer" className="btn btn-info mt-2">
                                                View Module
                                            </a>
                                        )}
                                        <button
                                            onClick={() => handleDeleteTopic(topic.topic_id)}
                                            className="btn btn-danger mt-2 mx-2"
                                        >
                                            Delete Topic
                                        </button>
                                        <button
                                            onClick={() => handleGoToDiscussion(topic.topic_id)}
                                            className="btn btn-secondary mt-2"
                                        >
                                            Discussion
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Modals */}
                <EnrollmentModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    token={token}
                />
                <TopicModal
                    isOpen={isTopicModalOpen}
                    onClose={() => setIsTopicModalOpen(false)}
                    onSave={handleTopicAdded}
                    token={token}
                    classModel={id_kelas}
                />
                <QuizModal
                    isOpen={isQuizModalOpen}
                    onClose={() => setIsQuizModalOpen(false)}
                    token={token}
                    topics={topics}
                    onQuizCreated={handleQuizCreated}
                />
            </section>
        </>
    );
}

export default KelasDosenDetail;
