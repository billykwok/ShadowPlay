/// <reference path="chrome/chrome.d.ts" />

declare module chrome.bluetooth {

     export interface AdapterState {
        address: string;
        name: string;
        powered: boolean;
        available: boolean;
        discovering: boolean;
    }

    export interface Device {
        address: string;
        name?: string;
        deviceClass?: number;
        vendorIdSource?: string;
        vendorId?: number;
        productId?: number;
        deviceId?: number;
        type?: string;
        paired?: boolean;
        connected?: boolean;
        uuids?: Array<string>;
        inquiryRssi?: number;
        inquiryTxPower?: number;
    }

    export function getAdapterState(callback: (adapterInfo: AdapterState) => void): void;
    export function getDevice(deviceAddress: string, callback: (deviceInfo: Device) => void): void;
    export function getDevices(callback: (deviceInfos: Array<Device>) => void): void;
    export function startDiscovery(callback?: () => void): void;
    export function stopDiscovery(callback?: () => void): void;

    interface OnAdapterStateChangedEvent extends chrome.events.Event {
        addListener(callback: (state: AdapterState) => void): void;
    }

    interface OnDeviceAddedEvent extends chrome.events.Event {
        addListener(callback: (device: Device) => void): void;
    }

    interface OnDeviceChangedEvent extends chrome.events.Event {
        addListener(callback: (device: Device) => void): void;
    }

    interface OnDeviceRemovedEvent extends chrome.events.Event {
        addListener(callback: (device: Device) => void): void;
    }

    var onAdapterStateChanged: OnAdapterStateChangedEvent;
    var onDeviceAdded: OnDeviceAddedEvent;
    var onDeviceChanged: OnDeviceChangedEvent;
    var onDeviceRemoved: OnDeviceRemovedEvent;
}