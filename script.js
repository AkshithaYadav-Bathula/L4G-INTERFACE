document.addEventListener('DOMContentLoaded', function () {
    const registrationForm = document.getElementById('registrationForm');
    const submitButton = document.getElementById('submitButton');

    async function validateCourseCompletion(email) {
        try {
            const url = `thisapiishidden`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok. Status: ${response.status}`);
            }

            const data = await response.json();
            return data.exists === true;
        } catch (error) {
            console.error('Course validation error:', error);
            return false;
        }
    }

    function showPreviewModal(formData) {
        const modalOverlay = document.createElement('div');
        modalOverlay.style.position = 'fixed';
        modalOverlay.style.top = '0';
        modalOverlay.style.left = '0';
        modalOverlay.style.width = '100%';
        modalOverlay.style.height = '100%';
        modalOverlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
        modalOverlay.style.display = 'flex';
        modalOverlay.style.justifyContent = 'center';
        modalOverlay.style.alignItems = 'center';
        modalOverlay.style.zIndex = '1000';

        const modalContent = document.createElement('div');
        modalContent.style.backgroundColor = 'white';
        modalContent.style.padding = '30px';
        modalContent.style.borderRadius = '10px';
        modalContent.style.textAlign = 'left';
        modalContent.style.maxWidth = '500px';
        modalContent.style.width = '90%';
        modalContent.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';

        const modalTitle = document.createElement('h3');
        modalTitle.textContent = 'Please Confirm Your Details';
        modalTitle.style.marginBottom = '20px';
        modalTitle.style.color = '#19687b';
        modalTitle.style.textAlign = 'center';

        const detailsList = document.createElement('div');
        detailsList.style.marginBottom = '20px';
        detailsList.style.backgroundColor = '#f8f9fa';
        detailsList.style.padding = '20px';
        detailsList.style.borderRadius = '8px';

        const details = [
            { label: 'Full Name', value: formData.name },
            { label: 'Email', value: formData.email },
            { label: 'Mobile Number', value: formData.contact }
        ];

        details.forEach(detail => {
            const detailRow = document.createElement('div');
            detailRow.style.marginBottom = '15px';
            detailRow.style.display = 'flex';
            detailRow.style.alignItems = 'center';
            
            const label = document.createElement('strong');
            label.textContent = `${detail.label}: `;
            label.style.color = '#333';
            label.style.minWidth = '120px';
            
            const value = document.createElement('span');
            value.textContent = detail.value;
            value.style.marginLeft = '10px';
            
            detailRow.appendChild(label);
            detailRow.appendChild(value);
            detailsList.appendChild(detailRow);
        });

        const confirmationContainer = document.createElement('div');
        confirmationContainer.style.display = 'flex';
        confirmationContainer.style.alignItems = 'center';
        confirmationContainer.style.padding = '10px 0';
        confirmationContainer.style.marginBottom = '20px';
        confirmationContainer.style.marginLeft = '10px';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'confirmDetails';
        checkbox.style.margin = '0';
        checkbox.style.cursor = 'pointer';
        checkbox.style.width = '16px';
        checkbox.style.height = '16px';
        
        const checkboxLabel = document.createElement('label');
        checkboxLabel.htmlFor = 'confirmDetails';
        checkboxLabel.textContent = 'I confirm that all details are correct';
        checkboxLabel.style.color = '#333';
        checkboxLabel.style.cursor = 'pointer';
        checkboxLabel.style.margin = '0';
        checkboxLabel.style.marginLeft = '10px';
        checkboxLabel.style.whiteSpace = 'nowrap';
        checkboxLabel.style.fontSize = '14px';

        confirmationContainer.appendChild(checkbox);
        confirmationContainer.appendChild(checkboxLabel);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.justifyContent = 'center';
        buttonContainer.style.marginTop = '20px';

        const proceedButton = document.createElement('button');
        proceedButton.textContent = 'Proceed to Payment';
        proceedButton.style.backgroundColor = '#ee8625';
        proceedButton.style.color = 'white';
        proceedButton.style.border = 'none';
        proceedButton.style.padding = '12px 24px';
        proceedButton.style.borderRadius = '5px';
        proceedButton.style.cursor = 'pointer';
        proceedButton.style.fontSize = '14px';
        proceedButton.style.fontWeight = 'bold';
        proceedButton.disabled = true;
        proceedButton.style.opacity = '0.5';
        proceedButton.style.transition = 'all 0.3s ease';

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit Details';
        editButton.style.backgroundColor = '#19687b';
        editButton.style.color = 'white';
        editButton.style.border = 'none';
        editButton.style.padding = '12px 24px';
        editButton.style.borderRadius = '5px';
        editButton.style.cursor = 'pointer';
        editButton.style.fontSize = '14px';
        editButton.style.fontWeight = 'bold';
        editButton.style.transition = 'all 0.3s ease';

        checkbox.addEventListener('change', function() {
            proceedButton.disabled = !this.checked;
            proceedButton.style.opacity = this.checked ? '1' : '0.5';
            editButton.disabled = this.checked;
            editButton.style.opacity = this.checked ? '0.5' : '1';
            editButton.style.cursor = this.checked ? 'not-allowed' : 'pointer';
            editButton.style.backgroundColor = this.checked ? '#a0a0a0' : '#19687b';
        });

        editButton.addEventListener('click', () => {
            if (!checkbox.checked) {
                document.body.removeChild(modalOverlay);
            }
        });

        proceedButton.addEventListener('click', async () => {
            if (checkbox.checked) {
                document.body.removeChild(modalOverlay);
                await handlePaymentProcessing(formData);
            }
        });

        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(proceedButton);

        modalContent.appendChild(modalTitle);
        modalContent.appendChild(detailsList);
        modalContent.appendChild(confirmationContainer);
        modalContent.appendChild(buttonContainer);
        modalOverlay.appendChild(modalContent);

        document.body.appendChild(modalOverlay);
    }

    function showMessageModal(message, autoRefresh = false) {
        const modalOverlay = document.createElement('div');
        modalOverlay.style.position = 'fixed';
        modalOverlay.style.top = '0';
        modalOverlay.style.left = '0';
        modalOverlay.style.width = '100%';
        modalOverlay.style.height = '100%';
        modalOverlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
        modalOverlay.style.display = 'flex';
        modalOverlay.style.justifyContent = 'center';
        modalOverlay.style.alignItems = 'center';
        modalOverlay.style.zIndex = '1000';

        const modalContent = document.createElement('div');
        modalContent.style.backgroundColor = 'white';
        modalContent.style.padding = '30px';
        modalContent.style.borderRadius = '10px';
        modalContent.style.textAlign = 'center';
        modalContent.style.maxWidth = '400px';
        modalContent.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';

        const modalMessage = document.createElement('p');
        modalMessage.textContent = message;
        modalMessage.style.marginBottom = '20px';
        modalMessage.style.fontSize = '16px';

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.backgroundColor = '#19687b';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.padding = '10px 20px';
        closeButton.style.borderRadius = '5px';
        closeButton.style.cursor = 'pointer';

        closeButton.addEventListener('click', () => {
            document.body.removeChild(modalOverlay);
            if (autoRefresh) {
                registrationForm.reset();
                window.location.reload();
            }
        });

        modalContent.appendChild(modalMessage);
        modalContent.appendChild(closeButton);
        modalOverlay.appendChild(modalContent);

        document.body.appendChild(modalOverlay);
    }

    async function handlePaymentProcessing(formData) {
        submitButton.classList.add('loading');
        
        try {
            const response = await fetch('https://razorpay-payment-link-creation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const responseData = await response.json();

            if (response.ok && responseData.payment_link.status === 'created') {
                showMessageModal('Dear student, payment link has been generated successfully. Please check your registered email and mobile number for payment instructions.', true);
                submitButton.disabled = true;
                submitButton.style.opacity = '0.5';
                submitButton.style.cursor = 'not-allowed';
            } else {
                const errorMessage = responseData.message || 'Payment link generation failed. Please try again or contact support.';
                showMessageModal(errorMessage, true);
            }
        } catch (error) {
            console.error('Error:', error);
            showMessageModal('Something went wrong. Please check your network connection or try again later.', true);
        } finally {
            submitButton.classList.remove('loading');
        }
    }

    function validateName(name) {
        const trimmedName = name.trim();
        const nameRegex = /^[A-Za-z\s-]+$/;
        return {
            isValid: nameRegex.test(trimmedName),
            processedName: trimmedName
        };
    }

    registrationForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const mobileInput = document.getElementById('mobile');

        const nameError = document.getElementById('nameError');
        const emailError = document.getElementById('emailError');
        const mobileError = document.getElementById('mobileError');

        nameError.textContent = '';
        emailError.textContent = '';
        mobileError.textContent = '';

        const nameValidation = validateName(nameInput.value);
        if (!nameValidation.isValid) {
            nameError.textContent = 'Name should only contain letters, spaces, and hyphens';
            return;
        }
        nameInput.value = nameValidation.processedName;

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|in|ac\.in|edu)$/;
        const email = emailInput.value.trim();
        if (!email) {
            emailError.textContent = 'This field is required';
            return;
        } else if (!emailRegex.test(email)) {
            emailError.textContent = 'Please enter a valid email address';
            return;
        }

        const mobile = mobileInput.value.trim();
        if (!mobile) {
            mobileError.textContent = 'This field is required';
            return;
        } else if (!/^\d{10}$/.test(mobile)) {
            mobileError.textContent = 'Mobile number must be exactly 10 digits';
            return;
        }

        submitButton.classList.add('loading');
        const courseCompleted = await validateCourseCompletion(email);

        if (!courseCompleted) {
            submitButton.classList.remove('loading');
            showMessageModal('Dear Student, you have not completed the course. Please complete the course before proceeding to payment or check your details.', true);
            return;
        }

        submitButton.classList.remove('loading');

        const formData = {
            name: nameValidation.processedName,
            email: email,
            contact: `+91 ${mobile}`
        };

        showPreviewModal(formData);
    });

    ['name', 'email', 'mobile'].forEach(fieldId => {
        document.getElementById(fieldId).addEventListener('input', function () {
            document.getElementById(`${fieldId}Error`).textContent = '';
        });
    });
});