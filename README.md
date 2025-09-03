# Document Processing System

A modern web application for uploading PDF documents, converting them to base64, and processing them through external APIs. Built with Flask, featuring a beautiful responsive UI with drag-and-drop functionality.

## ✨ Features

- **Modern UI/UX**: Beautiful, responsive design with smooth animations
- **Drag & Drop**: Intuitive file upload with drag-and-drop support
- **File Validation**: PDF and PNG uploads with size limits (16MB max)
- **Base64 Conversion**: Automatic conversion of PDF and PNG files to base64 format
- **API Integration**: Configurable external API calls with authentication support
- **Progress Tracking**: Visual progress indicators during processing
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Mobile Responsive**: Optimized for all device sizes

## 🚀 Quick Start

### Prerequisites

- Python 3.7 or higher
- pip (Python package installer)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd doc-understanding-poc
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your API configuration
   ```

5. **Run the application**
   ```bash
   python main.py
   # or
   flask run
   ```

6. **Open your browser**
   Navigate to `http://localhost:8000`

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
API_ENDPOINT=https://your-api-endpoint.com/process
API_KEY=your_api_key_here

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True

# File Upload Configuration
MAX_FILE_SIZE=16777216  # 16MB in bytes
UPLOAD_FOLDER=uploads
```

### API Configuration

- **API_ENDPOINT**: The URL of your external API endpoint (defaults to Document Understanding API)
- **API_KEY**: Your API authentication key (if required)

**Default API**: The application is pre-configured to work with the Document Understanding API at `http://document-understanding.rased.io/v1/document-verification`

## 📁 Project Structure

```
doc-understanding-poc/
├── app.py                 # Main Flask application
├── main.py               # Application entry point
├── requirements.txt      # Python dependencies
├── env.example          # Environment variables template
├── README.md            # This file
├── templates/           # HTML templates
│   └── index.html      # Main application page
├── static/             # Static assets
│   ├── css/
│   │   └── style.css   # Application styles
│   └── js/
│       └── script.js   # Frontend JavaScript
└── uploads/            # File upload directory (auto-created)
```

## 🔧 API Integration

The application automatically:

1. Converts uploaded PDF files to base64
2. Sends the base64 data to the Document Understanding API at `http://document-understanding.rased.io/v1/document-verification`
3. Handles API responses and displays results
4. Manages authentication headers if an API key is provided

### API Endpoint
- **URL**: `http://document-understanding.rased.io/v1/document-verification`
- **Method**: POST
- **Content-Type**: application/json

### API Request Format

```json
{
  "file_base64": "data:application/pdf;base64,base64_encoded_pdf_content",
  "mime_type": "application/pdf",
  "extraction_only": true
}
```

**Supported File Types:**
- **PDF**: `data:application/pdf;base64,...`
- **PNG**: `data:image/png;base64,...`

### API Response Handling

The application expects your API to return a JSON response. Success responses are displayed in a formatted card, while errors are shown with appropriate error messages.

## 🎨 Customization

### Styling

- Modify `static/css/style.css` to customize the appearance
- The design uses CSS custom properties for easy color scheme changes
- Responsive breakpoints are defined for mobile optimization

### Functionality

- Edit `static/js/script.js` to modify frontend behavior
- Update `app.py` to change backend logic
- Modify file size limits and allowed file types in the Flask app

## 🚀 Deployment

### Production Deployment

1. **Set production environment variables**
   ```env
   FLASK_ENV=production
   FLASK_DEBUG=False
   ```

2. **Use a production WSGI server**
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:8000 app:app
   ```

3. **Set up reverse proxy (nginx recommended)**
4. **Configure SSL certificates**
5. **Set up proper file upload limits**

### Docker Deployment

```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["python", "main.py"]
```

## 🧪 Testing

### Manual Testing

1. Upload a PDF or PNG file using drag-and-drop
2. Verify base64 conversion
3. Test API integration with your endpoint
4. Check error handling with invalid files

### Automated Testing

```bash
# Install testing dependencies
pip install pytest pytest-flask

# Run tests
pytest
```

## 🔒 Security Considerations

- File type validation (PDF only)
- File size limits (16MB max)
- Secure filename handling
- Environment variable configuration
- Input sanitization

## 🐛 Troubleshooting

### Common Issues

1. **File upload fails**
   - Check file size (must be < 16MB)
   - Ensure file is a valid PDF or PNG
   - Verify upload directory permissions

2. **API calls fail**
   - Check API endpoint configuration
   - Verify API key if required
   - Check network connectivity

3. **Styling issues**
   - Clear browser cache
   - Check CSS file paths
   - Verify static file serving

### Debug Mode

Enable debug mode for detailed error messages:

```bash
export FLASK_DEBUG=True
python main.py
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the troubleshooting section
- Review the configuration options

---

**Built with ❤️ using Flask, HTML5, CSS3, and JavaScript**
