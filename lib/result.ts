interface Ok<T> {
  ok: true
  data: T
}
interface Failed<E> {
  ok: false
  error: E
}
export type Result<T = void, E = string> = Ok<T> | Failed<E>

export function ok(): Ok<void>
export function ok<T>(data: T): Ok<T>
export function ok<T>(data?: T): Ok<T> {
  return { ok: true, data: data as T }
}
export function failed<E>(error: E): Failed<E> {
  return { ok: false, error }
}
