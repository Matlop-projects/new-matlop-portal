import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundImageWithTextComponent } from './background-image-with-text.component';

describe('BackgroundImageWithTextComponent', () => {
  let component: BackgroundImageWithTextComponent;
  let fixture: ComponentFixture<BackgroundImageWithTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackgroundImageWithTextComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackgroundImageWithTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
