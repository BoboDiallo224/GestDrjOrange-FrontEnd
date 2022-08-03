import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {AuthService} from '../auth/auth.service';
import {AuthLoginInfo} from '../auth/login-info';
import {User} from '../auth/user';



declare var $:any;

@Component({
    moduleId:module.id,
    selector: 'app-login',
    templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit{
    constructor(public auth: AuthService,
                private router: Router) {

    }

    loginInfo: AuthLoginInfo = new AuthLoginInfo();

    loginErrors = {username: false, password: false};

    usernameErrorHint: string;

    ngOnInit(){
    }

    login() {

        this.usernameErrorHint = "Username is required";

        this.loginErrors.username = !this.loginInfo.username;
        this.loginErrors.password = !this.loginInfo.password;

        //console.log(this.loginInfo);

        if (this.loginErrors.password || this.loginErrors.username) return;

        this.auth.attemptAuth(this.loginInfo).subscribe((response) => {
                if (response.status == "success") {
                    let user = new User();
                    user.username = this.loginInfo.username;
                    user.token = response.token;
                    user.authorities = response.authorities;
                    this.auth.storeUser(user);
                    //console.log(response.authorities[0]);
                    //window.location.reload();
                    this.router.navigateByUrl("/")
                } else {
                    this.loginInfo.password = "";
                    this.usernameErrorHint = "These credentials do not match our records";
                    this.loginErrors.username = true;
                    this.loginErrors.password = true;
                }
            },
            (error) => { console.log(error) }
        )
    }

   /* ngOnDestroy(){
        var body = document.getElementsByTagName('body')[0];
        body.classList.remove('login-page');
    }
    sidebarToggle(){
        var toggleButton = this.toggleButton;
        var body = document.getElementsByTagName('body')[0];
        var sidebar = document.getElementsByClassName('navbar-collapse')[0];
        if(this.sidebarVisible == false){
            setTimeout(function(){
                toggleButton.classList.add('toggled');
            },500);
            body.classList.add('nav-open');
            this.sidebarVisible = true;
        } else {
            this.toggleButton.classList.remove('toggled');
            this.sidebarVisible = false;
            body.classList.remove('nav-open');
        }
    }*/

}
