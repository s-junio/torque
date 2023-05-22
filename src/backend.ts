import { invoke } from '@tauri-apps/api'

type SystemDisk = {
    name: String;
    total_space: number;
    available_space: number;
}

export type SystemInfo = {
    cpu_count: number;
    host_name: string;
    kernel_version: string;
    os: string;
    os_version: string;
    total_memory: number;
    used_memory: number;
    cpu_usage: number,
    disks: SystemDisk[]
}

export async function getSystemInfo() {
    const systemInfo = await invoke<SystemInfo>('get_system_info');
    console.log(systemInfo);

    return systemInfo;

}