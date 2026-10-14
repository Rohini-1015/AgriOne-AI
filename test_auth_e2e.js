// E2E Verification Script for AgriOne AI Authentication and Account Suite
const http = require('http');

function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting AgriOne AI Authentication & Account E2E Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  const testUser = {
    fullName: 'Muthuvel Karunanidhi',
    mobileNumber: '9443322110',
    email: `muthuvel_${Date.now()}@deltafarms.in`,
    password: 'SecureFarm@2026',
    state: 'Tamil Nadu',
    district: 'Tiruvarur',
    village: 'Thirukkuvalai',
    role: 'FARMER'
  };

  try {
    // 1. Duplicate check / New User Registration
    console.log('--- 1. Testing Registration ---');
    const regRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, testUser);

    assert(regRes.status === 201, `Registration returned HTTP 201 (got ${regRes.status})`);
    assert(regRes.body?.success === true, 'Registration payload has success: true');
    assert(regRes.body?.data?.token, 'Registration returns JWT token');
    assert(regRes.body?.data?.user?.fullName === testUser.fullName, 'User name matches registration input');
    assert(!regRes.body?.data?.user?.passwordHash, 'Password hash is strictly omitted from user object');

    // 2. Duplicate Registration Test
    console.log('\n--- 2. Testing Duplicate Registration Prevention ---');
    const dupRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, testUser);

    assert(dupRes.status === 409, `Duplicate registration returned HTTP 409 Conflict (got ${dupRes.status})`);
    assert(dupRes.body?.success === false, 'Duplicate registration payload has success: false');

    // 3. Invalid Mobile Number Test
    console.log('\n--- 3. Testing Registration Mobile Validation ---');
    const invalidMobileRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { ...testUser, email: 'random@test.com', mobileNumber: '12345' });

    assert(invalidMobileRes.status >= 400, 'Invalid 5-digit mobile number rejected with 4xx');

    // 4. Failed Login Attempt with Wrong Password
    console.log('\n--- 4. Testing Failed Login Handling ---');
    const badLoginRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { emailOrPhone: testUser.email, password: 'WrongPassword@999' });

    assert(badLoginRes.status === 401, `Wrong password returned HTTP 401 Unauthorized (got ${badLoginRes.status})`);
    assert(badLoginRes.body?.success === false, 'Failed login returns success: false');

    // 5. Successful Login
    console.log('\n--- 5. Testing Valid Login ---');
    const loginRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { emailOrPhone: testUser.email, password: testUser.password });

    assert(loginRes.status === 200, `Valid login returned HTTP 200 (got ${loginRes.status})`);
    assert(loginRes.body?.success === true, 'Login payload success is true');
    const authToken = loginRes.body?.data?.token;
    assert(!!authToken, 'JWT token returned successfully');

    // 6. Access Protected Route (/auth/me) with token
    console.log('\n--- 6. Testing Protected Route (/auth/me) ---');
    const meRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/me',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    assert(meRes.status === 200, `Protected /auth/me returned HTTP 200 (got ${meRes.status})`);
    assert(meRes.body?.data?.user?.email === testUser.email.toLowerCase(), 'Profile matches logged-in user');

    // 7. Reject Protected Route without token
    console.log('\n--- 7. Testing Unauthorized Access Rejection ---');
    const unauthRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/me',
      method: 'GET'
    });

    assert(unauthRes.status === 401, `Unauthenticated request returned HTTP 401 (got ${unauthRes.status})`);

    // 8. Update Profile (/auth/profile)
    console.log('\n--- 8. Testing Profile Update ---');
    const updateRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/profile',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    }, {
      fullName: 'Muthuvel K (Senior Farmer)',
      village: 'Thirukkuvalai South',
      state: 'Tamil Nadu'
    });

    assert(updateRes.status === 200, `Profile update returned HTTP 200 (got ${updateRes.status})`);
    assert(updateRes.body?.data?.user?.fullName === 'Muthuvel K (Senior Farmer)', 'Profile name successfully updated');
    assert(updateRes.body?.data?.user?.village === 'Thirukkuvalai South', 'Profile village successfully updated');

    // 9. Change Password (/auth/change-password) with wrong current password
    console.log('\n--- 9. Testing Change Password Validation ---');
    const badChangeRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/change-password',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    }, {
      currentPassword: 'IncorrectOldPassword',
      newPassword: 'BrandNewPassword@2026'
    });

    assert(badChangeRes.status === 400, `Wrong current password rejected with HTTP 400 (got ${badChangeRes.status})`);

    // 10. Change Password with correct current password
    console.log('\n--- 10. Testing Change Password Success ---');
    const goodChangeRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/change-password',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    }, {
      currentPassword: testUser.password,
      newPassword: 'BrandNewPassword@2026'
    });

    assert(goodChangeRes.status === 200, `Password changed with HTTP 200 (got ${goodChangeRes.status})`);

    // 11. Login with new password
    console.log('\n--- 11. Testing Login with New Password ---');
    const newLoginRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { emailOrPhone: testUser.email, password: 'BrandNewPassword@2026' });

    assert(newLoginRes.status === 200, `Login with new password succeeded with HTTP 200 (got ${newLoginRes.status})`);

    // 12. Old password should now fail
    console.log('\n--- 12. Verifying Old Password Invalidation ---');
    const oldLoginRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { emailOrPhone: testUser.email, password: testUser.password });

    assert(oldLoginRes.status === 401, `Old password fails with HTTP 401 (got ${oldLoginRes.status})`);

    // 13. Demo Farmer Login
    console.log('\n--- 13. Testing Demo Farmer Authentication ---');
    const demoLoginRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { emailOrPhone: 'farmer@agrione.com', password: 'Farmer@123' });

    assert(demoLoginRes.status === 200, `Demo farmer login succeeded HTTP 200 (got ${demoLoginRes.status})`);
    assert(demoLoginRes.body?.data?.user?.role === 'FARMER', 'Demo farmer role is FARMER');

    console.log(`\n========================================`);
    console.log(`🎉 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log(`========================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test execution failed:', err);
    process.exit(1);
  }
}

runTests();
