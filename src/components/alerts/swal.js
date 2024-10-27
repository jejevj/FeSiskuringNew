// src/components/SweetAlert.js
import Swal from 'sweetalert2';

const SweetAlert = {
    showAlert: (title, text, icon, confirmButtonText = 'OK') => {
        return Swal.fire({
            title: title,
            text: text,
            icon: icon,
            confirmButtonText: confirmButtonText,
        });
    },

    showConfirmation: (title, text, confirmButtonText = 'Yes', cancelButtonText = 'No') => {
        return Swal.fire({
            title: title,
            text: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: confirmButtonText,
            cancelButtonText: cancelButtonText,
        });
    }
};

export default SweetAlert;
