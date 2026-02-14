# 📈 Scaling & Optimization Strategy (Firebase Staff Level)

## 1. Zero-Downtime Scaling (10K → 1M Users)

### Firestore Management
- **Single Document Limit**: Avoid frequently updating a single document (e.g., global stats). Use **Distributed Counters** if updates exceed 1/sec.
- **Index Optimization**: Composite indexes are pre-generated. Avoid excessive indexes to reduce storage costs and write latency.
- **Query Cursors**: Enforce `limit()` and `startAfter()` for all course listings to prevent OOM (Out of Memory) on the client and excessive read billing.

### Cloud Functions Performance
- **Concurrency**: Gen 2 functions allow up to 1000 concurrent requests per instance. We will configure `minInstances: 1` for mission-critical paths (e.g., Payments) to eliminate cold starts.
- **Global Deployment**: Deploy functions to region `asia-south1` (Mumbai) to minimize latency for Indian users, or use Global Load Balancing for worldwide traffic.

---

## 2. Infrastructure as Code (Security Posture)

### App Check Enforcement
All Firebase services (Firestore, Storage, Functions) will require **Firebase App Check** (using Play Integrity or DeviceCheck). This prevents:
- Scripting / Bot attacks.
- Replay attacks on Cloud Functions.
- Billing exhaustion via scraping.

### Identity Platform
Utilize **Google Cloud Identity Platform** for:
- Phone OTP integration (India-optimized).
- Multi-factor authentication (MFA) for Admin/Teacher accounts.

---

## 3. Cost Control Model (FinOps)

| Service | Strategy | Savings |
| :--- | :--- | :--- |
| **Firestore** | TTL policy on `notifications` and `logs`. | 30% on storage. |
| **Storage** | Use Cloudflare CDN in front of public assets. | 90% on egress bandwidth. |
| **Functions** | Leverage `onCall` with strict input validation. | Reduced execution time/memory usage. |
| **Billing Alerts** | Configure GCP Budgets at $100, $500, $5000 intervals. | Prevents runaway costs. |

---

## 4. Disaster Recovery (DR)

- **Firestore Backups**: Schedule daily exports to a separate GCS bucket in a different region.
- **Point-in-Time Recovery (PITR)**: Enable 7-day PITR for Firestore to recover from accidentally deleted data or "malicious admin" scenarios.
- **Cross-Region Replication**: Storage buckets configured for multi-region availability.

---

## 5. Deployment Workflow
1. **GitHub Actions**: Automated deployment to `dev` project on push to `main`.
2. **Semantic Versioning**: Tagged releases (`v1.2.0`) trigger a deployment to `production` with a manual approval gate.
3. **Canary Releases**: New Cloud Function versions are deployed with traffic splitting (e.g., 5% traffic to new version) to monitor for errors before full rollout.
