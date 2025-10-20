import { Component, AfterViewInit, output, EventEmitter, Output, Input, OnDestroy, ViewChild, ElementRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @Output()location=new EventEmitter()
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef<HTMLDivElement>;
  
  private map?: L.Map;
  private marker?: L.Marker;
  private mutationObserver?: MutationObserver;
  
  @Input()lat: any = 0;
  @Input()lng: any = 0;
  
  // Add loading state
  public isLoading: boolean = true;
  
  // Generate unique ID for each map instance
  public mapId: string = 'map-' + Math.random().toString(36).substr(2, 9);


  ngAfterViewInit(): void {
    // Use MutationObserver to detect when the map container is actually in the DOM
    this.waitForMapContainer().then(() => {
      this.initMap();
    });
  }

  private getCurrentLocationFast(): void {
    if (navigator.geolocation) {
      console.log('Getting current location...');
      
      // Set default location immediately to prevent gray map
      this.lat = 24.7136; // Riyadh default
      this.lng = 46.6753;
      this.location.emit({lat: this.lat, lng: this.lng});
      
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
          // Keep using the default location already set
          console.log('Using fallback location: Riyadh');
        },
        {
          timeout: 3000, // Reduced from 10 seconds to 3 seconds
          enableHighAccuracy: false, // Faster, less accurate location
          maximumAge: 600000 // Cache location for 10 minutes
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
          this.mutationObserver?.disconnect();
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
      }, 500); // Reduced from 1000ms to 500ms for faster initialization
    });
  }

  private updateMapToNewLocation(): void {
    if (this.map && this.marker && this.lat && this.lng) {
      console.log('Updating map to new location:', this.lat, this.lng);
      
      // Convert to numbers if they're strings
      const newLat = typeof this.lat === 'string' ? parseFloat(this.lat) : this.lat;
      const newLng = typeof this.lng === 'string' ? parseFloat(this.lng) : this.lng;
      
      // Validate coordinates
      if (!isNaN(newLat) && !isNaN(newLng) && newLat !== 0 && newLng !== 0) {
        const newLatLng = L.latLng(newLat, newLng);
        
        // Update map view and marker position
        this.map.setView(newLatLng, 13);
        this.marker.setLatLng(newLatLng);
        
        // Update component properties
        this.lat = newLat;
        this.lng = newLng;
        
        console.log('Map updated successfully to:', newLat, newLng);
      } else {
        console.warn('Invalid coordinates provided:', newLat, newLng);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Check if lat or lng inputs have changed after initial load
    if ((changes['lat'] || changes['lng']) && !changes['lat']?.firstChange && !changes['lng']?.firstChange) {
      console.log('Map inputs changed - lat:', this.lat, 'lng:', this.lng);
      
      // Update map location if map is already initialized
      if (this.map && this.marker) {
        this.updateMapToNewLocation();
      }
    }
  }

  ngOnInit(){
    console.log('Map component initialized with lat:', this.lat, 'lng:', this.lng);
    
    // Only get current location if no valid coordinates provided
    if ((!this.lat || this.lat == 0 || this.lat === '0') && (!this.lng || this.lng == 0 || this.lng === '0')) {
      console.log('No valid coordinates provided, getting current location...');
      this.getCurrentLocationFast();
    } else {
      console.log('Valid coordinates provided:', this.lat, this.lng);
    }
  }

  private initMap(): void {
    try {
      // Fix Leaflet marker icons issue
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      // Convert lat and lng to numbers and validate
      const mapLat = this.lat && this.lat !== '0' ? Number(this.lat) : 24.7136;
      const mapLng = this.lng && this.lng !== '0' ? Number(this.lng) : 46.6753;

      console.log('Initializing map with coordinates:', mapLat, mapLng);

      // Initialize map
      this.map = L.map(this.mapContainer.nativeElement, {
        center: [mapLat, mapLng],
        zoom: 13,
        zoomControl: true,
        attributionControl: true
      });

      // Add tile layer with error handling and performance optimizations
      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors',
        crossOrigin: true,
        // Add loading optimization
        updateWhenIdle: false,
        updateWhenZooming: false,
        keepBuffer: 2
      });
      
      tileLayer.on('tileerror', (error: any) => {
        console.error('Tile loading error:', error);
        // Try alternative tile server
        const backupTileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap contributors'
        });
        backupTileLayer.addTo(this.map!);
      });
      
      tileLayer.on('load', () => {
        console.log('Map tiles loaded successfully');
        this.isLoading = false;
      });
      
      tileLayer.addTo(this.map);

      // Add draggable marker (using default icon set above)
      console.log('Creating marker at coordinates:', mapLat, mapLng);
      this.marker = L.marker([mapLat, mapLng], { 
        draggable: true
      }).addTo(this.map);
      console.log('Marker created and added to map:', this.marker);

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
        this.marker?.setLatLng(clickedLatLng);
        
        // Update component properties
        this.lat = clickedLatLng.lat;
        this.lng = clickedLatLng.lng;
        
        // Emit location change
        this.location.emit({ lat: this.lat, lng: this.lng });
      });

      // Set loading to false after a short delay if tiles don't load
      setTimeout(() => {
        if (this.isLoading) {
          this.isLoading = false;
          console.log('Map loading timeout reached, showing map anyway');
        }
      }, 2000);

      console.log('Map initialized successfully');
      
    } catch (error: any) {
      console.error('Error initializing map:', error);
      this.isLoading = false;
    }
  }



  ngOnDestroy(): void {
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