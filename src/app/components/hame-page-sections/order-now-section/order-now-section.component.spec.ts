import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNowSectionComponent } from './order-now-section.component';

describe('OrderNowSectionComponent', () => {
  let component: OrderNowSectionComponent;
  let fixture: ComponentFixture<OrderNowSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderNowSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderNowSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
