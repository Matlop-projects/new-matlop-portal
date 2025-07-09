import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialOrderListComponent } from './special-order-list.component';

describe('SpecialOrderListComponent', () => {
  let component: SpecialOrderListComponent;
  let fixture: ComponentFixture<SpecialOrderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialOrderListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
