import $http from "axios";

export default class Auth {
    protected static CREATE_TOKEN_ROUTE = "/tokens";
    protected static FORGOTTEN_PASSWORD_ROUTE = "/users/reset-password";
    protected static RESET_PASSWORD_ROUTE = "/users/reset-password-token";

    public static goToSsoAuthentication(ssoUrl: string, redirectionUrl: string, currentUrl: string): void {
        localStorage.setItem("lastRoute",  currentUrl);
        location.href = ssoUrl + redirectionUrl;
    }

    public static setAccessToken(accessToken: string): void {
        localStorage.setItem("access_token", accessToken);
    }

    public static getAccessToken(): string|null {
        return localStorage.getItem("access_token");
    }

    public static disconnect(): void {
        localStorage.removeItem("access_token");
    }

    public static getLastRoute(): string {
        const lastRoute = localStorage.getItem("lastRoute");
        localStorage.removeItem("lastRoute");

        if (lastRoute) {
            return lastRoute;
        }

        return "/";
    }

    public static ssoAuthenticate(
        authUrl: string,
        applicationId: string,
        ssoToken: string
    ): Promise<string> {
        return this.authenticate(authUrl, applicationId, this.getSsoHeaders(ssoToken));
    }

    public static basicAuthenticate(
        authUrl: string,
        applicationId: string,
        username: string,
        password: string
    ): Promise<string> {
        return this.authenticate(authUrl, applicationId, this.getBasicHeaders(username, password));
    }

    public static tokenAuthenticate(
        authUrl: string,
        applicationId: string,
        token: string
    ): Promise<string> {
        return this.authenticate(authUrl, applicationId, this.getTokenHeaders(token));
    }

    protected static authenticate(
        authUrl: string,
        applicationId: string,
        headers: { [key: string]: string }
    ): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const form = new FormData();
            form.append("applicationId", applicationId);
            $http.request(
                {
                    url: authUrl + this.CREATE_TOKEN_ROUTE,
                    params: {
                        alternativeRedirectUrl: window.location.protocol+"//"+window.location.hostname+"/token"
                    },
                    headers: {
                        ...headers,
                        "Content-Type": "multipart/form-data"
                    },
                    method: "POST",
                    data: form
                }
            ).then((response) => {
                this.setAccessToken(response.data);
                resolve(response.data);
            }).catch((error) => {
                this.disconnect();
                reject(error);
            });
        });
    }

    public static getSsoHeaders(ssoToken: string): { [key: string]: string } {
        return {
            "X-AUTH-CODE": ssoToken,
        };
    }

    public static getBasicHeaders(username: string, password: string): { [key: string]: string } {
        return {
            Authorization: "Basic " + Buffer.from(`${username}:${password}`).toString("base64"),
        };
    }

    public static getTokenHeaders(token: string): { [key: string]: string } {
        return {
            Authorization: "Bearer " + token,
        };
    }

    public static forgottenPassword(
        authUrl: string,
        applicationId: string,
        email: string,
        resetUrl: string
    ): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const form = new FormData();
            form.append("application-id", applicationId);
            form.append("email", email);
            form.append("templated-url", resetUrl);
            $http.request(
                {
                    url: authUrl + this.FORGOTTEN_PASSWORD_ROUTE,
                    headers: {
                        "Content-Type": "multipart/form-data"
                    },
                    method: "POST",
                    data: form
                }
            ).then(() => {
                resolve();
            }).catch(() => {
                reject();
            });
        });
    }

    public static resetPassword(authUrl: string, token: string, password: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const form = new FormData();
            form.append("token", token);
            form.append("password", password);
            $http.request(
                {
                    url: authUrl + this.RESET_PASSWORD_ROUTE,
                    headers: {
                        "Content-Type": "multipart/form-data"
                    },
                    method: "POST",
                    data: form
                }
            ).then(() => {
                resolve();
            }).catch(() => {
                reject();
            });
        });
    }
}
