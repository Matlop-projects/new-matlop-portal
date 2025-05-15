import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialOrderPageComponent } from './special-order-page.component';

describe('SpecialOrderPageComponent', () => {
  let component: SpecialOrderPageComponent;
  let fixture: ComponentFixture<SpecialOrderPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialOrderPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialOrderPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
