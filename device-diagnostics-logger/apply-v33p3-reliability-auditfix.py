from pathlib import Path

p=Path('app/src/main/java/com/offlineperf/logger/LoggerService.java')
t=p.read_text()
t=t.replace('private long sessionId=-1, startedElapsed, lastCoreHeartbeat, lastSlowHeartbeat, lastFlightHeartbeat, lastNotificationUpdate, lastConsoleUpdate;',
'''private long sessionId=-1, startedElapsed, lastCoreHeartbeat, lastSlowHeartbeat, lastFlightHeartbeat, lastNotificationUpdate, lastConsoleUpdate;
    private long nextCoreDueElapsed, nextFlightDueElapsed;''')

t=t.replace('''        coreScheduler.scheduleAtFixedRate(()->guard("core",this::runCoreTick),0,700,TimeUnit.MILLISECONDS);

        flightScheduler.scheduleAtFixedRate(()->guard("flight",()->{sampler.flightTick();lastFlightHeartbeat=SystemClock.elapsedRealtime();}),250,250,TimeUnit.MILLISECONDS);''',
'''        nextCoreDueElapsed=SystemClock.elapsedRealtime();
        nextFlightDueElapsed=nextCoreDueElapsed+250;
        scheduleCoreAligned(nextCoreDueElapsed);
        scheduleFlightAligned(nextFlightDueElapsed);''')

insert='''
    // Monotonic one-shot scheduling avoids ScheduledExecutorService fixed-rate catch-up bursts
    // after Android caching/suspension. Missed slots are skipped, never replayed rapidly.
    private void scheduleCoreAligned(long dueElapsed){
        ScheduledExecutorService ex=coreScheduler;
        if(!started||ex==null||ex.isShutdown())return;
        long delay=Math.max(0,dueElapsed-SystemClock.elapsedRealtime());
        ex.schedule(()->{
            guard("core",this::runCoreTick);
            if(!started)return;
            long after=SystemClock.elapsedRealtime();
            long next=dueElapsed+700L;
            if(next<=after){long missed=((after-next)/700L)+1L;next+=missed*700L;if(missed>0)LiveConsole.log("SCHED","Skipped "+missed+" stale core slot(s)");}
            nextCoreDueElapsed=next;
            scheduleCoreAligned(next);
        },delay,TimeUnit.MILLISECONDS);
    }

    private void scheduleFlightAligned(long dueElapsed){
        ScheduledExecutorService ex=flightScheduler;
        if(!started||ex==null||ex.isShutdown())return;
        long delay=Math.max(0,dueElapsed-SystemClock.elapsedRealtime());
        ex.schedule(()->{
            guard("flight",()->{sampler.flightTick();lastFlightHeartbeat=SystemClock.elapsedRealtime();});
            if(!started)return;
            long after=SystemClock.elapsedRealtime();
            long next=dueElapsed+250L;
            if(next<=after){long missed=((after-next)/250L)+1L;next+=missed*250L;}
            nextFlightDueElapsed=next;
            scheduleFlightAligned(next);
        },delay,TimeUnit.MILLISECONDS);
    }
'''
marker='    private ScheduledExecutorService newExecutor(String name,int priority){'
t=t.replace(marker,insert+'\n'+marker)

t=t.replace('''            coreScheduler=newExecutor("diag-core-recovered",Thread.NORM_PRIORITY-1);
            lastCoreHeartbeat=now;
            coreScheduler.scheduleAtFixedRate(()->guard("core",this::runCoreTick),0,700,TimeUnit.MILLISECONDS);''',
'''            coreScheduler=newExecutor("diag-core-recovered",Thread.NORM_PRIORITY-1);
            lastCoreHeartbeat=now;
            nextCoreDueElapsed=now;
            scheduleCoreAligned(nextCoreDueElapsed);''')

t=t.replace('''        if(!ready) try{ShizukuBridge.bindIfPossible();}catch(Throwable t){CrashReporter.writeHandled("shizuku_rebind",t);}''',
'''        if(!ready) try{ShizukuBridge.bindIfPossible();}catch(Throwable t){CrashReporter.writeHandled("shizuku_rebind",t);}
        // Also renew an explicitly enabled timed wake lock if Android released it.
        applyOvernightMode();''')

t=t.replace('overnightWakeLock.acquire();safeEvent("overnight_mode","Enabled","Partial wake lock acquired by explicit user setting");',
'''overnightWakeLock.acquire(15*60_000L);safeEvent("overnight_mode","Enabled","Timed partial wake lock acquired/renewed by explicit user setting");''')
p.write_text(t)

# Modern backup/privacy declaration and explicit app icon.
p=Path('app/src/main/AndroidManifest.xml')
t=p.read_text()
t=t.replace('android:allowBackup="false"','android:allowBackup="false"\n        android:dataExtractionRules="@xml/data_extraction_rules"\n        android:icon="@drawable/ic_stat_diag"')
p.write_text(t)

xml=Path('app/src/main/res/xml')
xml.mkdir(parents=True,exist_ok=True)
(xml/'data_extraction_rules.xml').write_text('''<?xml version="1.0" encoding="utf-8"?>
<data-extraction-rules>
    <cloud-backup>
        <exclude domain="root" path="." />
    </cloud-backup>
    <device-transfer>
        <exclude domain="root" path="." />
    </device-transfer>
</data-extraction-rules>
''')
