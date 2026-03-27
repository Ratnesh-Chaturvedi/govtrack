#!/bin/bash

# API Testing Guide for Civic Integrity AI Backend
# Test the authentication endpoints using curl

API_URL="http://localhost:5000/api"

echo "╔════════════════════════════════════════════════════╗"
echo "║  Civic Integrity AI - API Testing Guide           ║"
echo "║  API URL: $API_URL                              ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Test 1: Health Check${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
curl -X GET http://localhost:5000/health
echo ""
echo ""

# Test 2: Register Citizen
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Test 2: Register as Citizen${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo "Creating citizen account..."
CITIZEN_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Rajesh Kumar",
    "email": "rajesh.citizen@example.com",
    "password": "SecurePass123!",
    "confirmPassword": "SecurePass123!",
    "phone": "+919876543210",
    "role": "citizen",
    "identificationId": "121324567890",
    "identificationType": "aadhaar",
    "citizenship": {
      "district": "Bangalore",
      "state": "Karnataka",
      "country": "India"
    }
  }')
echo "$CITIZEN_RESPONSE" | jq .
CITIZEN_TOKEN=$(echo "$CITIZEN_RESPONSE" | jq -r '.data.token')
echo -e "${GREEN}Token: $CITIZEN_TOKEN${NC}"
echo ""
echo ""

# Test 3: Register Government Official
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Test 3: Register as Government Official${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo "Creating government official account..."
OFFICIAL_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Priya Sharma",
    "email": "priya.official@gov.in",
    "password": "GovPass456!",
    "confirmPassword": "GovPass456!",
    "phone": "+918765432109",
    "role": "official",
    "identificationId": "EMP123456",
    "identificationType": "employee_id",
    "official": {
      "departmentName": "Ministry of Public Works",
      "designation": "Senior Administrator",
      "departmentCode": "MPW-001",
      "officeLocation": "New Delhi",
      "officePhone": "+91-11-23456789"
    }
  }')
echo "$OFFICIAL_RESPONSE" | jq .
OFFICIAL_TOKEN=$(echo "$OFFICIAL_RESPONSE" | jq -r '.data.token')
echo -e "${GREEN}Token: $OFFICIAL_TOKEN${NC}"
echo ""
echo ""

# Test 4: Register Contractor
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Test 4: Register as Contractor${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo "Creating contractor account..."
CONTRACTOR_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Arun Singh",
    "email": "arun.contractor@biz.in",
    "password": "ContractPass789!",
    "confirmPassword": "ContractPass789!",
    "phone": "+917654321098",
    "role": "contractor",
    "identificationId": "LICENSE987654",
    "identificationType": "license_id",
    "contractor": {
      "companyName": "Singh Construction Pvt Ltd",
      "registrationNumber": "REG/2020/12345",
      "businessCategory": "Civil Construction",
      "gstNumber": "27AABCU9603R1Z0",
      "bankAccount": {
        "accountNumber": "1234567890123456",
        "bankName": "State Bank of India",
        "ifscCode": "SBIN0001234"
      },
      "previousProjects": 15,
      "rating": 4.5
    }
  }')
echo "$CONTRACTOR_RESPONSE" | jq .
CONTRACTOR_TOKEN=$(echo "$CONTRACTOR_RESPONSE" | jq -r '.data.token')
echo -e "${GREEN}Token: $CONTRACTOR_TOKEN${NC}"
echo ""
echo ""

# Test 5: Register Media/Audit
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Test 5: Register as Media/Audit${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo "Creating media/audit account..."
MEDIA_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Neha Kapoor",
    "email": "neha.audit@investigate.com",
    "password": "MediaPass101!",
    "confirmPassword": "MediaPass101!",
    "phone": "+916543210987",
    "role": "media",
    "identificationId": "AUD2024001",
    "identificationType": "audit_license",
    "media": {
      "organizationName": "Transparency India",
      "licenseNumber": "MEDIA/2024/001",
      "licenseExpiry": "2025-12-31T23:59:59Z",
      "specialization": ["budget_audit", "infrastructure", "corruption_detection"]
    }
  }')
echo "$MEDIA_RESPONSE" | jq .
MEDIA_TOKEN=$(echo "$MEDIA_RESPONSE" | jq -r '.data.token')
echo -e "${GREEN}Token: $MEDIA_TOKEN${NC}"
echo ""
echo ""

# Test 6: Login Test
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Test 6: Login with Citizen Credentials${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "identificationId": "121324567890",
    "password": "SecurePass123!",
    "role": "citizen"
  }' | jq .
echo ""
echo ""

# Test 7: Verify Token
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Test 7: Verify JWT Token${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo "Verifying citizen token..."
curl -s -X GET "$API_URL/auth/verify" \
  -H "Authorization: Bearer $CITIZEN_TOKEN" | jq .
echo ""
echo ""

# Test 8: Get Current User
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Test 8: Get Current User Profile${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo "Fetching citizen profile..."
curl -s -X GET "$API_URL/auth/me" \
  -H "Authorization: Bearer $CITIZEN_TOKEN" | jq .
echo ""
echo ""

# Test 9: Test Wrong Password
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Test 9: Login with Wrong Password (Should Fail)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "identificationId": "121324567890",
    "password": "WrongPassword!",
    "role": "citizen"
  }' | jq .
echo ""
echo ""

# Test 10: Test Invalid Token
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Test 10: Verify Invalid Token (Should Fail)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
curl -s -X GET "$API_URL/auth/verify" \
  -H "Authorization: Bearer invalid_token_here" | jq .
echo ""
echo ""

echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}All tests completed!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo ""
echo "📝 Test Summary:"
echo "  ✓ Health Check"
echo "  ✓ Citizen Registration"
echo "  ✓ Official Registration"
echo "  ✓ Contractor Registration"
echo "  ✓ Media/Audit Registration"
echo "  ✓ Login Test"
echo "  ✓ Token Verification"
echo "  ✓ Get User Profile"
echo "  ✓ Invalid Credentials Test"
echo "  ✓ Invalid Token Test"
echo ""
