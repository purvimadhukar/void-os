export type AppId = "terminal" | "ai" | "filemanager" | "editor" | "about";

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  isFocused: boolean;
}

export interface AppDefinition {
  id: AppId;
  label: string;
  icon: string;
  defaultSize: { width: number; height: number };
}

export interface FileNode {
  name: string;
  type: "file" | "dir";
  children?: FileNode[];
  content?: string;
}

export interface TerminalLine {
  type: "input" | "output" | "error" | "system";
  text: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
