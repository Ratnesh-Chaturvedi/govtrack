# API Testing Guide for Civic Integrity AI Backend (Windows PowerShell)
# Test the authentication endpoints using Invoke-WebRequest

$API_URL = "http://localhost:5000/api"

Write-Host "╔════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Civic Integrity AI - API Testing Guide           ║" -ForegroundColor Cyan
Write-Host "║  API URL: $API_URL                              ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Blue
Write-Host "Test 1: Health Check" -ForegroundColor Blue
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Blue
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/health" -Method GET
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10 | Write-Host
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test 2: Register Citizen
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Blue
Write-Host "Test 2: Register as Citizen" -ForegroundColor Blue
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Blue
Write-Host "Creating citizen account..." -ForegroundColor Yellow
$citizenData = @{
    fullName = "Rajesh Kumar"
    email = "rajesh.citizen@example.com"
    password = "SecurePass123!"
    confirmPassword = "SecurePass123!"
    phone = "+919876543210"
    role = "citizen"
    identificationId = "121324567890"
    identificationType = "aadhaar"
    citizenship = @{
        district = "Bangalore"
        state = "Karnataka"
        country = "India"
    }
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$API_URL/auth/register" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json"} `
        -Body $citizenData
    $content = $response.Content | ConvertFrom-Json
    $content | ConvertTo-Json -Depth 10 | Write-Host
    $global:citizenToken = $content.data.token
    Write-Host "Token: $global:citizenToken" -ForegroundColor Green
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test 3: Register Government Official
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Blue
Write-Host "Test 3: Register as Government Official" -ForegroundColor Blue
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Blue
Write-Host "Creating government official account..." -ForegroundColor Yellow
$officialData = @{
    fullName = "Priya Sharma"
    email = "priya.official@gov.in"
    password = "GovPass456!"
    confirmPassword = "GovPass456!"
    phone = "+918765432109"
    role = "official"
    identificationId = "EMP123456"
    identificationType = "employee_id"
    official = @{
        departmentName = "Ministry of Public Works"
        designation = "Senior Administrator"
        departmentCode = "MPW-001"
        officeLocation = "New Delhi"
        officePhone = "+91-11-23456789"
    }
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$API_URL/auth/register" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json"} `
        -Body $officialData
    $content = $response.Content | ConvertFrom-Json
    $content | ConvertTo-Json -Depth 10 | Write-Host
    $global:officialToken = $content.data.token
    Write-Host "Token: $global:officialToken" -ForegroundColor Green
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test 4: Register Contractor
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Blue
Write-Host "Test 4: Register as Contractor" -ForegroundColor Blue
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Blue
Write-Host "Creating contractor account..." -ForegroundColor Yellow
$contractorData = @{
    fullName = "Arun Singh"
    email = "arun.contractor@biz.in"
    password = "ContractPass789!"
    confirmPassword = "ContractPass789!"
    phone = "+917654321098"
    role = "contractor"
    identificationId = "LICENSE987654"
    identificationType = "license_id"
    contractor = @{
        companyName = "Singh Construction Pvt Ltd"
        registrationNumber = "REG/2020/12345"
        businessCategory = "Civil Construction"
        gstNumber = "27AABCU9603R1Z0"
        bankAccount = @{
            accountNumber = "1234567890123456"
            bankName = "State Bank of India"
            ifscCode = "SBIN0001234"
        }
        previousProjects = 15
        rating = 4.5
    }
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$API_URL/auth/register" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json"} `
        -Body $contractorData
    $content = $response.Content | ConvertFrom-Json
    $content | ConvertTo-Json -Depth 10 | Write-Host
    $global:contractorToken = $content.data.token
    Write-Host "Token: $global:contractorToken" -ForegroundColor Green
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test 5: Register Media/Audit
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Blue
Write-Host "Test 5: Register as Media/Audit" -ForegroundColor Blue
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Blue
Write-Host "Creating media/audit account..." -ForegroundColor Yellow
$mediaData = @{
    fullName = "Neha Kapoor"
    email = "neha.audit@investigate.com"
    password = "MediaPass101!"
    confirmPassword = "MediaPass101!"
    phone = "+916543210987"
    role = "media"
    identificationId = "AUD2024001"
    identificationType = "audit_license"
    media = @{
        organizationName = "Transparency India"
        licenseNumber = "MEDIA/2024/001"
        licenseExpiry = "2025-12-31T23:59:59Z"
        specialization = @("budget_audit", "infrastructure", "corruption_detection")
    }
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$API_URL/auth/register" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json"} `
        -Body $mediaData
    $content = $response.Content | ConvertFrom-Json
    $content | ConvertTo-Json -Depth 10 | Write-Host
    $global:mediaToken = $content.data.token
    Write-Host "Token: $global:mediaToken" -ForegroundColor Green
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test 6: Login Test
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Blue
Write-Host "Test 6: Login with Citizen Credentials" -ForegroundColor Blue
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Blue
$loginData = @{
    identificationId = "121324567890"
    password = "SecurePass123!"
    role = "citizen"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$API_URL/auth/login" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json"} `
        -Body $loginData
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10 | Write-Host
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test 7: Verify Token
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Blue
Write-Host "Test 7: Verify JWT Token" -ForegroundColor Blue
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Blue
Write-Host "Verifying citizen token..." -ForegroundColor Yellow
if ($global:citizenToken) {
    try {
        $response = Invoke-WebRequest -Uri "$API_URL/auth/verify" `
            -Method GET `
            -Headers @{"Authorization" = "Bearer $global:citizenToken"}
        $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10 | Write-Host
    } catch {
        Write-Host "Error: $_" -ForegroundColor Red
    }
} else {
    Write-Host "No token available. Register first." -ForegroundColor Yellow
}
Write-Host ""

# Test 8: Get Current User
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Blue
Write-Host "Test 8: Get Current User Profile" -ForegroundColor Blue
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Blue
Write-Host "Fetching citizen profile..." -ForegroundColor Yellow
if ($global:citizenToken) {
    try {
        $response = Invoke-WebRequest -Uri "$API_URL/auth/me" `
            -Method GET `
            -Headers @{"Authorization" = "Bearer $global:citizenToken"}
        $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10 | Write-Host
    } catch {
        Write-Host "Error: $_" -ForegroundColor Red
    }
} else {
    Write-Host "No token available. Register first." -ForegroundColor Yellow
}
Write-Host ""

Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "All tests completed!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Test Summary:" -ForegroundColor Yellow
Write-Host "  ✓ Health Check"
Write-Host "  ✓ Citizen Registration"
Write-Host "  ✓ Official Registration"
Write-Host "  ✓ Contractor Registration"
Write-Host "  ✓ Media/Audit Registration"
Write-Host "  ✓ Login Test"
Write-Host "  ✓ Token Verification"
Write-Host "  ✓ Get User Profile"
Write-Host ""
