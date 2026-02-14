/**
 * 🎓 Academy Cloud Functions - Gen 2
 * Production Grade - Stateless - Idempotent
 */

const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { beforeUserCreated } = require("firebase-functions/v2/identity");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

// 1️⃣ --- AUTH TRIGGERS ---

/**
 * Sync User Profile to Firestore on Creation
 * Automatically sets Custom Claims for Role-Based Access Control (RBAC)
 */
exports.onUserCreated = onDocumentCreated("users/{uid}", async (event) => {
    const snapshot = event.data;
    if (!snapshot) return null;

    const userData = snapshot.data();
    const uid = event.params.uid;

    try {
        // Set Custom Claims for the user based on the document role
        // Default to student if not specified
        const role = userData.role || 'student';
        await admin.auth().setCustomUserClaims(uid, { role });

        // Log initial audit
        await db.collection("audit_logs").add({
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            actorId: "SYSTEM",
            action: "AUTH_REGISTER",
            targetId: uid,
            metadata: { role }
        });

        console.log(`Successfully set claims for ${uid} as ${role}`);
    } catch (error) {
        console.error("Error setting custom claims:", error);
    }
});

// 2️⃣ --- CALLABLE FUNCTIONS (Secure APIs) ---

/**
 * Handle Course Enrollment after Payment Verification
 * Stateless & Transaction-Safe
 */
exports.processEnrollment = onCall({ cors: true }, async (request) => {
    // 1. Verify Authentication
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'User must be logged in.');
    }

    const { courseId, transactionId } = request.data;
    const uid = request.auth.uid;

    return await db.runTransaction(async (transaction) => {
        const courseRef = db.collection("courses").doc(courseId);
        const userRef = db.collection("users").doc(uid);
        const enrollRef = db.collection("enrollments").doc(`${uid}_${courseId}`);

        const courseDoc = await transaction.get(courseRef);
        const enrollDoc = await transaction.get(enrollRef);

        if (!courseDoc.exists) {
            throw new HttpsError('not-found', 'Course not found.');
        }

        if (enrollDoc.exists) {
            return { message: "Already enrolled" };
        }

        // 2. Add Enrollment
        transaction.set(enrollRef, {
            userId: uid,
            courseId: courseId,
            transactionId: transactionId,
            purchaseDate: admin.firestore.FieldValue.serverTimestamp(),
            status: 'active',
            expiresAt: admin.firestore.Timestamp.fromMillis(Date.now() + (365 * 24 * 60 * 60 * 1000)) // 1 Year Default
        });

        // 3. Increment Course Stats Atomically
        transaction.update(courseRef, {
            "stats.enrolledCount": admin.firestore.FieldValue.increment(1)
        });

        // 4. Update User Profile
        transaction.update(userRef, {
            enrolledCourses: admin.firestore.FieldValue.arrayUnion(courseId)
        });

        return { success: true, message: "Enrollment granted" };
    });
});

/**
 * Admin Action: Manage User Role
 * Restricted to super_admin or admin roles
 */
exports.updateUserRole = onCall({ cors: true }, async (request) => {
    // RBAC Check
    if (!request.auth || (request.auth.token.role !== 'admin' && request.auth.token.role !== 'super_admin')) {
        throw new HttpsError('permission-denied', 'Only admins can perform this action.');
    }

    const { targetUid, newRole } = request.data;
    const validRoles = ['student', 'teacher', 'admin', 'super_admin'];

    if (!validRoles.includes(newRole)) {
        throw new HttpsError('invalid-argument', 'Invalid role specified.');
    }

    try {
        // 1. Update Custom Claims
        await admin.auth().setCustomUserClaims(targetUid, { role: newRole });

        // 2. Update Firestore
        await db.collection("users").doc(targetUid).update({ role: newRole });

        // 3. Immutable Audit Log
        await db.collection("audit_logs").add({
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            actorId: request.auth.uid,
            action: "ROLE_CHANGE",
            targetId: targetUid,
            metadata: { oldRole: request.auth.token.role, newRole }
        });

        return { success: true };
    } catch (error) {
        throw new HttpsError('internal', error.message);
    }
});

// 3️⃣ --- MAINTENANCE & CACHING ---

/**
 * Cache Invalidation or Notification on Course Publication
 */
exports.onCoursePublished = onDocumentCreated("courses/{courseId}", async (event) => {
    const course = event.data.data();
    if (!course.isActive) return;

    // Trigger internal notifications or email blasts (via 3rd party)
    console.log(`New course published: ${course.title}. Triggering notifications...`);

    // Example: Update a global 'recent_courses' document for faster reads
    const recentRef = db.collection("cache").doc("homepage");
    await recentRef.set({
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        // Triggered by event, we could push this specific course metadata here
    }, { merge: true });
});
