export type FilterState = {
  text: string | JSX.Element,
  value: any
}[]
export type OptionState = {
  label: string | JSX.Element,
  value: string | boolean | number,
  disabled?: boolean
}[]
export interface InitalState {
  pagination: {
    current: number,
    pageSize: number,
    pageSizeOptions: number[],
    showSizeChanger: boolean,
    total?: number
  },
  filters?: {
    keyword?: string,
    [x: string]: any
  },
  sort?: {
    field?: string,
    order?: string
  },
  data?: any[],
  loading?: boolean,
  selectedRowKeys: any[],
  updated: number
}
export interface IAjax {
  field?: string,
  order?: string,
  pageSize: number | string,
  current: number | string,
  searchColumn: ColumnState,
  search?: {
    [key: string]: any
  }
}
export interface ResponseAjax<TData> {
  success: number,
  data?: TData[],
  recordsTotal?: number,
  recordsFiltered?: number,
  message?: string
}
export interface InitalProps {
  onReload?: () => void,
  setState?: React.Dispatch<React.SetStateAction<InitalState>>,
  state?: InitalState,
  item?: any,
  ids?: string[],
  filters?: {
    keyword?: string,
    [x: string]: string | undefined
  }
}