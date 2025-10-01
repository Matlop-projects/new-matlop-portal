import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SliderItem {
  sliderId: number;
  imageEn: string;
  imageAr: string;
  titleEn: string;
  titleAr: string;
  displayOrder: number;
  viewType: number;
}

export interface SliderResponse {
  code: number;
  message: string;
  data: SliderItem[];
}

@Injectable({
  providedIn: 'root'
})
export class SliderService {
  private apiUrl = 'https://backend.matlop.com/api/Slider/GetAll';

  constructor(private http: HttpClient) { }

  getSliders(): Observable<SliderResponse> {
    return this.http.get<SliderResponse>(this.apiUrl);
  }
}