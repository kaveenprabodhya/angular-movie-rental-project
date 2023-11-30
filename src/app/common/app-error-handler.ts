import { ErrorHandler } from '@angular/core';

export class AppErrorHandler extends ErrorHandler {
  handleError(error: any) {
    console.log('Unexpected error', error);
  }
}
