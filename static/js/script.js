// DOM elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const removeFile = document.getElementById('removeFile');
const processButton = document.getElementById('processButton');
const progressSection = document.getElementById('progressSection');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const resultsSection = document.getElementById('resultsSection');
const successCard = document.getElementById('successCard');
const errorCard = document.getElementById('errorCard');
const successMessage = document.getElementById('successMessage');
const resultFileName = document.getElementById('resultFileName');
const base64Length = document.getElementById('base64Length');
const apiResponse = document.getElementById('apiResponse');
const errorMessage = document.getElementById('errorMessage');

// Global variables
let selectedFile = null;

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
});

function setupEventListeners() {
    // File input change
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop events
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    
    // Click to upload
    uploadArea.addEventListener('click', () => fileInput.click());
    
    // Remove file
    removeFile.addEventListener('click', removeSelectedFile);
    
    // Process button
    processButton.addEventListener('click', processDocument);
}

// Drag and drop handlers
function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}

// File selection handler
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

// File handling
function handleFile(file) {
    // Validate file type
    if (!file.type.includes('pdf') && !file.type.includes('png')) {
        showError('Please select a valid PDF or PNG file.');
        return;
    }
    
    // Validate file size (16MB)
    if (file.size > 16 * 1024 * 1024) {
        showError('File size must be less than 16MB.');
        return;
    }
    
    selectedFile = file;
    displayFileInfo(file);
    showProcessButton();
    hideResults();
}

function displayFileInfo(file) {
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    
    // Set appropriate icon based on file type
    const fileTypeIcon = document.getElementById('fileTypeIcon');
    if (file.type.includes('pdf')) {
        fileTypeIcon.className = 'fas fa-file-pdf file-icon';
        fileTypeIcon.style.color = '#dc3545'; // Red for PDF
    } else if (file.type.includes('png')) {
        fileTypeIcon.className = 'fas fa-file-image file-icon';
        fileTypeIcon.style.color = '#28a745'; // Green for PNG
    } else {
        fileTypeIcon.className = 'fas fa-file file-icon';
        fileTypeIcon.style.color = '#6c757d'; // Gray for unknown
    }
    
    fileInfo.style.display = 'block';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function removeSelectedFile() {
    selectedFile = null;
    fileInput.value = '';
    fileInfo.style.display = 'none';
    processButton.style.display = 'none';
    hideResults();
}

function showProcessButton() {
    processButton.style.display = 'inline-flex';
}

function hideResults() {
    resultsSection.style.display = 'none';
    successCard.style.display = 'none';
    errorCard.style.display = 'none';
    
    // Reset verification results
    document.getElementById('ownerIdValue').textContent = '-';
    document.getElementById('ownerIdConfidence').textContent = '-';
    document.getElementById('licenseNoValue').textContent = '-';
    document.getElementById('licenseNoConfidence').textContent = '-';
}

// Document processing
async function processDocument() {
    if (!selectedFile) {
        showError('No file selected.');
        return;
    }
    
    try {
        // Show progress
        showProgress();
        processButton.disabled = true;
        
        // Create FormData
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        // Make API call
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        // Hide progress
        hideProgress();
        processButton.disabled = false;
        
        // Handle response
        if (result.success) {
            showSuccess(result);
        } else {
            showError(result.error || 'An error occurred while processing the document.');
        }
        
    } catch (error) {
        console.error('Error:', error);
        hideProgress();
        processButton.disabled = false;
        showError('Network error. Please check your connection and try again.');
    }
}

function showProgress() {
    progressSection.style.display = 'block';
    progressFill.style.animation = 'progress-animation 2s ease-in-out infinite';
}

function hideProgress() {
    progressSection.style.display = 'none';
    progressFill.style.animation = 'none';
}

function showSuccess(result) {
    successMessage.textContent = result.message;
    resultFileName.textContent = result.filename;
    base64Length.textContent = result.base64_length.toLocaleString();
    
    // Handle API response and populate verification results
    if (result.api_response) {
        // Display raw API response
        apiResponse.textContent = JSON.stringify(result.api_response, null, 2);
        
        // Populate verification results if available
        if (result.api_response.owner_id_value !== undefined) {
            document.getElementById('ownerIdValue').textContent = result.api_response.owner_id_value;
            document.getElementById('ownerIdConfidence').textContent = 
                `${(result.api_response.owner_id_confidence * 100).toFixed(1)}%`;
        }
        
        if (result.api_response.license_no_value !== undefined) {
            document.getElementById('licenseNoValue').textContent = result.api_response.license_no_value;
            document.getElementById('licenseNoConfidence').textContent = 
                `${(result.api_response.license_no_confidence * 100).toFixed(1)}%`;
        }
    } else {
        apiResponse.textContent = 'No API response data';
        // Reset verification results
        document.getElementById('ownerIdValue').textContent = '-';
        document.getElementById('ownerIdConfidence').textContent = '-';
        document.getElementById('licenseNoValue').textContent = '-';
        document.getElementById('licenseNoConfidence').textContent = '-';
    }
    
    successCard.style.display = 'block';
    resultsSection.style.display = 'block';
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

function showError(message) {
    errorMessage.textContent = message;
    errorCard.style.display = 'block';
    resultsSection.style.display = 'block';
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Utility functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.background = '#28a745';
            break;
        case 'error':
            notification.style.background = '#dc3545';
            break;
        case 'warning':
            notification.style.background = '#ffc107';
            notification.style.color = '#333';
            break;
        default:
            notification.style.background = '#17a2b8';
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Add some visual feedback for better UX
function addVisualFeedback(element, className) {
    element.classList.add(className);
    setTimeout(() => {
        element.classList.remove(className);
    }, 200);
}

// Enhanced error handling with user-friendly messages
function getErrorMessage(error) {
    if (error.includes('NetworkError')) {
        return 'Network error. Please check your internet connection.';
    } else if (error.includes('timeout')) {
        return 'Request timed out. Please try again.';
    } else if (error.includes('413')) {
        return 'File too large. Please select a smaller file.';
    } else if (error.includes('415')) {
        return 'Unsupported file type. Please select a PDF file.';
    } else {
        return error;
    }
}

// Add loading states to buttons
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    } else {
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-cog"></i> Process Document';
    }
}

// File validation with better error messages
function validateFile(file) {
    const errors = [];
    
    if (!file.type.includes('pdf')) {
        errors.push('File must be a PDF document');
    }
    
    if (file.size > 16 * 1024 * 1024) {
        errors.push('File size must be less than 16MB');
    }
    
    if (file.size === 0) {
        errors.push('File appears to be empty');
    }
    
    return errors;
}
