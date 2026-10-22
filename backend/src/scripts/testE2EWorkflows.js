import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';
let studentToken = '';
let staffToken = '';
let adminToken = '';

let testLostItemId = '';
let testFoundItemId = '';
let testClaimId = '';

const results = [];

function recordTest(name, passed, details = '') {
  results.push({ name, passed, details });
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status}: ${name} ${details ? `(${details})` : ''}`);
}

async function runTests() {
  console.log('\n======================================================');
  console.log('   CAMPUSFIND END-TO-END AUTOMATED VERIFICATION SUITE  ');
  console.log('======================================================\n');

  try {
    // ------------------------------------------------------------------------
    // JOURNEY A: STUDENT WORKFLOW & BOUNDARIES
    // ------------------------------------------------------------------------
    console.log('--- Phase 1: Student Authentication & Reporting ---');

    // 1. Student Login
    const studentLoginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'student@charusat.edu.in',
      password: 'student123',
    });
    studentToken = studentLoginRes.data.token;
    recordTest('Student Login', studentLoginRes.status === 200 && !!studentToken, `User: ${studentLoginRes.data.user.email}`);

    const studentHeaders = { Authorization: `Bearer ${studentToken}` };

    // 2. Submit Lost Item Report
    const lostItemRes = await axios.post(
      `${BASE_URL}/lost-items`,
      {
        itemName: 'Dell Latitude 7420 Laptop',
        category: 'Electronics',
        color: 'Black',
        locationLost: 'Central Library 2nd Floor Study Room',
        dateLost: new Date().toISOString(),
        description: 'Black Dell Latitude laptop with blue stickers and serial number DL7420X991.',
        contactPhone: '+1-555-0199',
      },
      { headers: studentHeaders }
    );
    testLostItemId = lostItemRes.data.lostItem?._id || lostItemRes.data.item?._id;
    recordTest('Student Submit Lost Item Report', lostItemRes.status === 201 && !!testLostItemId, `ID: ${testLostItemId}`);

    // 3. View Own Lost Reports
    const myLostRes = await axios.get(`${BASE_URL}/lost-items/my`, { headers: studentHeaders });
    const hasMyItem = (myLostRes.data.lostItems || myLostRes.data.items || []).some(
      (item) => item._id === testLostItemId
    );
    recordTest('Student View Own Lost Reports', hasMyItem, `Found reported item in my-lost-items`);

    // 4. View Found Items (Check Privacy Restriction: storageLocation MUST NOT be visible)
    const publicFoundRes = await axios.get(`${BASE_URL}/found-items`, { headers: studentHeaders });
    const foundItemsList = publicFoundRes.data.foundItems || publicFoundRes.data.items || [];
    const leakedStorage = foundItemsList.some((item) => item.storageLocation !== undefined && item.storageLocation !== '');
    recordTest(
      'Student Found Item Listing Privacy Check',
      !leakedStorage,
      leakedStorage ? 'CRITICAL: storageLocation leaked to student!' : 'Storage location confidential and hidden from students'
    );

    // 5. Security Boundary: Student Attempts Forbidden Admin Endpoint
    try {
      await axios.get(`${BASE_URL}/admin/users`, { headers: studentHeaders });
      recordTest('Security Boundary: Student Access Admin APIs', false, 'Allowed unauthorized access!');
    } catch (err) {
      recordTest(
        'Security Boundary: Student Access Admin APIs',
        err.response?.status === 403,
        `Rejected with HTTP ${err.response?.status} Forbidden`
      );
    }

    // ------------------------------------------------------------------------
    // JOURNEY B: STAFF WORKFLOW & HANDOVER
    // ------------------------------------------------------------------------
    console.log('\n--- Phase 2: Staff Inventory, Review & Handover ---');

    // 6. Staff Login
    const staffLoginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'staff@charusat.edu.in',
      password: 'staff123',
    });
    staffToken = staffLoginRes.data.token;
    recordTest('Staff Login', staffLoginRes.status === 200 && !!staffToken, `User: ${staffLoginRes.data.user.email}`);

    const staffHeaders = { Authorization: `Bearer ${staffToken}` };

    // 7. Staff Registers Found Item with Storage Location
    const foundItemRes = await axios.post(
      `${BASE_URL}/found-items`,
      {
        internalItemName: 'Dell Latitude Laptop Charger & Case',
        category: 'Electronics',
        locationFound: 'Library Study Area Desk 14',
        dateFound: new Date().toISOString(),
        description: 'Black laptop charger and carrying case found under table.',
        storageLocation: 'Security Safe Locker 4B',
      },
      { headers: staffHeaders }
    );
    testFoundItemId = foundItemRes.data.foundItem?._id || foundItemRes.data.item?._id;
    recordTest('Staff Register Found Item', foundItemRes.status === 201 && !!testFoundItemId, `ID: ${testFoundItemId}`);

    // 8. AI Similarity Match Engine
    const aiMatchRes = await axios.post(
      `${BASE_URL}/ai-matches/match`,
      {
        lostItemId: testLostItemId,
      },
      { headers: staffHeaders }
    );
    const matchesFound = Array.isArray(aiMatchRes.data.matches);
    recordTest(
      'AI Similarity Matching Service',
      aiMatchRes.status === 200 && matchesFound,
      `Calculated ${aiMatchRes.data.matches?.length || 0} candidate matches`
    );

    // 9. Student Submits Claim with Private Ownership Proof
    const claimRes = await axios.post(
      `${BASE_URL}/claims`,
      {
        foundItemId: testFoundItemId,
        explanation: 'I left my Dell laptop and charger in Library Desk 14 before the afternoon lecture.',
        identifyingEvidence: 'The charger has a blue label with initial N.P. and serial suffix 991.',
        proofFiles: [],
      },
      { headers: studentHeaders }
    );
    testClaimId = claimRes.data.claim?._id;
    recordTest('Student Submit Ownership Claim', claimRes.status === 201 && !!testClaimId, `Claim ID: ${testClaimId}`);

    // 10. Staff Reviews Claim and Approves
    const approveClaimRes = await axios.patch(
      `${BASE_URL}/claims/${testClaimId}/status`,
      {
        status: 'approved',
        reviewRemark: 'Serial suffix and location match records. Approved for physical collection.',
      },
      { headers: staffHeaders }
    );
    recordTest(
      'Staff Approve Claim',
      approveClaimRes.status === 200 && approveClaimRes.data.claim?.status === 'approved',
      `New status: ${approveClaimRes.data.claim?.status}`
    );

    // 11. Staff Confirms Physical Handover
    const handoverRes = await axios.patch(
      `${BASE_URL}/claims/${testClaimId}/handover`,
      {
        handoverNotes: 'Student verified identity with university photo ID. Tested laptop power on.',
      },
      { headers: staffHeaders }
    );
    const claimReturned = handoverRes.data.claim?.status === 'returned' || handoverRes.data.claim?.status === 'completed';
    recordTest(
      'Staff Confirm Physical Handover',
      handoverRes.status === 200 && claimReturned,
      `Claim Status: ${handoverRes.data.claim?.status}, Handover marked completed`
    );

    // 12. Verify Found Item Marked as Returned in Database
    const checkFoundRes = await axios.get(`${BASE_URL}/found-items/${testFoundItemId}`, { headers: staffHeaders });
    const itemStatus = checkFoundRes.data.foundItem?.status || checkFoundRes.data.item?.status;
    recordTest(
      'Custody Item Lifecycle Update to Returned',
      itemStatus === 'returned',
      `Found Item Database Status: ${itemStatus}`
    );

    // ------------------------------------------------------------------------
    // JOURNEY C: ADMIN DASHBOARD & AUDIT INTEGRITY
    // ------------------------------------------------------------------------
    console.log('\n--- Phase 3: Admin Dashboard, Users & Audit Verification ---');

    // 13. Admin Login
    const adminLoginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@charusat.edu.in',
      password: 'admin123',
    });
    adminToken = adminLoginRes.data.token;
    recordTest('Admin Login', adminLoginRes.status === 200 && !!adminToken, `User: ${adminLoginRes.data.user.email}`);

    const adminHeaders = { Authorization: `Bearer ${adminToken}` };

    // 14. Admin Real Dashboard Aggregations
    const dashRes = await axios.get(`${BASE_URL}/admin/dashboard`, { headers: adminHeaders });
    const stats = dashRes.data.stats;
    const hasRealStats = stats && typeof stats.totalUsers === 'number' && typeof stats.foundItems === 'number';
    recordTest(
      'Admin Real Statistics from Database',
      hasRealStats,
      `Users: ${stats?.totalUsers}, Found: ${stats?.foundItems}, Returned: ${stats?.recoveredItems}`
    );

    // 15. Admin Analytics Endpoint
    const analyticsRes = await axios.get(`${BASE_URL}/admin/analytics`, { headers: adminHeaders });
    const hasAnalyticsData = analyticsRes.data.byCategory && analyticsRes.data.lostVsFound;
    recordTest(
      'Admin Analytics Charts Aggregate Data',
      analyticsRes.status === 200 && hasAnalyticsData,
      `Categories: ${analyticsRes.data.byCategory?.length || 0}, Timeline Points: ${analyticsRes.data.lostVsFound?.length || 0}`
    );

    // 16. Admin User Management
    const usersRes = await axios.get(`${BASE_URL}/admin/users`, { headers: adminHeaders });
    const userList = usersRes.data.users || [];
    const studentUser = userList.find((u) => u.email === 'student@charusat.edu.in');
    let userUpdated = false;
    if (studentUser) {
      const updateRes = await axios.patch(
        `${BASE_URL}/admin/users/${studentUser._id}`,
        { accountStatus: 'active' },
        { headers: adminHeaders }
      );
      userUpdated = updateRes.status === 200;
    }
    recordTest('Admin User Account Management', userUpdated, `Verified user active status update`);

    // 17. Audit Log Integrity Check
    const auditRes = await axios.get(`${BASE_URL}/admin/audit-logs`, { headers: adminHeaders });
    const logs = auditRes.data.logs || [];
    const hasHandoverAudit = logs.some((l) => l.action === 'CONFIRM_HANDOVER' || l.action === 'HANDOVER_COMPLETED' || l.action === 'CLAIM_REVIEWED');
    recordTest(
      'Platform Audit Trail Logging',
      logs.length > 0 && hasHandoverAudit,
      `Logged ${logs.length} operations including handover & claim reviews`
    );

    // 18. Security: Staff Cannot Self-Promote or Access Admin Management
    try {
      await axios.patch(`${BASE_URL}/admin/users/${staffLoginRes.data.user.id}`, { role: 'admin' }, { headers: staffHeaders });
      recordTest('Security Boundary: Staff Self-Promotion Prevention', false, 'Allowed staff role escalation!');
    } catch (err) {
      recordTest(
        'Security Boundary: Staff Self-Promotion Prevention',
        err.response?.status === 403,
        `Rejected with HTTP ${err.response?.status} Forbidden`
      );
    }
  } catch (globalErr) {
    console.error('Test execution error:', globalErr.response?.data || globalErr.message);
    recordTest('Workflow Suite Completed Without Crash', false, globalErr.message);
  }

  console.log('\n======================================================');
  const passedCount = results.filter((r) => r.passed).length;
  const totalCount = results.length;
  console.log(`TEST SUITE SUMMARY: ${passedCount}/${totalCount} Passed (${Math.round((passedCount / totalCount) * 100)}%)`);
  console.log('======================================================\n');
}

runTests();
