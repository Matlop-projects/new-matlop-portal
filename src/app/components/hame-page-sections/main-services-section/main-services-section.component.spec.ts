import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainServicesSectionComponent } from './main-services-section.component';

describe('MainServicesSectionComponent', () => {
  let component: MainServicesSectionComponent;
  let fixture: ComponentFixture<MainServicesSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainServicesSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainServicesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
