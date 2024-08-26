import Notify from "simple-notify";
import "simple-notify/dist/simple-notify.css";

export class Cookie {
  constructor() {}

  public get(name: string) {
    const cookies = document.cookie.split(";");
    const cookie = cookies.find((c) => c.trim().startsWith(name + "="));
    return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
  }
  public set(name: string, value: string) {
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/`;
  }
  public remove(name: string) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}

export function validateWebsiteUrl(url: string): boolean {
  const pattern =
    /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  return pattern.test(url);
}

class Notification {
  constructor() {}

  public success({ title, text = "" }: { title?: string; text: string }) {
    new Notify({ status: "success", title, text });
  }

  public error({ title, text = "" }: { title?: string; text: string }) {
    new Notify({ status: "error", title, text });
  }
  public info({ title, text = "" }: { title?: string; text: string }) {
    new Notify({ status: "info", title, text });
  }
}

export const notification = new Notification();
