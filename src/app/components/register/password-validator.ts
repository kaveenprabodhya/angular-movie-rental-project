import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class PasswordValidators {
  static patternValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const regex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$');
    const valid = regex.test(control.value);
    return valid ? null : { invalidPassword: true };
  }

  static checkPasswords: ValidatorFn = (
    controls: AbstractControl
  ): ValidationErrors | null => {
    let pass = controls.get('password');
    let confirmPass = controls.get('cpassword');

    if (confirmPass?.errors && !confirmPass.errors.matching) {
      return null;
    }

    if (pass?.value !== confirmPass?.value)
      controls.get('cpassword')?.setErrors({ matching: true });

    return pass?.value === confirmPass?.value ? null : { notSame: true };
  };
}
