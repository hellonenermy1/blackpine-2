from pathlib import Path

# Fix release metadata found by compiled-APK audit.
p=Path('app/src/main/java/com/offlineperf/logger/ExportManager.java')
t=p.read_text()
t=t.replace('Device Diagnostics Logger v3.2 Phase 1 export','Device Diagnostics Logger v3.3 Phase 3 export')
t=t.replace('1-second system samples; process scans are adaptive (5 s screen-on / 15 s screen-off);','700 ms precision system samples; process scans are adaptive (2.8 s screen-on / 7 s screen-off);')
p.write_text(t)

# QUERY_ALL_PACKAGES is intentionally required for this sideloaded diagnostics tool:
# PackageIndex enumerates installed apps so privileged /proc UID/PID samples can be
# attributed to actual package names. A narrow <queries> list cannot provide complete
# device-wide attribution. Suppress this one lint policy warning only; do not globally
# suppress lint and do not add INTERNET or any unrelated permission.
p=Path('app/src/main/AndroidManifest.xml')
t=p.read_text()
t=t.replace('<manifest xmlns:android="http://schemas.android.com/apk/res/android">','<manifest xmlns:android="http://schemas.android.com/apk/res/android"\n    xmlns:tools="http://schemas.android.com/tools">')
t=t.replace('<uses-permission android:name="android.permission.QUERY_ALL_PACKAGES" />','<uses-permission\n        android:name="android.permission.QUERY_ALL_PACKAGES"\n        tools:ignore="QueryAllPackagesPermission" />')
p.write_text(t)
