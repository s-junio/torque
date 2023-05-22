// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::sync::Mutex;
use sysinfo::{CpuExt, DiskExt, System, SystemExt};
use tauri::State;

struct SystemWrapper {
    sys: Mutex<System>,
}

fn main() {
    tauri::Builder::default()
        .manage(SystemWrapper {
            sys: Mutex::new(System::new_all()),
        })
        .invoke_handler(tauri::generate_handler![get_system_info])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[derive(serde::Serialize)]

struct SystemDisk {
    name: String,
    available_space: u64,
    total_space: u64,
}
#[derive(serde::Serialize)]

struct SystemInfo {
    total_memory: u64,
    used_memory: u64,
    os: Option<String>,
    os_version: Option<String>,
    kernel_version: Option<String>,
    host_name: Option<String>,
    cpu_count: usize,
    cpu_usage: f32,
    disks: Vec<SystemDisk>,
}

#[tauri::command]
fn get_system_info(state: State<SystemWrapper>) -> SystemInfo {
    let mut sys = state.sys.lock().unwrap();

    sys.refresh_all();

    let mut disks: Vec<SystemDisk> = Vec::new();

    for disk in sys.disks() {
        disks.push(SystemDisk {
            available_space: disk.available_space(),
            total_space: disk.total_space(),
            name: disk.name().to_string_lossy().to_owned().to_string(),
        });
    }

    let system_info = SystemInfo {
        total_memory: sys.total_memory(),
        used_memory: sys.used_memory(),
        os: sys.name(),
        os_version: sys.os_version(),
        kernel_version: sys.kernel_version(),
        cpu_count: sys.cpus().len(),
        host_name: sys.host_name(),
        cpu_usage: sys.global_cpu_info().cpu_usage(),
        disks: disks,
    };

    println!("getting components/DISKS");

    for component in sys.components() {
        println!("{:?}", component);
    }

    println!("done components/DISKS");

    println!("=> system:");
    println!("cpu usage: {}%", system_info.cpu_usage);
    // RAM and swap information:
    println!("total memory: {} bytes", system_info.total_memory);
    println!("used memory : {} bytes", system_info.used_memory);

    // Display system information:
    println!("System name:             {:?}", system_info.os);
    println!("System kernel version:   {:?}", system_info.kernel_version);
    println!("System OS version:       {:?}", system_info.os_version);
    println!("System host name:        {:?}", system_info.host_name);

    // Number of CPUs:
    println!("NB CPUs: {}", system_info.cpu_count);

    return system_info;
}
