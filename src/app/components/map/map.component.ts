import { Component, AfterViewInit, output, EventEmitter, Output, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements AfterViewInit, OnDestroy {
  @Output()location=new EventEmitter()
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef<HTMLDivElement>;
  
  private map!: L.Map;
  private marker!: L.Marker;
  private mutationObserver!: MutationObserver;
  
  @Input()lat: any = 0;
  @Input()lng: any = 0;
  
  // Add loading state
  public isLoading: boolean = true;
  
  // Generate unique ID for each map instance
  public mapId: string = 'map-' + Math.random().toString(36).substr(2, 9);

  ngOnInit(){
 console.log('tt',this.lat)
 console.log('tt',this.lng)

  }
  ngAfterViewInit(): void {
    // Use MutationObserver to detect when the map container is actually in the DOM
    this.waitForMapContainer().then(() => {
      if (navigator.geolocation && this.lat == 0 && this.lng == 0) {
        // Add timeout and better options for geolocation
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
            this.initMap(); // Initialize map after getting location
          },
          () => {
            // Fallback to default location (Riyadh, Saudi Arabia)
            this.lat = 24.7136;
            this.lng = 46.6753;
            this.initMap();
          },
          {
            timeout: 5000, // 5 second timeout
            enableHighAccuracy: false, // Faster but less accurate
            maximumAge: 300000 // Cache location for 5 minutes
          }
        );
      } else {
        this.initMap();
      }
    });
  }

  private waitForMapContainer(): Promise<void> {
    return new Promise((resolve) => {
      // Check if container is already available
      if (this.mapContainer && this.mapContainer.nativeElement) {
        resolve();
        return;
      }

      // Use MutationObserver with more specific targeting
      this.mutationObserver = new MutationObserver(() => {
        if (this.mapContainer && this.mapContainer.nativeElement) {
          this.mutationObserver.disconnect();
          resolve();
        }
      });

      // Target the component's host element instead of document.body for better performance
      const hostElement = this.mapContainer?.nativeElement?.parentElement || document.body;
      this.mutationObserver.observe(hostElement, {
        childList: true,
        subtree: true,
        attributes: false, // Don't watch for attribute changes
        characterData: false // Don't watch for text changes
      });

      // Reduced timeout for faster fallback
      setTimeout(() => {
        if (this.mutationObserver) {
          this.mutationObserver.disconnect();
        }
        resolve();
      }, 1000); // Reduced from 2000ms to 1000ms
    });
  }

  private initMap(): void {
    // Use ViewChild reference instead of getElementById
    if (!this.mapContainer || !this.mapContainer.nativeElement) {
      console.error('Map container ViewChild reference not available');
      this.isLoading = false;
      return;
    }

    this.createMap();
    // Set loading to false after map is created
    this.isLoading = false;
  }

  private createMap(): void {
    // Use the ViewChild reference directly
    this.map = L.map(this.mapContainer.nativeElement).setView([this.lat, this.lng], 5);

    // Use faster tile provider with better caching
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '',
      maxZoom: 19,
      tileSize: 256,
      zoomOffset: 0,
      crossOrigin: true,
      // Add caching and performance options
      updateWhenIdle: true,
      updateWhenZooming: false,
      keepBuffer: 2
    }).addTo(this.map);

    // Fix Leaflet's default icon path issue
    const DefaultIcon = L.Icon.Default as any;
    delete DefaultIcon.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

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

  ngOnDestroy() {
    // Clean up MutationObserver
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
    
    // Clean up map resources when component is destroyed
    if (this.map) {
      this.map.remove();
    }
  }
}