import { Injectable, signal } from '@angular/core';

// interface User {
//   username: string;
//   email: string;
//   mobile: string;
//   name: string | null;
// }

@Injectable({
  providedIn: 'root',
})
export class LoginSignalUserDataService {
  // ✅ Load user from localStorage or set it to null
  user = signal<any | null>(this.loadUserFromStorage());

  setUser(userData: any) {
    console.log('Setting user:', userData);
    this.user.set(userData);

    // ✅ Store user in localStorage
    localStorage.setItem('user', JSON.stringify(userData));
  }

  logout() {
    this.user.set(null);
    localStorage.removeItem('user'); // ✅ Remove from localStorage on logout
  }

  // ✅ Load user from localStorage (helper function)
  private loadUserFromStorage(): any | null {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  }
}
