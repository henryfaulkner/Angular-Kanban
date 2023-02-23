import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Auth, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "@angular/fire/auth";

@Component({
  selector: 'app-email-login',
  templateUrl: './email-login.component.html',
  styleUrls: ['./email-login.component.scss']
})
export class EmailLoginComponent implements OnInit {
  form: FormGroup;
  type: 'login' | 'signup' | 'reset' = 'signup';
  loading = false;
  serverMessage: string;

  constructor(private afAuth: Auth, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.afAuth = getAuth();
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [Validators.required, Validators.minLength(6)]
      ],
      passwordConfirm: ['', []]
    });
  }

  changeType(val) {
    this.type = val;
  }

  get isLogin() {
    return this.type === 'login';
  }

  get isSignup() {
    return this.type === 'signup';
  }

  get isPasswordReset() {
    return this.type === 'reset';
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  get passwordConfirm() {
    return this.form.get('passwordConfirm');
  }

  get passwordDoesMatch() {
    if(this.type !== 'signup') {
      return true;
    } else {
      return this.password.value === this.passwordConfirm.value;
    }
  }

  async onSubmit() {
    this.loading = true;
    const email = this.email.value;
    const password = this.password.value;
    console.log('submit')
    console.log(this.isLogin)
    console.log(this.isSignup)
    console.log(this.isPasswordReset)

    try {
      if(this.isLogin) {
        await signInWithEmailAndPassword(this.afAuth, email, password)
          .then((userCredential) => {
            const user = userCredential.user
            console.log('success')
          })
          .catch((err) => {
            console.log('failure')
            throw err;
          });
      }
      if(this.isSignup) {
        await createUserWithEmailAndPassword(this.afAuth, email, password)
          .then((userCredential) => {
            const user = userCredential.user
            console.log('success')
          })
          .catch((err) => {
            console.log('failure')
            throw err;
          });
      }
    } catch (err) {
      this.serverMessage = err;
    }

    this.loading = false;
  }
}
