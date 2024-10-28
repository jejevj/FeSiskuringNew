import React from "react";
import useTokenValidation from "../hook/TokenValidation";

function Homepage() {
    useTokenValidation();
    return (
        <>
            <section className="section mt-3">
                <div className="row">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header">
                                <h4>Invoices</h4>
                                <div className="card-header-action">
                                    <a href="#" className="btn btn-danger">View More <i className="fas fa-chevron-right" /></a>
                                </div>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive table-invoice">
                                    <table className="table table-striped">
                                        <tbody><tr>
                                            <th>Invoice ID</th>
                                            <th>Customer</th>
                                            <th>Status</th>
                                            <th>Due Date</th>
                                            <th>Action</th>
                                        </tr>
                                            <tr>
                                                <td><a href="#">INV-87239</a></td>
                                                <td className="font-weight-600">Kusnadi</td>
                                                <td><div className="badge badge-warning">Unpaid</div></td>
                                                <td>July 19, 2018</td>
                                                <td>
                                                    <a href="#" className="btn btn-primary">Detail</a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><a href="#">INV-48574</a></td>
                                                <td className="font-weight-600">Hasan Basri</td>
                                                <td><div className="badge badge-success">Paid</div></td>
                                                <td>July 21, 2018</td>
                                                <td>
                                                    <a href="#" className="btn btn-primary">Detail</a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><a href="#">INV-76824</a></td>
                                                <td className="font-weight-600">Muhamad Nuruzzaki</td>
                                                <td><div className="badge badge-warning">Unpaid</div></td>
                                                <td>July 22, 2018</td>
                                                <td>
                                                    <a href="#" className="btn btn-primary">Detail</a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><a href="#">INV-84990</a></td>
                                                <td className="font-weight-600">Agung Ardiansyah</td>
                                                <td><div className="badge badge-warning">Unpaid</div></td>
                                                <td>July 22, 2018</td>
                                                <td>
                                                    <a href="#" className="btn btn-primary">Detail</a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><a href="#">INV-87320</a></td>
                                                <td className="font-weight-600">Ardian Rahardiansyah</td>
                                                <td><div className="badge badge-success">Paid</div></td>
                                                <td>July 28, 2018</td>
                                                <td>
                                                    <a href="#" className="btn btn-primary">Detail</a>
                                                </td>
                                            </tr>
                                        </tbody></table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card card-hero">
                            <div className="card-header">
                                <div className="card-icon">
                                    <i className="far fa-question-circle" />
                                </div>
                                <h4>14</h4>
                                <div className="card-description">Pengumuman</div>
                            </div>
                            <div className="card-body p-0">
                                <div className="tickets-list">
                                    <a href="#" className="ticket-item">
                                        <div className="ticket-title">
                                            <h4>My order hasn't arrived yet</h4>
                                        </div>
                                        <div className="ticket-info">
                                            <div>Laila Tazkiah</div>
                                            <div className="bullet" />
                                            <div className="text-primary">1 min ago</div>
                                        </div>
                                    </a>
                                    <a href="#" className="ticket-item">
                                        <div className="ticket-title">
                                            <h4>Please cancel my order</h4>
                                        </div>
                                        <div className="ticket-info">
                                            <div>Rizal Fakhri</div>
                                            <div className="bullet" />
                                            <div>2 hours ago</div>
                                        </div>
                                    </a>
                                    <a href="#" className="ticket-item">
                                        <div className="ticket-title">
                                            <h4>Do you see my mother?</h4>
                                        </div>
                                        <div className="ticket-info">
                                            <div>Syahdan Ubaidillah</div>
                                            <div className="bullet" />
                                            <div>6 hours ago</div>
                                        </div>
                                    </a>
                                    <a href="features-tickets.html" className="ticket-item ticket-more">
                                        View All <i className="fas fa-chevron-right" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section></>
    );
}

export default Homepage;