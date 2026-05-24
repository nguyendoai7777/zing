export interface HttpResponseBase<T = any> {
  data: T;
  success: boolean;
}
