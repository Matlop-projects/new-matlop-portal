import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable, take, catchError, throwError, tap } from 'rxjs';
import { ToasterService } from './toaster.service';

export interface IOptions {
  showAlert: boolean;
  message: string;
}

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private toaster = inject(ToasterService);

  constructor(private http: HttpClient) { }

  login(object: any): Observable<any> {
    return this.http.post(baseUrl + `Authentication/login`, object).pipe(
      take(1),
      catchError((error) => {
        // this.toaster.errorToaster(error?.error?.message || 'shared.errors.login');
        return throwError(() => error);
      })
    );
  }


  post(APIName: string, body: any): Observable<any> {
    return this.http.post(`${baseUrl}${APIName}`, body).pipe(
      take(1),
      tap((res: any) => {
        if (res?.message != 'No data found' && res?.message != null) {
          this.toaster.successToaster(res.message);
        }
      }),
      catchError((error) => {
        // this.toaster.errorToaster(error?.error?.message);
        return throwError(() => error);
      })
    );
  }
  

  get<T>(APIName: string, params?: any, options: IOptions = { showAlert: false, message: '' }): Observable<T> {
    let queryString = '';

    if (params && Object.keys(params).length) {
      const queryParams: string[] = [];

      for (const key in params) {
        if (params[key] !== undefined && params[key] !== null) {
          queryParams.push(`${key}=${params[key]}`);
        }
      }

      if (queryParams.length) {
        queryString = `?${queryParams.join('&')}`;
      }
    }

    return this.http.get(`${baseUrl}${APIName}${queryString}`).pipe(
      take(1),
      map((res: any) => {
        if (res.message && options.showAlert) this.toaster.successToaster(res.message);
        return res;
      }),
      catchError((error) => {
        // this.toaster.errorToaster(error?.error?.message);
        return throwError(() => error);
      })
    );
  }


  put<T>(APIName: string, body: any, options: IOptions = { showAlert: false, message: '' }): Observable<T> {
    return this.http.put(`${baseUrl}${APIName}`, body).pipe(
      take(1),
      map((res: any) => {
        if (res.message)
          this.toaster.successToaster(res.message)
        return res;
      }),
      catchError((error) => {
        // this.toaster.errorToaster(error?.error?.message)
        return throwError(() => error);
      })
    );
  }

  putWithId<T>(APIName: string, id: any, options: IOptions = { showAlert: false, message: '' }): Observable<T> {
    return this.http.put(`${baseUrl}${APIName}=${id}`, {}).pipe(
      take(1),
      map((res: any) => {
        if (res.message)
          // this.ngxToaster.success(res.message)
        return res;
      }),
      catchError((error) => {
        this.toaster.errorToaster(error?.error?.message)
        return throwError(() => error);
      })
    );
  }

  delete<T>(APIName: string, id: string, options: IOptions = { showAlert: false, message: '' }): Observable<T> {
    return this.http.delete(`${baseUrl}${APIName}=${id}`).pipe(
      take(1),
      map((res: any) => {
        if (res.message)
          // this.ngxToaster.success(res.message)
        return res;
      }),
      catchError((error) => {
        this.toaster.errorToaster(error?.error?.message || 'shared.errors.delete_request')
        return throwError(() => error);
      })
    );
  }

  deleteWithoutParam<T>(APIName: string): Observable<T> {
    return this.http.delete(`${baseUrl}${APIName}`).pipe(
      take(1),
      map((res: any) => {
        if (res.message)
          // this.ngxToaster.success(res.message)
        return res;
      }),
      catchError((error) => {
        this.toaster.errorToaster(error?.error?.message || 'shared.errors.delete_request')
        return throwError(() => error);
      })
    );
  }

  // Get addresses by user ID
  getAddressesByUserId(userId: number): Observable<any> {
    return this.http.get(`${baseUrl}Location/GetByUserId/${userId}`).pipe(
      take(1),
      catchError((error) => {
        console.error('Error fetching addresses:', error);
        return throwError(() => error);
      })
    );
  }

  createAddress(addressData: any): Observable<any> {
    return this.http.post(`${baseUrl}Location/Create`, addressData).pipe(
      take(1),
      catchError((error) => {
        console.error('Error creating address:', error);
        return throwError(() => error);
      })
    );
  }

  updateAddress(addressData: any): Observable<any> {
    return this.http.put(`${baseUrl}Location/Update`, addressData).pipe(
      take(1),
      catchError((error) => {
        console.error('Error updating address:', error);
        return throwError(() => error);
      })
    );
  }

  deleteAddress(locationId: number): Observable<any> {
    return this.http.delete(`${baseUrl}Location/Delete?requestId=${locationId}`).pipe(
      take(1),
      catchError((error) => {
        console.error('Error deleting address:', error);
        return throwError(() => error);
      })
    );
  }
}
