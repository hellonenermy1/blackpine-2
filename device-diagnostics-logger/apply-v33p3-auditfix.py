from pathlib import Path
p=Path('app/src/main/java/com/offlineperf/logger/ExportManager.java')
t=p.read_text()
t=t.replace('Device Diagnostics Logger v3.2 Phase 1 export','Device Diagnostics Logger v3.3 Phase 3 export')
t=t.replace('1-second system samples; process scans are adaptive (5 s screen-on / 15 s screen-off);','700 ms precision system samples; process scans are adaptive (2.8 s screen-on / 7 s screen-off);')
p.write_text(t)
