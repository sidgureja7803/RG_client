// User types
export interface User {
  _id: string;
  username: string;
  email: string;
  profilePicture?: string;
  token?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Resume types
export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Style {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  padding?: number;
}

export interface Section {
  _id?: string;
  type: 'header' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'custom';
  title: string;
  position: Position;
  size: Size;
  content: any;
  style: Style;
}

export interface CanvasSize {
  width: number;
  height: number;
}

export interface PageSettings {
  pageSize: 'A4' | 'Letter' | 'Legal';
  orientation: 'portrait' | 'landscape';
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface Resume {
  _id?: string;
  name: string;
  user: string | User;
  template: string;
  sections: Section[];
  canvasSize: CanvasSize;
  pageSettings: PageSettings;
  collaborators?: string[] | User[];
  lastModified?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Template types
export interface Template {
  _id: string;
  name: string;
  previewImage: string;
  sections: any;
  style: {
    fontFamily: string;
    colors: string[];
    layout: string;
  };
  category: 'professional' | 'creative' | 'simple' | 'modern' | 'academic';
  isPublic: boolean;
  creator?: string | User;
  usageCount: number;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
} 