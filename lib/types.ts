export type UUID = string;

export interface Category {
  id: UUID;
  name: string;
  colorHex: string;
  isActive: boolean;
  sortOrder: number;
}

export interface Subcategory {
  id: UUID;
  categoryId: UUID;
  name: string;
  colorHex?: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface EventItem {
  id: UUID;
  title: string;
  description?: string;
  categoryId: UUID;
  subcategoryId?: UUID | null;
  startsAt: string; // ISO
  endsAt: string; // ISO
  allDay: boolean;
  location?: string;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'BLOCKED' | 'DONE';
export type TaskPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export interface TaskItem {
  id: UUID;
  eventId?: UUID | null;
  title: string;
  description?: string;
  status: TaskStatus;
  position: number;
  priority: TaskPriority;
  dueDate?: string | null; // ISO
  assigneeId?: UUID | null;
}

export interface DataSnapshot {
  categories: Category[];
  subcategories: Subcategory[];
  events: EventItem[];
  tasks: TaskItem[];
}
