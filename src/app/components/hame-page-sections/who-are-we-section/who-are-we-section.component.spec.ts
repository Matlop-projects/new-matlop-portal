import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoAreWeSectionComponent } from './who-are-we-section.component';

describe('WhoAreWeSectionComponent', () => {
  let component: WhoAreWeSectionComponent;
  let fixture: ComponentFixture<WhoAreWeSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhoAreWeSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhoAreWeSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
