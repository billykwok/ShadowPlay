/// <reference path="chrome/chrome.d.ts" />

declare module chrome.serial {

     export interface ConnectionInfo {
        connectionId: number;
        paused: boolean;
        persistent: boolean;
        name: string;
        bufferSize: number;
        receiveTimeout: number;
        sendTimeout: number;
        bitrate?: number;
        dataBits?: string;
        parityBit?: string;
        stopBits?: string;
        ctsFlowControl?: boolean;
    }

    export interface ConnectionOptions {
        persistent?: boolean;
        name?: string;
        bufferSize?: number;
        bitrate?: number;
        dataBits?: string;
        parityBit?: string;
        stopBits?: string;
        ctsFlowControl?: boolean;
        receiveTimeout?: number;
        sendTimeout?: number;
    }

    export interface DeviceInfo {
        path: string;
        vendorId?: number;
        productId?: number;
        displayName?: string;
    }

    interface SendInfo {
        bytesSent: number;
        error?: string;
    }

    interface Signals {
        dcd: boolean;
        cts: boolean;
        ri: boolean;
        dsr: boolean;
    }

    interface SignalChange {
        dtr?: boolean;
        rts?: boolean;
    }

    export function getDevices(callback?: (objs: Array<DeviceInfo>) => void): void;
    export function connect(path: string, options?: ConnectionOptions, callback?: (info: ConnectionInfo) => void): void;
    export function update(connectionId: number, options?: ConnectionOptions, callback?: (result: boolean) => void): void;
    export function disconnect(connectionId: number, callback?: (result: boolean) => void): void;
    export function setPaused(connectionId: number, paused: boolean, callback?: () => void): void;
    export function getInfo(connectionId: number, callback?: (info: ConnectionInfo) => void): void;
    export function getConnections(callback?: (infos: Array<ConnectionInfo>) => void): void;
    export function send(connectionId: number, data: ArrayBuffer, callback?: (sendInfo: SendInfo) => void): void;
    export function flush(connectionId: number, callback?: (result: boolean) => void): void;
    export function getControlSignals(connectionId: number, callback?: (signal: Signals) => void): void;
    export function setControlSignals(connectionId: number, signals: SignalChange, callback?: (result: boolean) => void): void;

    interface OnReceiveEvent extends chrome.events.Event {
        addListener(callback: (info: {
            connectionId: number;
            data: ArrayBuffer;
        }) => void): void;
    }

    interface OnReceiveErrorEvent extends chrome.events.Event {
        addListener(callback: (info: {
            connectionId: number;
            error: string;
        }) => void): void;
    }

    var onReceive: OnReceiveEvent;
    var onReceiveError: OnReceiveErrorEvent;
}