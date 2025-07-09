import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergencyOrderListComponent } from './emergency-order-list.component';

describe('EmergencyOrderListComponent', () => {
  let component: EmergencyOrderListComponent;
  let fixture: ComponentFixture<EmergencyOrderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmergencyOrderListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmergencyOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
