import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowWeWorkSectionComponent } from './how-we-work-section.component';

describe('HowWeWorkSectionComponent', () => {
  let component: HowWeWorkSectionComponent;
  let fixture: ComponentFixture<HowWeWorkSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HowWeWorkSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HowWeWorkSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
