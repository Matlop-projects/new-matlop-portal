import { Component, AfterViewInit, output, EventEmitter, Output, Input } from '@angular/core';
import * as L from 'leaflet';
@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements AfterViewInit {
  @Output()location=new EventEmitter()
  private map!: L.Map;
  private marker!: L.Marker;
  @Input()lat: any = 0;
  @Input()lng: any = 0;

  ngOnInit(){
 console.log('tt',this.lat)
 console.log('tt',this.lng)

  }
  ngAfterViewInit(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.lat = this.lat==0?position.coords.latitude:this.lat;
          this.lng = this.lng==0?position.coords.longitude:this.lng;
          this.initMap(); // Initialize map after getting location
        },
        () => {
  
          this.initMap();
        }
      );
    } else {
  
      this.initMap();
    }
  
  }

  private initMap(): void {
    this.map = L.map('map').setView([this.lat, this.lng], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '',
    }).addTo(this.map);

    // Add a draggable marker
    this.marker = L.marker([this.lat, this.lng], { draggable: true })
      .addTo(this.map)
      // .bindPopup('Drag me!')
      .openPopup();
    // Update lat/lng when dragged
    this.marker.on('dragend', (event: any) => {
      const position = event.target.getLatLng();
      this.lat = position.lat;
      this.lng = position.lng;
      this.location.emit({lat:this.lat,lng:this.lng})
    });

  }
}