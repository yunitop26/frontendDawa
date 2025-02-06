import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDataGuessComponent } from './view-data-guess.component';

describe('ViewDataGuessComponent', () => {
  let component: ViewDataGuessComponent;
  let fixture: ComponentFixture<ViewDataGuessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDataGuessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDataGuessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
