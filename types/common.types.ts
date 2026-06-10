export interface SelectOption {
  label: string;
  value: string;
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

export interface FilterState {
  search: string;
  status?: string;
  category?: string;
  dateRange?: {
    from: string;
    to: string;
  };
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
