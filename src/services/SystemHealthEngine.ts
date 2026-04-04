type HealthEventStatus = 'SUCCESS' | 'WARNING' | 'FAILURE';
type HealthEventType = 'INTERACTION' | 'PATHWAY' | 'STATE' | 'PERFORMANCE' | 'VISUAL';

export interface HealthEvent {
    id: string;
    timestamp: number;
    type: HealthEventType;
    status: HealthEventStatus;
    message: string;
    details?: any;
}

class HealthEngine {
    private logs: HealthEvent[] = [];
    private maxLogs = 500;
    private isInitialized = false;
    private autocorrectCount = 0;
    private listeners: ((events: HealthEvent[]) => void)[] = [];

    // All known healthy root hashes
    private validHashPrefixes = [
        '', '#/', '#/splash', '#/portal', '#/observe', '#/diagnose', '#/improve',
        '#/dashboard', '#/promo', '#/gemba', '#/goal-gap', '#/motion-mapping',
        '#/motion-v2', '#/time-study', '#/process-check', '#/improvement-card',
        '#/value-scanner', '#/line-balance', '#/kaizen-hub', '#/lean-academy',
        '#/gemba-challenge', '#/calculators', '#/action-items', '#/video-hub'
    ];

    public initialize() {
        if (this.isInitialized) return;
        this.isInitialized = true;

        this.log('STATE', 'SUCCESS', 'System Health Engine Initialized.');

        this.attachInteractionMonitor();
        this.attachPathwayMonitor();
        this.attachPerformanceMonitor();
        this.attachStateMonitor();
    }

    public subscribe(callback: (events: HealthEvent[]) => void) {
        this.listeners.push(callback);
        callback(this.logs);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    public getLogs() {
        return this.logs;
    }

    public getAutocorrectCount() {
        return this.autocorrectCount;
    }

    private log(type: HealthEventType, status: HealthEventStatus, message: string, details?: any) {
        const event: HealthEvent = {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: Date.now(),
            type,
            status,
            message,
            details
        };

        this.logs.unshift(event);
        if (this.logs.length > this.maxLogs) {
            this.logs.pop();
        }

        // Broadcast
        this.listeners.forEach(cb => cb([...this.logs]));

        if (status === 'FAILURE') {
            console.error(`[HEALTH ENGINE] ❌ ${type}: ${message}`, details || '');
        } else if (status === 'WARNING') {
            console.warn(`[HEALTH ENGINE] ⚠️ ${type}: ${message}`, details || '');
        } else {
            // console.log(`[HEALTH ENGINE] ✅ ${type}: ${message}`);
        }
    }

    private attachInteractionMonitor() {
        window.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            // Trace the click intention
            const readableTarget = target.tagName + (target.id ? `#${target.id}` : '') + (target.className ? `.${typeof target.className === 'string' ? target.className.replace(/ /g, '.') : ''}` : '');
            
            // Check if it's an a link that is broken
            const anchor = target.closest('a');
            if (anchor && anchor.getAttribute('href') === '#') {
                this.log('INTERACTION', 'WARNING', `Clicked dead anchor element: ${readableTarget}`);
            } else if (target.closest('button')) {
                this.log('INTERACTION', 'SUCCESS', `Button interaction detected: ${readableTarget}`);
            } else if (anchor) {
                this.log('INTERACTION', 'SUCCESS', `Link interaction detected: ${anchor.href}`);
            } else {
                // Background click
                // this.log('INTERACTION', 'SUCCESS', `Generic interaction: ${readableTarget}`);
            }
        }, { capture: true }); // Capture phase to guarantee we see it
    }

    private attachPathwayMonitor() {
        // Evaluate every hash route
        const validateHash = () => {
            const hash = window.location.hash || '#/';
            const baseHash = hash.split('?')[0];

            if (!this.validHashPrefixes.includes(baseHash)) {
                this.log('PATHWAY', 'FAILURE', `Dead end detected: ${hash}. Triggering auto-correct.`);
                this.autocorrectRoute();
            } else {
                this.log('PATHWAY', 'SUCCESS', `Navigated successfully to: ${baseHash}`);
            }
        };

        window.addEventListener('hashchange', validateHash);
        // validate initial route
        setTimeout(validateHash, 1000); 
    }

    private autocorrectRoute() {
        this.autocorrectCount++;
        // Safely map back to a stable unified hub
        window.location.hash = '#/calculators';
        this.log('PATHWAY', 'WARNING', `Path naturally healed to #/calculators.`);
    }

    private attachPerformanceMonitor() {
        if ('PerformanceObserver' in window) {
            try {
                // Monitor Long Tasks that freeze the UI
                const longTaskObserver = new PerformanceObserver((list) => {
                    list.getEntries().forEach((entry) => {
                        this.log('PERFORMANCE', 'WARNING', `Long task detected: ${Math.round(entry.duration)}ms. This causes UI freezing.`);
                    });
                });
                longTaskObserver.observe({ type: 'longtask', buffered: true });
                
                // Track Cumulative Layout Shifts (Flickering UI)
                let clsValue = 0;
                new PerformanceObserver((entryList) => {
                    for (const entry of entryList.getEntries()) {
                        if (!(entry as any).hadRecentInput) {
                            clsValue += (entry as any).value;
                            if ((entry as any).value > 0.1) {
                                this.log('VISUAL', 'WARNING', `Significant Layout Shift detected. Value: ${(entry as any).value.toFixed(3)}`);
                            }
                        }
                    }
                }).observe({ type: 'layout-shift', buffered: true });

            } catch (e) {
                this.log('PERFORMANCE', 'WARNING', 'PerformanceObserver unsupported or blocked by browser.');
            }
        }
    }

    private attachStateMonitor() {
        // Periodically verify engine consistency
        setInterval(() => {
            try {
                const keys = Object.keys(localStorage);
                const engineKey = keys.find(k => k === 'engine_items');
                if (engineKey) {
                    const raw = localStorage.getItem(engineKey);
                    if (raw && raw === 'null') {
                        this.log('STATE', 'FAILURE', `ImprovementEngine data is nullified unexpectedly!`);
                    } else if (raw) {
                        try {
                            const data = JSON.parse(raw);
                            if (!Array.isArray(data)) {
                                this.log('STATE', 'FAILURE', `ImprovementEngine data is corrupted (not an array).`);
                            }
                        } catch (e) {
                            this.log('STATE', 'FAILURE', `ImprovementEngine JSON parse failed.`);
                        }
                    }
                }
            } catch (e) {
                // Do nothing
            }
        }, 30000); // Check every 30 seconds
    }
}

export const SystemHealthEngine = new HealthEngine();
