import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialServicesSectionComponent } from './special-services-section.component';

describe('SpecialServicesSectionComponent', () => {
  let component: SpecialServicesSectionComponent;
  let fixture: ComponentFixture<SpecialServicesSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialServicesSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialServicesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
