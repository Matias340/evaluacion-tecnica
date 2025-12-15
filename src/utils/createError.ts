import { v4 as uuid } from "uuid";
import { BusinessErrorCode } from "../domain/businessErrorCodes";

export function createError(code: BusinessErrorCode, message: string) {
  return {
    id: uuid(),
    code,
    message,
    date: new Date().toISOString(),
  };
}
