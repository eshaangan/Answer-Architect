#!/usr/bin/env python3
"""
Simple test script for the GPT Wrapper API
Run this after starting the server to verify functionality
"""

import requests
import json
import os
from typing import Dict, Any

# Configuration
BASE_URL = "http://localhost:8000"
API_TOKEN = os.getenv("API_SECRET_KEY", "your-secret-key-here")

def make_request(endpoint: str, data: Dict[str, Any] = None) -> Dict[str, Any]:
    """Make a request to the API"""
    headers = {
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json"
    }
    
    if data:
        response = requests.post(f"{BASE_URL}{endpoint}", headers=headers, json=data)
    else:
        response = requests.get(f"{BASE_URL}{endpoint}", headers=headers)
    
    return {
        "status_code": response.status_code,
        "response": response.json() if response.headers.get("content-type", "").startswith("application/json") else response.text
    }

def test_health_check():
    """Test the health check endpoint"""
    print("🔍 Testing health check...")
    result = make_request("/health")
    print(f"Status: {result['status_code']}")
    print(f"Response: {json.dumps(result['response'], indent=2)}")
    return result['status_code'] == 200

def test_main_endpoint():
    """Test the main prompt endpoint"""
    print("\n🔍 Testing main prompt endpoint...")
    test_data = {"text": "help me write a python function"}
    result = make_request("/prompt", test_data)
    print(f"Status: {result['status_code']}")
    print(f"Response: {json.dumps(result['response'], indent=2)}")
    return result['status_code'] == 200

def test_debug_endpoint():
    """Test the debug endpoint"""
    print("\n🔍 Testing debug endpoint...")
    test_data = {"text": "explain machine learning"}
    result = make_request("/prompt/debug", test_data)
    print(f"Status: {result['status_code']}")
    print(f"Response: {json.dumps(result['response'], indent=2)}")
    return result['status_code'] == 200

def test_root_endpoint():
    """Test the root endpoint"""
    print("\n🔍 Testing root endpoint...")
    result = make_request("/")
    print(f"Status: {result['status_code']}")
    print(f"Response: {json.dumps(result['response'], indent=2)}")
    return result['status_code'] == 200

def main():
    """Run all tests"""
    print("🚀 Starting GPT Wrapper API Tests")
    print(f"Base URL: {BASE_URL}")
    print(f"API Token: {API_TOKEN[:10]}..." if len(API_TOKEN) > 10 else API_TOKEN)
    
    tests = [
        ("Health Check", test_health_check),
        ("Root Endpoint", test_root_endpoint),
        ("Main Prompt Endpoint", test_main_endpoint),
        ("Debug Endpoint", test_debug_endpoint),
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            success = test_func()
            results.append((test_name, success))
            print(f"✅ {test_name}: {'PASSED' if success else 'FAILED'}")
        except Exception as e:
            print(f"❌ {test_name}: ERROR - {str(e)}")
            results.append((test_name, False))
    
    print("\n📊 Test Summary:")
    passed = sum(1 for _, success in results if success)
    total = len(results)
    print(f"Passed: {passed}/{total}")
    
    if passed == total:
        print("🎉 All tests passed!")
    else:
        print("⚠️  Some tests failed. Check the output above.")

if __name__ == "__main__":
    main() 