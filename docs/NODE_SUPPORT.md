# Node.js Support Matrix & Runtime Policy (\`docs/NODE_SUPPORT.md\`)

Supported Node.js versions, support levels, and runtime environment specifications.

---

## 1. Supported Node.js Versions Matrix

| Node.js Version | Support Status | Target Role | CI Pipeline Matrix Status |
|---|---|---|---|
| **Node.js 20.x** | **SUPPORTED** | Minimum Supported Version | Tested on Push & PR |
| **Node.js 22.x** | **RECOMMENDED** | Active LTS Version | Tested on Push & PR |
| **Node.js 24.x** | **TESTED** | Current Tested Version | Tested on Push & PR |

---

## 2. Deprecated / Unsupported Versions

- **Node.js < 20.0.0**: Unsupported. Lacks modern native Fetch API and SemVer features.
- Odd-numbered releases (Node 19, 21, 23): Unsupported for production deployment.

---

## 3. Zero External Runtime Dependencies

All 38 deterministic engines in `engines/` are built using pure Node.js standard libraries (`fs`, `path`, `crypto`, `assert`).
They do not require external npm dependencies or native C++ add-ons, ensuring maximum compatibility across Linux, macOS, and Windows.
