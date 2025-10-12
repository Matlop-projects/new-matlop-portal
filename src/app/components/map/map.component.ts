import { Component, AfterViewInit, output, EventEmitter, Output, Input, OnDestroy, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
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
    console.log('Map component initialized with lat:', this.lat, 'lng:', this.lng);
    
    // Get user's current location if no coordinates provided
    if ((!this.lat || this.lat == 0) && (!this.lng || this.lng == 0)) {
      this.getCurrentLocation();
    }
  }
  ngAfterViewInit(): void {
    // Use MutationObserver to detect when the map container is actually in the DOM
    this.waitForMapContainer().then(() => {
      this.initMap();
    });
  }

  private getCurrentLocation(): void {
    if (navigator.geolocation) {
      console.log('Getting current location...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Location found:', position.coords.latitude, position.coords.longitude);
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          
          // Emit the location change
          this.location.emit({lat: this.lat, lng: this.lng});
          
          // If map is already initialized, update it
          if (this.map && this.marker) {
            this.updateMapLocation();
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to default location (Riyadh, Saudi Arabia)
          this.lat = 24.7136;
          this.lng = 46.6753;
          console.log('Using fallback location: Riyadh');
          
          // Emit the fallback location
          this.location.emit({lat: this.lat, lng: this.lng});
          
          // If map is already initialized, update it
          if (this.map && this.marker) {
            this.updateMapLocation();
          }
        },
        {
          timeout: 10000, // 10 second timeout
          enableHighAccuracy: true, // More accurate location
          maximumAge: 300000 // Cache location for 5 minutes
        }
      );
    } else {
      console.log('Geolocation not supported, using default location');
      // Fallback to default location
      this.lat = 24.7136;
      this.lng = 46.6753;
      this.location.emit({lat: this.lat, lng: this.lng});
    }
  }

  private updateMapLocation(): void {
    if (this.map && this.marker) {
      const newLatLng = L.latLng(this.lat, this.lng);
      this.map.setView(newLatLng, 13);
      this.marker.setLatLng(newLatLng);
    }
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
    try {
      console.log('Initializing map with coordinates:', this.lat, this.lng);
      
      // Ensure we have valid coordinates
      const mapLat = this.lat || 24.7136; // Default to Riyadh
      const mapLng = this.lng || 46.6753;
      
      // Use ViewChild reference instead of getElementById
      if (!this.mapContainer || !this.mapContainer.nativeElement) {
        console.error('Map container ViewChild reference not available');
        this.isLoading = false;
        return;
      }

      // Create the map
      this.map = L.map(this.mapContainer.nativeElement, {
        center: [mapLat, mapLng],
        zoom: 13,
        zoomControl: true,
        attributionControl: false
      });

      // Add tile layer with error handling
      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      });
      
      tileLayer.on('tileerror', (error) => {
        console.error('Tile loading error:', error);
      });
      
      tileLayer.addTo(this.map);

      // Fix icon paths for markers
      const iconRetinaUrl = 'assets/marker-icon-2x.png';
      const iconUrl = 'assets/marker-icon.png';
      const shadowUrl = 'assets/marker-shadow.png';
      const iconDefault = L.icon({
        iconRetinaUrl,
        iconUrl,
        shadowUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41]
      });
      L.Marker.prototype.options.icon = iconDefault;

      // Add draggable marker
      this.marker = L.marker([mapLat, mapLng], { draggable: true }).addTo(this.map);

      // Handle marker drag events
      this.marker.on('dragend', (event: any) => {
        const marker = event.target;
        const position = marker.getLatLng();
        console.log('Marker dragged to:', position.lat, position.lng);
        
        // Update component properties
        this.lat = position.lat;
        this.lng = position.lng;
        
        // Emit location change
        this.location.emit({ lat: this.lat, lng: this.lng });
      });

      // Handle map click events
      this.map.on('click', (event: any) => {
        const clickedLatLng = event.latlng;
        console.log('Map clicked at:', clickedLatLng.lat, clickedLatLng.lng);
        
        // Move marker to clicked position
        this.marker.setLatLng(clickedLatLng);
        
        // Update component properties
        this.lat = clickedLatLng.lat;
        this.lng = clickedLatLng.lng;
        
        // Emit location change
        this.location.emit({ lat: this.lat, lng: this.lng });
      });

      console.log('Map initialized successfully');
      
    } catch (error) {
      console.error('Error initializing map:', error);
    }
    
    // Set loading to false after map is created
    this.isLoading = false;
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