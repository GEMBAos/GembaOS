import type { BaseEntity, ImprovementEntityType, Countermeasure, Metric, MotionPath, ProcessCheck, ImprovementCard } from '../types/improvement';
import type { MotionSessionV2, MotionParticipantPathV2 } from '../types/motion_v2';
import { supabase } from '../lib/supabase';

const STORAGE_KEY_PREFIX = 'gembaos_engine_data_';

class ImprovementEngineService {
  private data: Record<string, BaseEntity> = {};
  private currentUserId: string = 'guest';

  constructor() {
    this.load();
  }

  public setUserId(userId: string | null) {
      const newId = userId || 'guest';
      if (this.currentUserId !== newId) {
          this.currentUserId = newId;
          this.data = {}; // Reset active context
          this.load(); // Load context for the new identity
      }
  }

  private getStorageKey() {
      return `${STORAGE_KEY_PREFIX}${this.currentUserId}`;
  }

  private load() {
    try {
      const stored = localStorage.getItem(this.getStorageKey());
      if (stored) {
        this.data = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load shared improvement data from local storage', e);
    }
  }

  private save() {
    try {
        localStorage.setItem(this.getStorageKey(), JSON.stringify(this.data));
        // Dispatch an event so components can reactively update if needed across tabs/windows
        window.dispatchEvent(new Event('improvement_data_updated'));
    } catch (e) {
        console.error('Failed to save shared improvement data to local storage', e);
    }
  }

  public createItem<T extends BaseEntity>(item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): T {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
    const now = new Date().toISOString();
    
    const newItem = {
      ...item,
      id,
      createdAt: now,
      updatedAt: now
    } as unknown as T;

    this.data[id] = newItem;
    this.save();
    this.upsertToCloud(newItem);
    return newItem;
  }

  public updateItem<T extends BaseEntity>(id: string, updates: Partial<T>): T | null {
    if (!this.data[id]) return null;

    const updatedItem = {
      ...this.data[id],
      ...updates,
      updatedAt: new Date().toISOString()
    } as T;

    this.data[id] = updatedItem;
    this.save();
    this.upsertToCloud(updatedItem);
    return updatedItem;
  }

  public saveImportedItem<T extends BaseEntity>(item: T): T {
    this.data[item.id] = item;
    this.save();
    this.upsertToCloud(item);
    return item;
  }

  public deleteItem(id: string): void {
    if (this.data[id]) {
      delete this.data[id];
      this.save();
    }
  }

  public getItem<T extends BaseEntity>(id: string): T | null {
      return (this.data[id] as T) || null;
  }

  public getItemsByType<T extends BaseEntity>(type: ImprovementEntityType): T[] {
    return Object.values(this.data)
      .filter(item => item.type === type) as T[];
  }

  public getRelatedCountermeasures(entityId: string): Countermeasure[] {
    return this.getItemsByType<Countermeasure>('Countermeasure')
      .filter(cm => cm.relatedEntityId === entityId);
  }

  public getMetricsByArea(areaId: string): Metric[] {
    return this.getItemsByType<Metric>('Metric')
      .filter(m => m.areaId === areaId);
  }

  public clearAll(): void {
    this.data = {};
    this.save();
  }

  public flushActiveContext(): void {
    this.data = {};
    this.currentUserId = 'guest';
    // Do not call this.save(). We only want to clear the active runtime memory, 
    // not erase the user's permanent local storage history.
    window.dispatchEvent(new Event('improvement_data_updated'));
  }

  // --- SUPABASE CLOUD SYNC ---

  private syncTimers: Record<string, ReturnType<typeof setTimeout>> = {};

  private async upsertToCloud(item: BaseEntity) {
      if (this.syncTimers[item.id]) {
          clearTimeout(this.syncTimers[item.id]);
      }
      this.syncTimers[item.id] = setTimeout(() => {
          this.executeCloudUpsert(item);
          delete this.syncTimers[item.id];
      }, 500);
  }

  private async executeCloudUpsert(item: BaseEntity) {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    
    // We do NOT early return here because MotionParticipantPathV2 can be inserted anonymously (Guest)
    try {
        if (item.type === 'MotionPath') {
            if (!userId) return;
            const m = item as unknown as MotionPath;
            await supabase.from('motion_sessions').upsert({
                id: m.id,
                user_id: userId,
                session_name: m.sessionName,
                operator_id: m.operatorId,
                notes: m.notes,
                path_coordinates: m.pathCoordinates,
                total_distance: m.totalDistance,
                total_stops: m.totalStops,
                longest_segment: m.longestSegment,
                created_at: m.createdAt,
                updated_at: m.updatedAt
            });
        }
        else if (item.type === 'ImprovementCard') {
            if (!userId) return;
            const c = item as unknown as ImprovementCard;
            await supabase.from('improvement_cards').upsert({
                id: c.id,
                user_id: userId,
                process_check_id: c.linkedProcessCheckId,
                title: c.title,
                owner: c.owner,
                status: c.status,
                countermeasure: c.countermeasure,
                before_condition: c.beforeCondition,
                after_condition: c.afterCondition,
                expected_field_exits: c.expectedFieldExits,
                measured_field_exits: c.measuredFieldExits,
                expected_distance: c.expectedDistance,
                measured_distance: c.measuredDistance,
                next_action: c.nextAction,
                created_at: c.createdAt,
                updated_at: c.updatedAt
            });
        }
        else if (item.type === 'ProcessCheck') {
            if (!userId) return;
            const p = item as unknown as ProcessCheck;
            await supabase.from('process_checks').upsert({
                id: p.id,
                user_id: userId,
                motion_session_id: p.motionSessionId,
                process_name: p.processName,
                operator_id: p.operatorId,
                findings: p.findings,
                waste_types: p.wasteTypes,
                target_cycle_time: p.targetCycleTime,
                actual_cycle_time: p.actualCycleTime,
                created_at: p.createdAt,
                updated_at: p.updatedAt
            });
        }
        else if (item.type === 'CycleTime') {
            if (!userId) return;
            const c = item as unknown as import('../types/improvement').CycleTime;
            await supabase.from('cycle_times').upsert({
                id: c.id,
                user_id: userId,
                station_name: c.stationName,
                operators_count: c.operatorsCount,
                work_content: c.workContent,
                recorded_times: c.recordedTimes,
                created_at: c.createdAt,
                updated_at: c.updatedAt
            });
        }
        else if (item.type === 'MotionSessionV2') {
            const m = item as unknown as MotionSessionV2;
            console.log(`[ImprovementEngine] Syncing MotionSessionV2: ${m.id}`);
            const res = await supabase.from('motion_sessions_v2').upsert({
                id: String(m.id),
                host_user_id: m.hostUserId || userId || null,
                session_name: m.sessionName || "Unnamed Session",
                layout_image_url: m.layoutImageUrl || null,
                calibration_scale: m.calibrationScale || 1,
                calibration_unit: m.calibrationUnit || 'none',
                status: m.status || 'ACTIVE',
                access_code: m.accessCode || null,
                created_at: m.createdAt,
                updated_at: m.updatedAt
            });
            if (res.error) console.error(`[ImprovementEngine] Sync Error MotionSessionV2 [${m.id}]:`, res.error);
        }
        else if (item.type === 'MotionParticipantPathV2') {
            const p = item as unknown as MotionParticipantPathV2;
            console.log(`[ImprovementEngine] Syncing Path ${p.id} for Session ${p.sessionId}`);
            const res = await supabase.from('motion_paths_v2').upsert({
                id: String(p.id),
                session_id: String(p.sessionId),
                participant_id: String(p.deviceId || 'unknown'),
                participant_name: String(p.participantName || 'Guest'),
                color: String(p.color || '#cccccc'),
                path_points_json: p.pathCoordinates || [],
                total_distance: p.totalDistance || 0,
                total_stops: p.totalStops || 0,
                joined_at: p.joinedAt,
                last_active_at: p.lastActiveAt,
                created_at: p.createdAt,
                updated_at: p.updatedAt
            });
            if (res.error) console.error(`[ImprovementEngine] Sync Error MotionParticipantPathV2 [${p.id}]:`, res.error);
        }
    } catch (e) {
        console.warn('Failed to sync improvement to cloud, data preserved locally', e);
    }
  }

  public async syncFromCloud() {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    // We do not return early if no userId, because 'guest' uses localStorage for their ownership references
    
    if (userId) {
        this.setUserId(userId); // Ensure we are scoped to this user
    }
    
    let updated = false;

    // We do NOT clear this.data here because the user may have offline local edits 
    // waiting to sync. However, we should merge the incoming rows.

    if (userId) {
        // Load Motion Sessions
        const { data: ms } = await supabase.from('motion_sessions').select('*').eq('user_id', userId);
        if (ms && ms.length > 0) {
            ms.forEach((row: any) => {
                this.data[row.id] = {
                    id: row.id,
                    type: 'MotionPath',
                    sessionName: row.session_name,
                    operatorId: row.operator_id,
                    notes: row.notes,
                    pathCoordinates: row.path_coordinates,
                    totalDistance: row.total_distance,
                    totalStops: row.total_stops,
                    longestSegment: row.longest_segment,
                    createdAt: row.created_at,
                    updatedAt: row.updated_at
                } as MotionPath;
            });
            updated = true;
        }
    }

    // Load Motion Sessions V2 (Host Only loads their authored sessions)
    let ms_v2: any[] | null = null;
    
    if (userId) {
        const { data } = await supabase.from('motion_sessions_v2').select('*').eq('host_user_id', userId);
        ms_v2 = data;
    } else {
        // Fallback for guest users: they own whatever session ID is locally stored
        const guestSessionId = localStorage.getItem('motion_session_v2_guest_session_id');
        if (guestSessionId) {
            const { data } = await supabase.from('motion_sessions_v2').select('*').eq('id', guestSessionId);
            ms_v2 = data;
        }
    }
    
    if (ms_v2 && ms_v2.length > 0) {
        ms_v2.forEach((row: any) => {
            this.data[row.id] = {
                id: row.id,
                type: 'MotionSessionV2',
                hostUserId: row.host_user_id,
                sessionName: row.session_name,
                layoutImageUrl: row.layout_image_url,
                calibrationScale: row.calibration_scale,
                calibrationUnit: row.calibration_unit,
                status: row.status,
                accessCode: row.access_code,
                createdAt: row.created_at,
                updatedAt: row.updated_at
            } as MotionSessionV2;
        });
        updated = true;
        
        // Load associated participant paths for these sessions
        const sessionIds = ms_v2.map((row: any) => String(row.id));
        if (sessionIds.length > 0) {
            console.log(`[ImprovementEngine] Hydrating paths for ${sessionIds.length} sessions`);
            const { data: mp_v2, error: pathsError } = await supabase.from('motion_paths_v2').select('*').in('session_id', sessionIds);
            if (pathsError) console.error('[ImprovementEngine] Error hydrating paths:', pathsError);
            if (mp_v2 && mp_v2.length > 0) {
                console.log(`[ImprovementEngine] Successfully hydrated ${mp_v2.length} paths`);
                mp_v2.forEach((row: any) => {
                    this.data[row.id] = {
                        id: row.id,
                        type: 'MotionParticipantPathV2',
                        sessionId: row.session_id,
                        deviceId: row.participant_id,
                        participantName: row.participant_name,
                        color: row.color,
                        pathCoordinates: row.path_points_json,
                        totalDistance: row.total_distance,
                        totalStops: row.total_stops,
                        joinedAt: row.joined_at,
                        lastActiveAt: row.last_active_at,
                        createdAt: row.created_at,
                        updatedAt: row.updated_at
                    } as MotionParticipantPathV2;
                });
            }
        }
    }

    if (userId) {
        // Load Process Checks
        const { data: pc } = await supabase.from('process_checks').select('*').eq('user_id', userId);
        if (pc && pc.length > 0) {
            pc.forEach((row: any) => {
                this.data[row.id] = {
                    id: row.id,
                    type: 'ProcessCheck',
                    motionSessionId: row.motion_session_id,
                    processName: row.process_name,
                    operatorId: row.operator_id,
                    findings: row.findings,
                    wasteTypes: row.waste_types,
                    targetCycleTime: row.target_cycle_time,
                    actualCycleTime: row.actual_cycle_time,
                    createdAt: row.created_at,
                    updatedAt: row.updated_at
                } as ProcessCheck;
            });
            updated = true;
        }

        // Load Improvement Cards
        const { data: ic } = await supabase.from('improvement_cards').select('*').eq('user_id', userId);
        if (ic && ic.length > 0) {
            ic.forEach((row: any) => {
                this.data[row.id] = {
                    id: row.id,
                    type: 'ImprovementCard',
                    linkedProcessCheckId: row.process_check_id,
                    title: row.title,
                    owner: row.owner,
                    status: row.status,
                    countermeasure: row.countermeasure,
                    beforeCondition: row.before_condition,
                    afterCondition: row.after_condition,
                    expectedFieldExits: row.expected_field_exits,
                    measuredFieldExits: row.measured_field_exits,
                    expectedDistance: row.expected_distance,
                    measuredDistance: row.measured_distance,
                    nextAction: row.next_action,
                    createdAt: row.created_at,
                    updatedAt: row.updated_at
                } as ImprovementCard;
            });
            updated = true;
        }

        // Load Cycle Times
        const { data: ct } = await supabase.from('cycle_times').select('*').eq('user_id', userId);
        if (ct && ct.length > 0) {
            ct.forEach((row: any) => {
                this.data[row.id] = {
                    id: row.id,
                    type: 'CycleTime',
                    stationName: row.station_name,
                    operatorsCount: row.operators_count,
                    workContent: row.work_content,
                    recordedTimes: row.recorded_times,
                    createdAt: row.created_at,
                    updatedAt: row.updated_at
                } as import('../types/improvement').CycleTime;
            });
            updated = true;
        }
    }

    if (updated) {
        this.save(); // Also persists any incoming data locally so UX remains fast
    }

    // Push local changes up to cloud (so `syncFromCloud()` acts as a full bi-directional sync)
    // In a real production app we'd track a "dirty" flag or "last modified" timestamp
    // to avoid uploading everything, but for Beta this ensures persistence.
    for (const item of Object.values(this.data)) {
        // Only push if it's authored by the current user or guest (we rely on RLS/Checks in upsertToCloud)
        await this.upsertToCloud(item);
    }
  }
}

export const ImprovementEngine = new ImprovementEngineService();
