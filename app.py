from flask import Flask, render_template, request, jsonify
import base64
import requests
import os
from werkzeug.utils import secure_filename
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['UPLOAD_FOLDER'] = 'uploads'

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Allowed file extensions
ALLOWED_EXTENSIONS = {'pdf', 'png'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if file and allowed_file(file.filename):
            # Read file content and convert to base64
            file_content = file.read()
            base64_content = base64.b64encode(file_content).decode('utf-8')
            
            # Get API endpoint from environment or use default
            api_endpoint = os.getenv('API_ENDPOINT', 'http://document-understanding.rased.io/v1/document-verification')
            
            # Determine file type and MIME type
            file_extension = file.filename.rsplit('.', 1)[1].lower()
            if file_extension == 'pdf':
                mime_type = 'application/pdf'
                data_url_prefix = 'data:application/pdf;base64,'
            elif file_extension == 'png':
                mime_type = 'image/png'
                data_url_prefix = 'data:image/png;base64,'
            else:
                mime_type = 'application/octet-stream'
                data_url_prefix = 'data:application/octet-stream;base64,'
            
            # Prepare the API request according to the specified format
            api_payload = {
                'file_base64': f"{data_url_prefix}{base64_content}",
                'mime_type': mime_type,
                'extraction_only': True
            }
            
            # Make API call
            try:
                headers = {'Content-Type': 'application/json'}
                if os.getenv('API_KEY'):
                    headers['Authorization'] = f'Bearer {os.getenv("API_KEY")}'
                
                response = requests.post(
                    api_endpoint,
                    json=api_payload,
                    headers=headers,
                    timeout=30
                )
                
                if response.status_code == 200:
                    return jsonify({
                        'success': True,
                        'message': 'Document processed successfully',
                        'filename': secure_filename(file.filename),
                        'api_response': response.json(),
                        'base64_length': len(base64_content)
                    })
                else:
                    return jsonify({
                        'success': False,
                        'error': f'API call failed with status {response.status_code}',
                        'api_response': response.text
                    }), 400
                    
            except requests.exceptions.RequestException as e:
                return jsonify({
                    'success': False,
                    'error': f'API call failed: {str(e)}'
                }), 500
                
        else:
            return jsonify({'error': 'Invalid file type. Only PDF files are allowed.'}), 400
            
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/health')
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Document processing service is running'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(debug=True, host='0.0.0.0', port=port)
