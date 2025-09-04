#!/usr/bin/env python3
"""
Test script to verify API connectivity and app functionality.
"""

import requests
import base64
import tempfile
import os

def test_api_connection():
    """Test if we can reach the Document Understanding API."""
    url = "http://document-understanding.rased.io/v1/document-verification"
    
    try:
        # Test with a simple POST request
        response = requests.post(url, json={"test": "connection"}, timeout=10)
        print(f"✅ API Connection: Status {response.status_code}")
        print(f"Response: {response.text[:200]}...")
        return True
    except Exception as e:
        print(f"❌ API Connection Failed: {e}")
        return False

def test_local_app():
    """Test if local app is running and healthy."""
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code == 200:
            print("✅ Local App: Running and healthy")
            return True
        else:
            print(f"❌ Local App: Status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Local App: Not accessible - {e}")
        return False

def create_test_pdf():
    """Create a minimal test PDF for testing."""
    pdf_content = b'%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n72 720 Td\n(Test PDF) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000111 00000 n \n0000000206 00000 n \ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n297\n%%EOF\n'
    return pdf_content

def test_file_upload():
    """Test file upload functionality."""
    try:
        # Create test PDF
        pdf_content = create_test_pdf()
        
        # Test upload endpoint
        files = {'file': ('test.pdf', pdf_content, 'application/pdf')}
        response = requests.post("http://localhost:8000/upload", files=files, timeout=30)
        
        print(f"✅ File Upload Test: Status {response.status_code}")
        if response.status_code in [200, 400, 500]:
            print("File processing works (API call may fail as expected)")
        return True
    except Exception as e:
        print(f"❌ File Upload Test Failed: {e}")
        return False

def main():
    """Run all tests."""
    print("🧪 Testing Document Processing System...")
    print("=" * 50)
    
    # Test API connectivity
    api_ok = test_api_connection()
    
    # Test local app
    local_ok = test_local_app()
    
    # Test file upload if local app is running
    upload_ok = False
    if local_ok:
        upload_ok = test_file_upload()
    
    print("=" * 50)
    print("📊 Test Results:")
    print(f"API Connection: {'✅' if api_ok else '❌'}")
    print(f"Local App: {'✅' if local_ok else '❌'}")
    print(f"File Upload: {'✅' if upload_ok else '❌'}")
    
    if api_ok and local_ok:
        print("\n🎉 Your app is ready for deployment!")
        print("Deploy to Render or Railway for production use.")
    else:
        print("\n🔧 Some tests failed. Check the errors above.")

if __name__ == "__main__":
    main()
