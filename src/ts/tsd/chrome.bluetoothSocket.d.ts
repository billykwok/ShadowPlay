/// <reference path="chrome/chrome.d.ts" />

declare module chrome.bluetoothSocket {

	export interface SocketProperties {
        persistent?: boolean;
        name?: string;
        bufferSize?: number;
    }

    export interface ListenOptions {
        channel?: number;
        psm?: number;
        backlog?: number;
    }

    export interface SocketInfo {
        socketId: number;
        persistent: boolean;
        name?: string;
        bufferSize?: number;
        paused: boolean;
        connected: boolean;
        address?: string;
        uuid?: string;
    }

    export interface CreateInfo {
		socketId: number;
    }

    export interface OnAcceptInfo {
		socketId: number;
		clientSocketId: number;
    }

    export interface OnAcceptErrorInfo {
		socketId: number;
		errorMessage: string;
		error: string;
    }

    export interface OnReceiveInfo {
		socketId: number;
		data: ArrayBuffer;
	}

	export interface OnReceiveErrorInfo {
		socketId: number;
		errorMessage: string;
		error: string;
	}

    export function create(properties?: SocketProperties, callback?: (createInfo: CreateInfo) => void): void;
    export function update(socketId: number, properties: SocketProperties, callback?: () => void): void;
    export function setPaused(socketId: number, paused: boolean, callback?: () => void): void;
    export function listenUsingRfcomm(socketId: number, uuid: string, options?: ListenOptions, callback?: () => void): void;
    export function listenUsingL2cap(socketId: number, uuid: string, options?: ListenOptions, callback?: () => void): void;
    export function connect(socketId: number, address: string, uuid: string, callback: () => void): void;
    export function disconnect(socketId: number, callback?: () => void): void;
    export function close(socketId: number, callback?: () => void): void;
    export function send(socketId: number, data: ArrayBuffer, callback?: (bytesSent: number) => void): void;
    export function getInfo(socketId: number, callback: (socketInfo: SocketInfo) => void): void;
    export function getSockets(callback: (sockets: Array<SocketInfo>) => void): void;

    interface OnAcceptEvent extends chrome.events.Event {
        addListener(callback: (info: OnAcceptInfo) => void): void;
    }

    interface OnAcceptErrorEvent extends chrome.events.Event {
        addListener(callback: (info: OnAcceptErrorInfo) => void): void;
    }

    interface OnReceiveEvent extends chrome.events.Event {
        addListener(callback: (info: OnReceiveInfo) => void): void;
    }

    interface OnReceiveErrorEvent extends chrome.events.Event {
        addListener(callback: (info: OnReceiveErrorInfo) => void): void;
    }

    var onAccept: OnAcceptEvent;
    var onAcceptError: OnAcceptErrorEvent;
    var onReceive: OnReceiveEvent;
    var onReceiveError: OnReceiveErrorEvent;
}