import React from "react";
import useTokenValidation from "../hook/TokenValidation";

function TesPage() {
    useTokenValidation();  // Check token validity on page load

    return (
        <>
            <p>Hi</p>
        </>
    );
}

export default TesPage;
